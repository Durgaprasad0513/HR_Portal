"""Rebuild offline project reference and commit tracker from local source/Git.

Reads tracked implementation/config files only; never loads runtime .env secrets.
Does not connect to databases, change Git state, or publish to Notion.
"""
from __future__ import annotations
import csv
import hashlib
import html
import json
import re
import subprocess
import zipfile
from collections import Counter
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'project-handbook'
OUT.mkdir(parents=True, exist_ok=True)
IST = timezone(timedelta(hours=5, minutes=30))

def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT).decode('utf-8', errors='replace')

def text(path):
    return (ROOT / path).read_text(encoding='utf-8-sig')

def safe(value):
    # Commit messages are evidence, but never preserve credential-shaped values.
    value = re.sub(r'(postgres(?:ql)?://)[^\s"<>]+', r'\1[redacted-connection]', value)
    value = re.sub(r'(?i)\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|AKIA[A-Z0-9]{16})\b', '[redacted-secret]', value)
    return value

def link(path, line=1):
    return f'{REMOTE}/blob/{HEAD}/{path}#L{line}'

HEAD = git('rev-parse', 'HEAD').strip()
REMOTE = git('remote', 'get-url', 'origin').strip().removesuffix('.git')
if not REMOTE.startswith('https://github.com/'):
    REMOTE = ''

def history():
    raw = git('log', '--format=%H%x00%aI%x00%cI%x00%an%x00%P%x00%s%x00%b%x1e', 'HEAD')
    commits = []
    for block in raw.split('\x1e'):
        parts = block.strip().split('\x00', 6)
        if len(parts) != 7:
            continue
        sha, authored, committed, author, parents, subject, body = parts
        commits.append(dict(sha=sha, authored=authored, committed=committed, author=author,
                            parents=parents.split(), title=safe(subject), body=safe(body.strip())))
    # Stable patch IDs identify identical changes replayed/cherry-picked in this history.
    proc = subprocess.Popen(['git', 'log', '--no-merges', '--format=%H', '-p', '--no-ext-diff', 'HEAD'], cwd=ROOT, stdout=subprocess.PIPE)
    ids = subprocess.check_output(['git', 'patch-id', '--stable'], stdin=proc.stdout, cwd=ROOT).decode()
    proc.stdout.close()
    if proc.wait() != 0:
        raise RuntimeError('Git patch extraction failed')
    patch = {sha: pid for pid, sha in (x.split() for x in ids.splitlines())}
    files = {}
    current = None
    for line in git('log', '--format=@@%H', '--name-only', '--no-renames', 'HEAD').splitlines():
        if line.startswith('@@'):
            current = line[2:]
            files[current] = []
        elif line.strip() and current:
            files[current].append(line.strip())
    groups = {}
    for c in commits:
        c['files'] = files.get(c['sha'], [])
        if len(c['parents']) > 1:
            continue
        key = patch.get(c['sha'], c['sha'])
        groups.setdefault(key, []).append(c)
    rows = []
    for pid, group in groups.items():
        group.sort(key=lambda c: (c['committed'], c['sha']))
        c = group[0]
        paths = sorted(set(p for g in group for p in g['files']))
        s = c['title'].lower()
        kind = ('Revert' if s.startswith('revert') else 'Fix' if re.search(r'^fix(?:\b|\()', s)
                else 'Test' if s.startswith('test') else 'Documentation' if s.startswith('docs')
                else 'Performance' if s.startswith('perf') else 'Feature' if s.startswith('feat')
                else 'Refactor' if s.startswith('refactor') else 'Change')
        modules = set(re.findall(r'(?:server/src/modules|client/src/pages)/([^/\n]+)/', '\n'.join(paths)))
        if any('/auth' in p or '/permissions' in p for p in paths):
            modules.add('access')
        if any(p.startswith(('.github/', 'render.', 'docker-compose')) or p.endswith(('Dockerfile', 'vercel.json')) for p in paths):
            modules.add('deployment')
        if any('prisma/migrations/' in p for p in paths):
            modules.add('database')
        if any('config/storage' in p for p in paths):
            modules.add('storage')
        rationale = c['body'].split('\nCo-Authored-By:')[0].strip()
        if rationale:
            reason, basis = rationale[:1600], 'Commit message'
        else:
            reason, basis = 'No separate reason recorded. Commit summary: ' + c['title'], 'Summary only'
        rows.append(dict(key='GIT-' + pid[:12], title=c['title'], kind=kind,
                         modules=', '.join(sorted(modules)) or 'repository',
                         state='Fix committed' if kind == 'Fix' else 'Recorded in Git',
                         raised=None, solved=None, production_verified=None,
                         authored=c['authored'], committed=c['committed'],
                         date=datetime.fromisoformat(c['committed']).astimezone(IST).isoformat(),
                         reason=reason, reason_basis=basis, sha=c['sha'],
                         aliases=[g['sha'] for g in group], patch_id=pid,
                         url=f'{REMOTE}/commit/{c["sha"]}', files=paths,
                         tests=[p for p in paths if re.search(r'(\.test\.|/tests/)', p)],
                         verification='No execution or production outcome inferred from commit history'))
    rows.sort(key=lambda c: c['date'], reverse=True)
    return commits, rows

