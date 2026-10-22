# Project handbook: reading and tracker guide

Open **index.html** in a browser for the interactive document. It is self-contained and works offline. Start with Architecture, follow the Workflow explorer, read the Full handbook, and use Review practice to rehearse the 23 technical questions. The API/data reference contains source-derived routes, models, enums, validation schemas, dependencies and build scripts.

## In Notion

- [Engineering handbook and commit tracker](https://app.notion.com/p/3fb92e08bf1f8169a9a6dfe13cf964b9)
- [Native technical handbook](https://app.notion.com/p/3fb92e08bf1f81698790daaab6a2fc15)
- [Native API and data reference](https://app.notion.com/p/3fb92e08bf1f81369367faa957e6f6dc)
- [Issues and Changes from Git](https://app.notion.com/p/8ad0edf52f7a4d44b021639d792dd48a)

The hub is an entry in the existing **HR Management Portal — Phase Tracker**. It contains the interactive HTML embed, native reading documents, and a separate historical change database. Existing project phase statuses were preserved.

## What is included

| File | Purpose |
|---|---|
| [index.html](index.html) | Offline interactive handbook, flows, question cards, searchable history and complete reference |
| [handbook.md](handbook.md) | Editable written explanation, practical run/build steps, trade-offs and scaling assessment |
| [code-reference.md](code-reference.md) | Generated route/Prisma/Zod/package reference from the current checkout |
| [notion-tracker.csv](notion-tracker.csv) | Portable CSV with the deduplicated change records |
| [evidence.json](evidence.json) | Snapshot metadata, all reachable commit metadata including merges, patch aliases and source inventory |
| [notion-publication.json](notion-publication.json) | Published Notion locations and change-key/page mapping; no authentication credentials |
| [hr-portal-handbook.zip](hr-portal-handbook.zip) | Portable bundle of the files above |

The initial publication covers HEAD `7d6759e064f77fdc021003be3f257889867d4a31`: 888 reachable commits, 77 merge commits, 481 unique non-merge patches, and 330 duplicate patch aliases. It maps 122 mounted feature route declarations, 24 Prisma models and 36 enums. Directly mounted health/public-image handlers are described separately. This is a source/history snapshot, not a production capacity or deployment certification.

## How to read and maintain the tracker

**All changes** sorts by the stored commit date. **Fixes** filters records classified from fix-prefixed commit titles. **Change calendar** uses the committed date. Open a row for the exact rationale provenance, touched files and commit links. Type and module classification are derived from messages and paths; review them when using a record for a formal report.

Git preserves authored and committed dates, which can differ. The tracker displays the committed timestamp in India time. Identical stable patch IDs are grouped and all aliases are retained. Merge commits remain in evidence.json; they are not automatically counted as additional fixes. Empty patches retain their SHA as a unique fallback. Historical fixes may later be reverted or superseded.

Raised, Solved and Production verified dates were left blank because local commit history did not establish them. “Fix committed” is an evidence state, not a production resolution status. Reason is copied from commit prose when present, otherwise the summary is labeled as the only available evidence. No missing root cause, reporter, closure, test result, or deployment date was invented.

For a newly reported issue, create a database row with the reported date in Raised, the actual Issue link, Owner and a clear problem description. Add the eventual fix commit link and resolution explanation. Set Solved when the agreed resolution is confirmed, and Production verified after checking the deployed behavior; keep those dates separate from Committed IST. For historical records, add those fields only when you locate the original issue or release evidence. Use Resolution notes for that supporting evidence.

## How to refresh the local snapshot

Run this from the repository root with Python 3 and Git available:

```powershell
python scripts/build-project-handbook.py
```

It reads the local source, schema, package files and commits reachable from HEAD. It regenerates the code reference, evidence JSON, CSV, HTML and ZIP. It does not connect to the application database, read runtime .env secrets, run application tests, commit files, push code or publish to Notion. Review the handwritten handbook and HTML workflow text when application behavior changes; those explanations are not automatically rewritten from code.

The live Notion database is a snapshot created for this request, not an automatic recurring sync. Before publishing a later export, compare stable Key values against the existing data source and use notion-publication.json to update/reconcile rows. Do not repeatedly import the entire CSV into the same database or overwrite user-entered report/resolution/verification information. The publication file records the original verified count and should be updated after any intentional later synchronization.

## Validation and limits

The document controls were checked in a browser: workflow selection/steps and history filtering/detail views update correctly. The generated JavaScript/Python syntax, CSV counts, unique keys and commit-alias accounting were checked. No application tests or production changes were performed as part of this documentation task. Hosting details, original issue-report dates and production outcomes require the corresponding external evidence.
