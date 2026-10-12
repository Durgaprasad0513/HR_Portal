import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Pencil, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface Props {
  requisitions: any[];
  editable: boolean;
  history: boolean;
  onEdit: (opening: any) => void;
  onClose: (opening: any) => void;
}

export function JobPositions({ requisitions, editable, history, onEdit, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const departments = Array.from(new Map(requisitions.filter((opening) => opening.department).map((opening) => [opening.department.id, opening.department])).values());
  const filtered = requisitions.filter((opening) =>
    (!department || opening.departmentId === department) &&
    `${opening.positionTitle} ${opening.location || ""} ${opening.department?.name || ""}`.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return <section aria-label="Job positions" className="space-y-4">
    <div className="grid gap-3 rounded-xl border border-slate-border bg-surface p-3 sm:grid-cols-[minmax(12rem,1fr)_minmax(11rem,15rem)]">
      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-text-muted" />
        <Input aria-label="Search job positions" className="pl-10" placeholder="Search job positions…" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <Select aria-label="Department" value={department} onChange={(event) => setDepartment(event.target.value)}>
        <option value="">All departments</option>
        {departments.map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </Select>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
      <p>{filtered.length} {filtered.length === 1 ? "position" : "positions"}{!history && ` · ${filtered.reduce((sum, opening) => sum + Number(opening.remainingCount ?? opening.numberOfVacancies ?? 0), 0)} remaining vacancies`}</p>
      <p>Open a position to view its applicants.</p>
    </div>
    {!filtered.length ? <div className="rounded-xl border border-dashed border-slate-border p-10 text-center text-sm text-text-muted">{search || department ? "No positions match these filters." : history ? "No closed positions yet." : "No open positions yet. Create a new position to start recruiting."}</div> :
      <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((opening) => {
          const raisedBy = opening.raisedBy ? `${opening.raisedBy.firstName} ${opening.raisedBy.lastName}` : "Not assigned";
          return <article key={opening.id} className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-border bg-surface transition hover:border-primary-500 hover:shadow-md">
            <div className="p-5">
              <h2 className="break-words text-lg font-semibold text-text-heading">
                <Link to={`/recruitment?tab=pipeline&opening=${encodeURIComponent(opening.id)}`} aria-label={`View applicants for ${opening.positionTitle}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-primary-500">{opening.positionTitle}</Link>
              </h2>
              <p className="mt-1 break-words text-sm text-text-muted">Raised by {raisedBy}</p>
              <p className="mt-2 text-xs text-text-muted">{[opening.department?.name, opening.location].filter(Boolean).join(" · ") || "Department and location not specified"}</p>
              <div className="mt-6 flex items-center gap-2 font-medium text-text-heading">
                <Users aria-hidden="true" className="h-5 w-5 shrink-0 text-primary-600" />
                <span>{opening.newApplicationCount == null ? "New application count unavailable" : `${opening.newApplicationCount} new applications`}</span>
              </div>
              <p className="mt-1 pl-7 text-xs text-text-muted">{opening._count?.candidates ?? 0} total applicants · {opening.filledCount ?? 0} filled / {opening.remainingCount ?? opening.numberOfVacancies} remaining</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-border bg-tint px-4 py-2">
              <div className="flex gap-1">
                {editable && <>
                  <Button size="sm" variant="ghost" className="relative z-10" aria-label={`Edit ${opening.positionTitle}`} onClick={() => onEdit(opening)}><Pencil aria-hidden="true" className="mr-1 h-3.5 w-3.5" />Edit</Button>
                  <Button size="sm" variant="ghost" className="relative z-10" onClick={() => onClose(opening)}>{history ? "Reopen" : "Close"}</Button>
                </>}
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-body">View applicants <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></span>
            </div>
          </article>;
        })}
      </div>}
    <p className="text-xs text-text-muted">New applications are applicants awaiting screening.</p>
  </section>;
}
