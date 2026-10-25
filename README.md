# UCF Networking App: Database (MongoDB Atlas)

Database `UCFNetworking`: Users, Posts, Replies, Connections, Reports. Full schema and demo script: `DEMO.md`. Sources: `ATTRIBUTION.md`.

## Setup
1. `npm install`
2. `cp .env.example .env`, then fill in `MONGODB_URI` (ask the team privately; never commit `.env`).
3. Your IP must be allowed in Atlas -> Network Access.
4. `npm run seed`, then `npm run verify`.

## Commands
| Command | What it does |
|---|---|
| `npm run seed` | Creates collections, validation, indexes and test data. Safe to re-run. |
| `npm run reset -- --force` | Drops the whole database and reseeds. **Wipes everyone's data on the shared Atlas DB.** Without `--force` it refuses unless the URI is localhost. |
| `npm run verify` | Runs the checks against the connected database. |
| `npm test` | Runs seed + verify against a throwaway local database (needs no Atlas). |

## Things to know
- **Editing seed data:** the seed uses `$setOnInsert`, so it only inserts documents that do not exist yet. Changing a file in `data/` and running `npm run seed` will NOT update existing documents. Use `npm run reset -- --force` (or edit the document in Atlas).
- **`verify` assumes freshly seeded data.** The count checks (12 users, 10 posts, ...) will fail once anyone adds data through the app. Run `npm test` (self-test on a fresh local DB) to check the scripts themselves.
- **Connections:** the unique index only blocks a duplicate in one direction. 1->6 and 6->1 can both exist, so the API must check both directions before creating a connection.
- **IDs:** ID fields (`UserID`, `PostID`, ...) must be integers; the database rejects strings like "1".
- **Passwords:** the database only accepts 60-character bcrypt hashes. The minimum password length rule belongs in the API signup endpoint, before hashing.
- **Open team decision:** how new IDs get generated (a counter vs. using MongoDB's `_id`), before the API endpoints are finalized.
- **Test accounts:** all use password `Test1234!` (logins listed in `DEMO.md`).
