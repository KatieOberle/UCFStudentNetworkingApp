// Creates the UCFNetworking database: collections, validation, indexes and test data.
// Usage:  npm run seed   (safe to re-run)   |   npm run reset -- --force   (drop everything, reseed)
//
// SOURCES (details and licenses in ATTRIBUTION.md). Patterns below were adapted and re-implemented
// for the plain MongoDB driver; the sources themselves use Mongoose. Tags like [Zell] mark where.
//  [Zell]      Zell Liew, "Seeding a database" - https://zellwk.com/blog/seed-database/
//              one "<name>.seed.js" file per collection, found by scanning a folder, with the
//              file name mapped to a collection name; throw if there is no matching collection.
//  [DrSimple]  DrSimple, "Seed and hash password in MongoDB based application" -
//              https://dev.to/drsimplegraffiti/seed-and-hash-password-in-mongodb-based-application-17h7
//              bcrypt.hash with saltRounds = 10 on plaintext seed passwords; close the connection after.
//  [Lars]      Lars Wachter, "Database seeding in Node.js" - https://dev.to/larswaechter/database-seeding-in-node-js-518d
//              dotenv for config, an "npm run seed" script, and a completion message.
//  [OneUptime] OneUptime, "How to Seed a MongoDB Database with Test Data" -
//              https://oneuptime.com/blog/post/2026-03-31-mongodb-seed-database-with-test-data/view
//              idempotent seeding: updateOne + $setOnInsert + upsert; drop for a clean slate;
//              timestamps spread over past days.
//  [Medium]    Alexander Khoroshilov, "Creating Seeds for MongoDB with Faker and Bcrypt" -
//              https://khoroshilov-alex.medium.com/creating-seeds-for-mongodb-with-faker-and-bcrypt-b0aae7b905b2
//              required + unique fields and a default creation date on the user model; hash
//              before storing; try / catch / finally around seeding.
//  [MERN]      Course docs MERN A/B/C: Users field names, MONGODB_URI in .env, regex search.
require('dotenv').config();                                   // [Lars] config from .env
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const SALT_ROUNDS = 10;                                       // [DrSimple][Medium]
const DAY = 86400000;
const DATA_DIR = path.join(__dirname, '..', 'data');

// [Zell] file name -> collection name ("users.seed.js" -> "Users")
const toTitleCase = str => str.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());

// Natural key for each collection, used so re-running never duplicates [OneUptime]
const KEYS = {
  Users: ['UserID'], Posts: ['PostID'], Replies: ['ReplyID'],
  Connections: ['RequesterId', 'RecipientId'], Reports: ['ReportID']
};

// Turns a seed record into the stored document: hashing, tokens, timestamps.
const prepare = {
  async Users(u, now) {
    return {
      ...u,
      Password: await bcrypt.hash(u.Password, SALT_ROUNDS),   // [DrSimple][Medium] hash before storing
      // Email-verification token with an expiry (also see ATTRIBUTION.md: flaviuse/mern-authentication)
      VerifyToken: u.EmailVerified ? null : crypto.randomBytes(16).toString('hex'),
      VerifyExpires: u.EmailVerified ? null : new Date(now + DAY),
      ResetToken: null, ResetExpires: null,
      CreatedAt: new Date(now - 30 * DAY)                     // [Medium] creation date default
    };
  },
  async Posts(p, now) { return { ...p, CreatedAt: new Date(now - (20 - p.PostID) * DAY) }; },
  async Replies(r, now) { return { ...r, CreatedAt: new Date(now - (15 - r.PostID) * DAY + r.ReplyID * 3600000) }; },
  async Connections(c, now) { return { ...c, CreatedAt: new Date(now - 7 * DAY) }; },
  async Reports(r, now) { return { ...r, CreatedAt: new Date(now - 2 * DAY) }; }
};

