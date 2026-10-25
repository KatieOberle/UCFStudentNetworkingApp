# UCF Networking App: Database Setup + Lab Demo Guide

## 1. Setup (Atlas cluster is already created)
**Done in Atlas:** free M0 `Cluster0` (host `cluster0.eclkajd.mongodb.net`), database user `ricecake2022_db_user`, and your current IP added to the Access List.

**Run the seed on your Mac** (needs Node.js):
1. Unzip `mern-db.zip`, open Terminal in that folder.
2. `cp .env.example .env`, then edit `.env` and replace `<PASSWORD>` with the database user's password.
   Lost it? Atlas → **Database Access** → Edit user → Edit Password.
3. `npm install`
4. `npm run seed`, then `npm run verify` (expect 27 PASS).

`npm run reset -- --force` drops the database and reseeds (the `--force` is required on Atlas and wipes everyone's data). `npm run seed` is safe to re-run. Never commit `.env`.

**Network access:** Atlas only allows the IP it added automatically. Before the droplet or a teammate connects, add their IP in Atlas → **Network Access** (MERN A uses `0.0.0.0/0` for simplicity; fine for the class project, not for production).

**Sample data:** the cluster was created with Atlas's sample dataset, which uses most of the 512 MB free quota. Our data is tiny, but you can drop the sample databases in Atlas (Browse Collections) to free the space.

## 2. Schema (database `UCFNetworking`)

| Collection | Key fields | Indexes |
|---|---|---|
| **Users** | UserID, FirstName, LastName, Login, Email, Password (bcrypt), EmailVerified, VerifyToken, ResetToken, ResetExpires, Major, GraduationYear, CareerInterests[], Companies[], Bio, Contact{Email, LinkedIn}, CreatedAt | unique UserID/Login/Email; name; Major |
| **Posts** | PostID, AuthorId, Title, Body, Tags[], CreatedAt | unique PostID; AuthorId; CreatedAt desc |
| **Replies** | ReplyID, PostID, AuthorId, Body, CreatedAt | unique ReplyID; (PostID, CreatedAt) |
| **Connections** | RequesterId, RecipientId, Status (pending/accepted), CreatedAt | unique (RequesterId, RecipientId); (RecipientId, Status) |
| **Reports** | ReportID, ReporterId, ReportedUserId, Reason, Details, Status (open/reviewed), CreatedAt | unique ReportID; (ReportedUserId, Status) |

**How it maps to the MVP**
- Login/signup, email verification, password reset → Users (`EmailVerified`, `VerifyToken`, `ResetToken`, `ResetExpires`)
- Profile (name, major, career interests, contact, companies) → Users
- Search with partial matching → regex over name, major, companies and interests
- Discussion (create, respond, delete own) → Posts + Replies; delete uses `{ PostID, AuthorId }` so only the owner can delete
- Network connections → Connections
- Report user → Reports
- Password hashing → bcrypt

**Test data:** 12 users, 10 posts, 20 replies, 12 connections, 3 reports.
All accounts use password `Test1234!`. Logins: `josiah`, `adal`, `alant`, `graceh` (**unverified**, good for the email-verification demo), `katherinej`, `margareth`, `linust`, `timb`, `mariec`, `nikolat`, `sheryls`, `dennisr`.

## 3. Key queries for the API
```js
// Partial-match search (escape user input first)
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re = { $regex: esc(q), $options: 'i' };
db.collection('Users').find({ $or: [{FirstName:re},{LastName:re},{Major:re},{Companies:re},{CareerInterests:re}] })

// Delete only your own post
db.collection('Posts').deleteOne({ PostID, AuthorId: userId })

// Accepted connections for a user
db.collection('Connections').find({ Status:'accepted', $or:[{RequesterId:id},{RecipientId:id}] })

// Login with hashing
const ok = user && await bcrypt.compare(password, user.Password);
```

## 4. Demo script (about 5 minutes)
1. **Atlas → Browse Collections**: show the 5 collections. Open one user, one post, one reply.
2. **Explain the design**: documents map to the MVP features; IDs link collections (`AuthorId`, `PostID`, `RecipientId`); unique indexes block duplicate logins, emails and connections; passwords are bcrypt hashes.
3. **Indexes tab**: point out the unique indexes and the search-supporting ones.
4. **`npm run verify`** live: 27 PASS lines (counts, login, hashing, search, owner-only delete, duplicate rejection).
5. **Search in Atlas** (Filter): `{ "Companies": { "$regex": "lock", "$options": "i" } }` → Josiah and Margaret (partial match). Then `{ "Major": { "$regex": "comp", "$options": "i" } }`.
6. **Email-verification state**: filter `{ "EmailVerified": false }` → Grace with a `VerifyToken`.
7. **Moderation**: Reports collection, filter `{ "Status": "open" }`.
8. **Optional**: `npm run reset -- --force` live to show the data is reproducible.

## 5. Likely questions
- *Why MongoDB?* JSON documents end to end; profiles with arrays (interests, companies) fit naturally.
- *How is search partial?* Server-side `$regex`, case-insensitive, with input escaped.
- *How do you prevent deleting others' posts?* The delete filter includes `AuthorId`.
- *How is data protected?* bcrypt hashes now; JWT auth in the API; `.env` never in git.
- *Nice-to-haves later?* Add Bookmarks and Messages collections, a `Major` verification flag, and a text index for keyword moderation.

## 6. Before you present
- [ ] Atlas Network Access includes the droplet/IP
- [ ] `.env` in place, not in git
- [ ] `npm run verify` passes the day of
- [ ] Atlas, terminal and Postman open in tabs

## 7. Sources
`scripts/seed.js` carries `[Tag]` comments showing which public resource each pattern came from (Zell Liew, DrSimple, Lars Wachter, OneUptime, Khoroshilov). See `ATTRIBUTION.md` for the full table, course material, and documentation links. Seed data lives in `data/*.seed.js`, one file per collection.