def inventory():
    app = text('server/src/app.ts')
    imports = dict(re.findall(r"import (\w+) from '[^']*/([^/]+\.routes)';", app))
    routes = []
    for mount, var in re.findall(r"app\.use\('([^']+)', (\w+)\)", app):
        name = imports.get(var)
        if not name:
            continue
        candidates = list((ROOT/'server/src/modules').rglob(name+'.ts'))
        if not candidates:
            continue
        p = candidates[0]
        source = p.read_text(encoding='utf-8-sig')
        matches = list(re.finditer(r"router\.(get|post|put|patch|delete)\(\s*['\"]([^'\"]+)['\"]", source))
        for i, m in enumerate(matches):
            end = matches[i+1].start() if i+1 < len(matches) else len(source)
            chunk = source[m.start():end]
            before = source[:m.start()]
            guards = re.findall(r"(?:requirePermission|requireStaffView|authorize)\([^)]*\)", chunk)
            inherited = re.findall(r"router\.use\(([^;]+)\);", before)
            guards += ['router.use('+x+')' for x in inherited]
            schema = re.findall(r'validate\((\w+)\)', chunk)
            full = mount.rstrip('/') + (m[2] if m[2] != '/' else '')
            line = source[:m.start()].count('\n') + 1
            routes.append(dict(method=m[1].upper(), path=full, guards=guards,
                               validation=schema, file=p.relative_to(ROOT).as_posix(), line=line,
                               url=link(p.relative_to(ROOT).as_posix(), line)))
    schema = text('server/prisma/schema.prisma')
    models = []
    enums = []
    for typ, name, body in re.findall(r'^(model|enum) (\w+) \{\n(.*?)^\}', schema, re.M|re.S):
        item = dict(name=name, definition=body.strip(), line=schema[:schema.index(f'{typ} {name} {{')].count('\n')+1)
        (models if typ=='model' else enums).append(item)
    packages = {name:json.loads(text(path)) for name,path in [('root','package.json'),('client','client/package.json'),('server','server/package.json')]}
    source_files = [p for folder in ['server/src','client/src','server/tests'] for p in (ROOT/folder).rglob('*') if p.is_file()]
    return dict(routes=routes, models=models, enums=enums, packages=packages,
                source_files=len(source_files), source_lines=sum(len(p.read_text(encoding='utf-8-sig').splitlines()) for p in source_files if p.suffix in ['.ts','.tsx','.css']))

def md_inventory(inv):
    out=['# Generated code reference','',f'Snapshot: `{HEAD}`. Source inspection, not runtime verification.','',
         '## API route index','', 'Declared Express feature routes, including development-only maintenance endpoints. Inline permission calls and preceding router.use calls are listed; guards inside callbacks/controllers/services still apply. Read the linked route plus service before changing authorization. This is a source index, not a generated OpenAPI contract.','',
         '| Method | Route | Route guards | Validation schema | Source |','|---|---|---|---|---|']
    for r in inv['routes']:
        out.append('| '+ ' | '.join([r['method'], '`'+r['path']+'`',html.escape('; '.join(r['guards']) or 'Check handler / public route'), ', '.join(r['validation']) or 'Handler-specific', f'[source]({r["url"]})'])+' |')
    out += ['', 'Health and public image routes are mounted directly in server/src/app.ts and are described in the handbook.', '', '## Prisma data dictionary','',
            'Exact model fields, database mappings, relations, defaults, indexes, and uniqueness constraints follow. A model in the schema does not prove a corresponding UI/API workflow exists.','']
    for m in inv['models']:
        out += ['### '+m['name'],'', f'[Schema source]({link("server/prisma/schema.prisma",m["line"])})','', '```prisma',f'model {m["name"]} {{',m['definition'],'}','```','']
    out += ['## Enum and status vocabulary','']
    for m in inv['enums']:
        out += ['### '+m['name'],'','```prisma',m['definition'],'```','']
    out += ['## Runtime validation schemas','', 'Exact Zod definitions from each feature. These describe declared validation; consult the route index to see which schema is mounted for an endpoint. Authorization and service business rules remain separate.','']
    for p in sorted((ROOT/'server/src/modules').rglob('*.schema.ts')):
        rel=p.relative_to(ROOT).as_posix()
        out += ['### '+p.parent.name, '', f'[Schema source]({link(rel)})', '', '```typescript', p.read_text(encoding='utf-8-sig').strip(), '```', '']
    out += ['## Package scripts','']
    for name, pkg in inv['packages'].items():
        out += ['### '+name,'','| Script | Definition |','|---|---|']
        out += [f'| `{k}` | `{v}` |' for k,v in pkg.get('scripts',{}).items()]
        out += ['','Dependencies (versions declared by package.json; the lockfile determines installation):','']
        out += [f'- `{k}`: `{v}`' for k,v in {**pkg.get('dependencies',{}),**pkg.get('devDependencies',{})}.items()]
        out += ['']
    return '\n'.join(out)

