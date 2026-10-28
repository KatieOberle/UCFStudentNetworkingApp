// Seed data for the connections collection (array of documents).
// File-per-collection layout: Zell Liew, "Seeding a database" (zellwk.com/blog/seed-database/)
module.exports = [
  {
    "RequesterId": 1,
    "RecipientId": 6,
    "Status": "accepted"
  },
  {
    "RequesterId": 1,
    "RecipientId": 2,
    "Status": "accepted"
  },
  {
    "RequesterId": 1,
    "RecipientId": 3,
    "Status": "pending"
  },
  {
    "RequesterId": 2,
    "RecipientId": 3,
    "Status": "accepted"
  },
  {
    "RequesterId": 2,
    "RecipientId": 7,
    "Status": "accepted"
  },
  {
    "RequesterId": 3,
    "RecipientId": 12,
    "Status": "accepted"
  },
  {
    "RequesterId": 5,
    "RecipientId": 6,
    "Status": "accepted"
  },
  {
    "RequesterId": 6,
    "RecipientId": 10,
    "Status": "pending"
  },
  {
    "RequesterId": 8,
    "RecipientId": 11,
    "Status": "accepted"
  },
  {
    "RequesterId": 9,
    "RecipientId": 10,
    "Status": "accepted"
  },
  {
    "RequesterId": 7,
    "RecipientId": 12,
    "Status": "accepted"
  },
  {
    "RequesterId": 4,
    "RecipientId": 3,
    "Status": "pending"
  }
];
