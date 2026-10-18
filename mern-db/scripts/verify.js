// Runs the queries the API will use and prints PASS/FAIL.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function verify(uri = process.env.MONGODB_URI, dbName = process.env.DB_NAME || 'UCFNetworking') {
  const client = new MongoClient(uri); await client.connect();
  const db = client.db(dbName);
  const out = [];
  const check = (name, ok, detail = '') => out.push({ name, ok: !!ok, detail });

  const n = async c => db.collection(c).countDocuments();
  check('Users = 12', await n('Users') === 12, await n('Users'));
  check('Posts = 10', await n('Posts') === 10, await n('Posts'));
  check('Replies = 20', await n('Replies') === 20, await n('Replies'));
  check('Connections = 12', await n('Connections') === 12, await n('Connections'));
  check('Reports = 3', await n('Reports') === 3, await n('Reports'));

  // Auth
  const u = await db.collection('Users').findOne({ Login: 'josiah' });
  check('Login josiah / Test1234!', u && bcrypt.compareSync('Test1234!', u.Password), `${u?.FirstName} ${u?.LastName}`);
  check('Wrong password rejected', u && !bcrypt.compareSync('nope', u.Password));
  check('Passwords are hashed (not plaintext)', u && u.Password !== 'Test1234!' && u.Password.startsWith('$2'));
  const unv = await db.collection('Users').findOne({ EmailVerified: false });
  check('Unverified user has VerifyToken', unv?.VerifyToken, unv?.Login);

  // Partial-match user search (name, major, companies, interests)
  const search = async s => {
    const re = { $regex: esc(s), $options: 'i' };
    return (await db.collection('Users').find({ $or: [{ FirstName: re }, { LastName: re }, { Major: re }, { Companies: re }, { CareerInterests: re }] }).toArray()).map(x => x.Login);
  };
  const s1 = await search('lock'); check('Search "lock" (Lockheed) -> josiah, margareth', s1.sort().join() === 'josiah,margareth', s1);
  const s2 = await search('comp'); check('Search "comp" (Computer/Compilers) matches 6+', s2.length >= 6, s2.length);
  const s3 = await search('LOVEL'); check('Search "LOVEL" case-insensitive -> adal', s3.join() === 'adal', s3);
  check('Search "zzzz" -> none', (await search('zzzz')).length === 0);
  check('Regex chars escaped ("c++" no crash)', Array.isArray(await search('c++')));

  // Discussion: replies per post, owner-only delete
  const reps = await db.collection('Replies').find({ PostID: 3 }).sort({ CreatedAt: 1 }).toArray();
  check('Post 3 has 3 replies', reps.length === 3, reps.length);
  const denied = await db.collection('Posts').deleteOne({ PostID: 1, AuthorId: 2 });
  check('Non-owner cannot delete post', denied.deletedCount === 0);
  const tmp = await db.collection('Posts').insertOne({ PostID: 9999, AuthorId: 2, Title: 't', Body: 'b', CreatedAt: new Date() });
  const ok = await db.collection('Posts').deleteOne({ PostID: 9999, AuthorId: 2 });
  check('Owner can delete own post', ok.deletedCount === 1);

  // Connections
  const friends = await db.collection('Connections').find({ Status: 'accepted', $or: [{ RequesterId: 1 }, { RecipientId: 1 }] }).toArray();
  check('Josiah has 2 accepted connections', friends.length === 2, friends.length);
  let dup = false; try { await db.collection('Connections').insertOne({ RequesterId: 1, RecipientId: 6, Status: 'pending' }); } catch { dup = true; }
  check('Duplicate connection rejected', dup);

  // Moderation + unique constraints
  const open = await db.collection('Reports').countDocuments({ Status: 'open' });
  check('2 open reports', open === 2, open);
  const base = { UserID: 99, FirstName: 'T', LastName: 'T', Login: 'tmp99', Email: 'tmp99@ucf.edu', Password: 'abcdefg', EmailVerified: false };
  const tryInsert = async d => { try { await db.collection('Users').insertOne({ ...d }); await db.collection('Users').deleteOne({ UserID: 99 }); return false; } catch (e) { return e.code; } };
  check('Duplicate Login rejected (unique index, code 11000)', await tryInsert({ ...base, Login: 'josiah' }) === 11000);
  check('Invalid email rejected by schema validation', await tryInsert({ ...base, Email: 'not-an-email' }) === 121);
  check('Missing required field rejected', await tryInsert({ UserID: 99, Login: 'tmp99' }) === 121);
  check('Invalid connection Status rejected', await (async () => { try { await db.collection('Connections').insertOne({ RequesterId: 5, RecipientId: 9, Status: 'bogus' }); return false; } catch (e) { return e.code === 121; } })());
  check('Unverified token has expiry', unv?.VerifyExpires instanceof Date, unv?.VerifyExpires?.toISOString?.());

  await client.close();
  out.forEach(r => console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail !== '' ? '  [' + r.detail + ']' : ''}`));
  const failed = out.filter(r => !r.ok).length;
  console.log(failed ? `\n${failed} check(s) FAILED` : `\nAll ${out.length} checks passed`);
  return failed;
}
module.exports = { verify };
if (require.main === module) verify().then(f => process.exit(f ? 1 : 0)).catch(e => { console.error(e.message); process.exit(1); });