def render_md(md):
    """Small, escaped renderer for this handbook's controlled Markdown subset."""
    def inline(s):
        s=html.escape(s)
        s=re.sub(r'`([^`]+)`',r'<code>\1</code>',s)
        s=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',s)
        s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',s)
        return s
    result=[]; lines=md.splitlines(); i=0
    while i<len(lines):
        s=lines[i]
        if s.startswith('```'):
            lang=s[3:]; code=[]; i+=1
            while i<len(lines) and not lines[i].startswith('```'):
                code.append(lines[i]); i+=1
            result.append('<pre data-lang="'+html.escape(lang)+'"><code>'+html.escape('\n'.join(code))+'</code></pre>')
        elif re.match(r'^#{1,4} ',s):
            level=len(s.split(' ')[0]); title=s[level+1:]; slug=re.sub(r'[^a-z0-9]+','-',title.lower()).strip('-')
            result.append(f'<h{level} id="{slug}">{inline(title)}</h{level}>')
        elif s.startswith('|'):
            table=[]
            while i<len(lines) and lines[i].startswith('|'):
                row=lines[i]
                if not re.match(r'^\|[\s:|\-]+\|$',row):
                    tag='th' if not table else 'td'
                    table.append('<tr>'+''.join(f'<{tag}>'+inline(c.strip())+f'</{tag}>' for c in row.strip('|').split('|'))+'</tr>')
                i+=1
            result.append('<div class="tablewrap"><table>'+''.join(table)+'</table></div>'); continue
        elif s.startswith('- '):
            items=[]
            while i<len(lines) and lines[i].startswith('- '):
                items.append('<li>'+inline(lines[i][2:])+'</li>'); i+=1
            result.append('<ul>'+''.join(items)+'</ul>'); continue
        elif s.strip(): result.append('<p>'+inline(s)+'</p>')
        i+=1
    return '\n'.join(result)

def main():
    commits,rows=history(); inv=inventory()
    stats=dict(head=HEAD,remote=REMOTE,generated=datetime.now(IST).isoformat(),commits=len(commits),merges=sum(len(c['parents'])>1 for c in commits),changes=len(rows),duplicate_aliases=sum(len(r['aliases'])-1 for r in rows),routes=len(inv['routes']),models=len(inv['models']),enums=len(inv['enums']),source_files=inv['source_files'],source_lines=inv['source_lines'])
    data=dict(stats=stats,changes=rows,commits=commits,inventory=inv)
    (OUT/'evidence.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    ref='\n'.join(line.rstrip() for line in md_inventory(inv).splitlines())+'\n'
    (OUT/'code-reference.md').write_text(ref,encoding='utf-8')
    fields=['Key','Name','Type','Modules','Status','Raised','Solved','Production verified','Authored','Committed IST','Reason','Reason evidence','Commit','Aliases','Files','Test files','Verification']
    with (OUT/'notion-tracker.csv').open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
        for r in rows:
            vals=[r['key'],r['title'],r['kind'],r['modules'],r['state'],'','','',r['authored'],r['date'],r['reason'],r['reason_basis'],r['url'],'; '.join(r['aliases']),'; '.join(r['files']),'; '.join(r['tests']),r['verification']]
            # Prevent spreadsheet formula execution when the CSV is opened outside Notion.
            vals=["'"+x if isinstance(x,str) and x.startswith(('=','+','-','@')) else x for x in vals]
            w.writerow(dict(zip(fields,vals)))
    content=(OUT/'handbook.md').read_text(encoding='utf-8')
    template=(ROOT/'scripts/handbook-template.html').read_text(encoding='utf-8')
    compact=[{k:r[k] for k in ['key','title','kind','modules','state','date','reason','reason_basis','url','aliases']} for r in rows]
    payload=json.dumps(dict(stats=stats,changes=compact),ensure_ascii=False).replace('<','\\u003c')
    rendered=template.replace('<!--HANDBOOK-->',render_md(content)).replace('<!--REFERENCE-->',render_md(ref)).replace('/*DATA*/',payload)
    (OUT/'index.html').write_text(rendered,encoding='utf-8')
    with zipfile.ZipFile(OUT/'hr-portal-handbook.zip','w',zipfile.ZIP_DEFLATED) as bundle:
        for name in ['index.html','handbook.md','code-reference.md','notion-tracker.csv','evidence.json','README.md','notion-publication.json']:
            if (OUT/name).exists():
                bundle.write(OUT/name,arcname=name)
    print(json.dumps(stats))

if __name__=='__main__':main()
