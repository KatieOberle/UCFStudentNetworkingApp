const { MongoMemoryServer } = require('mongodb-memory-server');
const { seed } = require('./seed'); const { verify } = require('./verify');
(async () => {
  const s = await MongoMemoryServer.create(); const uri = s.getUri();
  console.log('seed #1', await seed(uri, 'UCFNetworking', { reset: true }));
  console.log('seed #2 (idempotent)', await seed(uri, 'UCFNetworking', { reset: false }));
  const f = await verify(uri, 'UCFNetworking'); await s.stop(); process.exit(f ? 1 : 0);
})();
