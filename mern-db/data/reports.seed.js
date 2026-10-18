// Seed data for the reports collection (array of documents).
// File-per-collection layout: Zell Liew, "Seeding a database" (zellwk.com/blog/seed-database/)
module.exports = [
  {
    "ReportID": 1,
    "ReporterId": 4,
    "ReportedUserId": 12,
    "Reason": "Spam",
    "Details": "Posted promotional links in multiple threads.",
    "Status": "open"
  },
  {
    "ReportID": 2,
    "ReporterId": 3,
    "ReportedUserId": 9,
    "Reason": "Harassment",
    "Details": "Rude replies in a discussion thread.",
    "Status": "reviewed"
  },
  {
    "ReportID": 3,
    "ReporterId": 2,
    "ReportedUserId": 8,
    "Reason": "Impersonation",
    "Details": "Profile claims a company affiliation falsely.",
    "Status": "open"
  }
];
