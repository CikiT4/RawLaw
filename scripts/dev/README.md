# Development Utilities

Run these scripts from the **repository root** (`FINPROSE/`).

| Script | Usage |
|--------|-------|
| `setup-knowledge-base.cjs` | Upload CSV knowledge base into Supabase for Rusdi RAG |
| `upload-csv.cjs` | Upload a single CSV to `knowledge_base` |
| `run-migration.cjs` | Apply migration 018 via direct Postgres connection |
| `seed-dummy.cjs` | Create small set of auth test users |
| `seed-original-dummies.cjs` | Legacy dummy lawyer seed helper |
| `setup-account.cjs` | Create a demo client account |
| `test-login.cjs` | Sign-in smoke test |
| `test-db.js` | Inspect core Supabase tables |
| `check-table.cjs` | Verify `ai_chat_history` exists |
| `call-gemini.ps1` | Manual Gemini API test (requires `GEMINI_API_KEY`) |

Fixtures live in `scripts/dev/fixtures/`.