// Required fields / allowed values per collection (MongoDB $jsonSchema). [Medium] required + unique idea.
const emailPattern = '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$';
const int = { bsonType: 'int' };
const VALIDATORS = {
  Users: { bsonType: 'object',
    required: ['UserID', 'FirstName', 'LastName', 'Login', 'Email', 'Password', 'EmailVerified'],
    properties: { UserID: int,
                  Email: { bsonType: 'string', pattern: emailPattern },
                  Password: { bsonType: 'string', minLength: 60, maxLength: 60 },
                  EmailVerified: { bsonType: 'bool' } } },
  Posts: { bsonType: 'object', required: ['PostID', 'AuthorId', 'Title', 'Body'],
    properties: { PostID: int, AuthorId: int } },
  Replies: { bsonType: 'object', required: ['ReplyID', 'PostID', 'AuthorId', 'Body'],
    properties: { ReplyID: int, PostID: int, AuthorId: int } },
  Connections: { bsonType: 'object', required: ['RequesterId', 'RecipientId', 'Status'],
    properties: { RequesterId: int, RecipientId: int, Status: { enum: ['pending', 'accepted'] } } },
  Reports: { bsonType: 'object', required: ['ReportID', 'ReporterId', 'ReportedUserId', 'Reason', 'Status'],
    properties: { ReportID: int, ReporterId: int, ReportedUserId: int, Status: { enum: ['open', 'reviewed'] } } }
};

async function createIndexes(db) {
  const U = db.collection('Users');
  await U.createIndex({ UserID: 1 }, { unique: true });
  await U.createIndex({ Login: 1 }, { unique: true });
  await U.createIndex({ Email: 1 }, { unique: true });          // [Medium] unique email
  await U.createIndex({ FirstName: 1, LastName: 1 });
  await U.createIndex({ Major: 1 });
  await db.collection('Posts').createIndex({ PostID: 1 }, { unique: true });
  await db.collection('Posts').createIndex({ AuthorId: 1 });
  await db.collection('Posts').createIndex({ CreatedAt: -1 });
  await db.collection('Replies').createIndex({ ReplyID: 1 }, { unique: true });
  await db.collection('Replies').createIndex({ PostID: 1, CreatedAt: 1 });
  await db.collection('Connections').createIndex({ RequesterId: 1, RecipientId: 1 }, { unique: true });
  await db.collection('Connections').createIndex({ RecipientId: 1, Status: 1 });
  await db.collection('Reports').createIndex({ ReportID: 1 }, { unique: true });
  await db.collection('Reports').createIndex({ ReportedUserId: 1, Status: 1 });
}

async function seed(uri = process.env.MONGODB_URI, dbName = process.env.DB_NAME || 'UCFNetworking', opts = {}) {
  if (!uri) throw new Error('MONGODB_URI is not set (copy .env.example to .env).');
  const reset = opts.reset ?? process.argv.includes('--reset');
  const force = opts.force ?? process.argv.includes('--force');
  const isLocal = /^mongodb:\/\/(localhost|127\.0\.0\.1)[:/]/.test(uri);
  if (reset && !isLocal && !force) {
    throw new Error('Refusing to drop a non-local database. This would wipe everyone\'s data. Re-run with --force if you really mean it: npm run reset -- --force');
  }
  const client = new MongoClient(uri);
  try {                                                         // [Medium] try / catch / finally
    await client.connect();
    const db = client.db(dbName);
    if (reset) await db.dropDatabase();                         // [OneUptime] clean slate

    const existing = new Set((await db.listCollections().toArray()).map(c => c.name));
    for (const [name, $jsonSchema] of Object.entries(VALIDATORS)) {
      if (existing.has(name)) await db.command({ collMod: name, validator: { $jsonSchema }, validationLevel: 'strict' });
      else await db.createCollection(name, { validator: { $jsonSchema } });
    }
    await createIndexes(db);

    // [Zell] scan the data folder for "*.seed.js" files and map each to a collection
    const now = Date.now();
    const seedFiles = (await fs.promises.readdir(DATA_DIR)).filter(f => f.endsWith('.seed.js'));
    for (const file of seedFiles) {
      const name = toTitleCase(file.split('.seed.js')[0]);
      if (!prepare[name]) throw new Error(`Cannot find collection '${name}' for ${file}`);   // [Zell]
      const records = require(path.join(DATA_DIR, file));
      for (const record of records) {
        const doc = await prepare[name](record, now);
        const key = Object.fromEntries(KEYS[name].map(k => [k, doc[k]]));
        // [OneUptime] idempotent upsert: only writes when the document does not exist yet
        await db.collection(name).updateOne(key, { $setOnInsert: doc }, { upsert: true });
      }
    }

    const counts = {};
    for (const name of Object.keys(VALIDATORS)) counts[name] = await db.collection(name).countDocuments();
    return counts;
  } finally {
    await client.close();                                       // [DrSimple][Medium] close when done
  }
}

module.exports = { seed };
if (require.main === module) {
  seed().then(c => console.log('Seed complete:', c))            // [Lars] completion message
        .catch(e => { console.error(e.message); process.exit(1); });
}
