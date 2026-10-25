# Attribution and Sources

This database setup was written with AI assistance (Claude). Tags such as `[Zell]` in `scripts/seed.js`
mark where an existing resource shaped the code. **No source code was pasted in as-is.** Every source
below uses Mongoose or MySQL; the patterns were re-implemented for the plain MongoDB driver.
None of these pages states a code license, so they are credited as references, not copied.

## Resources whose code was reviewed (screenshots supplied by the student)
| Tag | Resource | What was adapted | Where in `seed.js` |
|---|---|---|---|
| [Zell] | Zell Liew, [Seeding a database](https://zellwk.com/blog/seed-database/) | One `<name>.seed.js` file per collection; scan the folder, map the file name to a collection name (`toTitleCase`), throw if none exists | `data/*.seed.js`, `toTitleCase`, the `readdir` loop |
| [DrSimple] | DrSimple, [Seed and hash password in MongoDB based application](https://dev.to/drsimplegraffiti/seed-and-hash-password-in-mongodb-based-application-17h7) | `bcrypt.hash(plain, saltRounds = 10)` before inserting; close the connection after seeding | `SALT_ROUNDS`, `prepare.Users`, `finally` |
| [Lars] | Lars Wachter, [Database seeding in Node.js](https://dev.to/larswaechter/database-seeding-in-node-js-518d) | dotenv config, an `npm run seed` script, completion message | `require('dotenv')`, `package.json`, final `console.log` |
| [OneUptime] | OneUptime, [How to Seed a MongoDB Database with Test Data](https://oneuptime.com/blog/post/2026-03-31-mongodb-seed-database-with-test-data/view) | Idempotent seed (`updateOne` + `$setOnInsert` + `upsert`), drop for a clean slate, timestamps spread over past days | `updateOne(... $setOnInsert ...)`, `--reset`, `CreatedAt` offsets |
| [Medium] | Alexander Khoroshilov, [Creating Seeds for MongoDB with Faker and Bcrypt](https://khoroshilov-alex.medium.com/creating-seeds-for-mongodb-with-faker-and-bcrypt-b0aae7b905b2) | Required and unique user fields, default creation date, hash before storing, try/catch/finally | `VALIDATORS`, unique indexes, `CreatedAt`, `try/finally` |

## Course material (COP 4331C)
| Used | From |
|---|---|
| Users field names (`UserID`, `FirstName`, `LastName`, `Login`, `Password`) | MERN A, LAMP guide |
| `MONGODB_URI` in `.env`, kept out of git | MERN B |
| Case-insensitive partial-match search (`$regex`, `$options: 'i'`) | MERN A / MERN C `/api/searchcards` (used in `verify.js`) |

## Design ideas from README-level review only (code not read)
- [flaviuse/mern-authentication](https://github.com/flaviuse/mern-authentication) (MIT): token-based email verification with expiry -> `VerifyToken`, `VerifyExpires`
- [shamahoque/mern-social](https://github.com/shamahoque/mern-social) (MIT): model-level validation -> `VALIDATORS`

## Official documentation
[$regex](https://www.mongodb.com/docs/manual/reference/operator/query/regex/) ·
[Indexes](https://mongodb.com/docs/v7.0/core/indexes/create-index) ·
[Upsert](https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/upsert) ·
[Schema validation](https://www.mongodb.com/docs/manual/core/schema-validation/) ·
[bcryptjs](https://npmjs.com/package/bcryptjs)

## What was written independently
The collection design (Users, Posts, Replies, Connections, Reports), all test data, the `verify.js` checks,
the `$jsonSchema` rules, and the demo guide.
