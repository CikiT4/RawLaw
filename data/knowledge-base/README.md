# Knowledge Base CSV Sources

CSV files in this folder feed Rusdi AI retrieval (`knowledge_base` table).

Primary files used by `scripts/dev/setup-knowledge-base.cjs`:

- `daftar_pengadilan.csv`
- `indonesia-violence-reporting-text.csv`
- `Presentase Penyelesaian Tindak Pidana di Indonesia tahun 2021-2022.csv`

Additional training/sample datasets are kept for reference and future RAG expansion.

Upload after migration `018_knowledge_base.sql` is applied:

```bash
node scripts/dev/setup-knowledge-base.cjs
```
