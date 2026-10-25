// Seed data for the users collection (array of documents).
// File-per-collection layout: Zell Liew, "Seeding a database" (zellwk.com/blog/seed-database/)
module.exports = [
  {
    "UserID": 1,
    "FirstName": "Josiah",
    "LastName": "Lopez",
    "Login": "josiah",
    "Email": "josiah@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Electrical and Computer Engineering",
    "GraduationYear": 2027,
    "CareerInterests": [
      "Embedded Systems",
      "Aerospace"
    ],
    "Companies": [
      "Lockheed Martin"
    ],
    "Bio": "ECE senior, CWEP at Lockheed Martin.",
    "Contact": {
      "Email": "josiah@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/josiah"
    }
  },
  {
    "UserID": 2,
    "FirstName": "Ada",
    "LastName": "Lovelace",
    "Login": "adal",
    "Email": "adal@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Computer Science",
    "GraduationYear": 2027,
    "CareerInterests": [
      "Software Engineering",
      "Machine Learning"
    ],
    "Companies": [
      "Google"
    ],
    "Bio": "Interested in ML infrastructure.",
    "Contact": {
      "Email": "adal@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/adal"
    }
  },
  {
    "UserID": 3,
    "FirstName": "Alan",
    "LastName": "Turing",
    "Login": "alant",
    "Email": "alant@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Computer Science",
    "GraduationYear": 2026,
    "CareerInterests": [
      "Cybersecurity",
      "Theory"
    ],
    "Companies": [
      "NSA",
      "Northrop Grumman"
    ],
    "Bio": "Security and cryptography nerd.",
    "Contact": {
      "Email": "alant@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/alant"
    }
  },
  {
    "UserID": 4,
    "FirstName": "Grace",
    "LastName": "Hopper",
    "Login": "graceh",
    "Email": "graceh@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": false,
    "Major": "Information Technology",
    "GraduationYear": 2026,
    "CareerInterests": [
      "Compilers",
      "DevOps"
    ],
    "Companies": [
      "Navy",
      "IBM"
    ],
    "Bio": "Building tools that help people build tools.",
    "Contact": {
      "Email": "graceh@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/graceh"
    }
  },
  {
    "UserID": 5,
    "FirstName": "Katherine",
    "LastName": "Johnson",
    "Login": "katherinej",
    "Email": "katherinej@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Mechanical Engineering",
    "GraduationYear": 2028,
    "CareerInterests": [
      "Orbital Mechanics",
      "Data Analysis"
    ],
    "Companies": [
      "NASA"
    ],
    "Bio": "Numbers and trajectories.",
    "Contact": {
      "Email": "katherinej@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/katherinej"
    }
  },
  {
    "UserID": 6,
    "FirstName": "Margaret",
    "LastName": "Hamilton",
    "Login": "margareth",
    "Email": "margareth@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Computer Engineering",
    "GraduationYear": 2027,
    "CareerInterests": [
      "Flight Software",
      "Systems Engineering"
    ],
    "Companies": [
      "Lockheed Martin",
      "NASA"
    ],
    "Bio": "Reliable software for critical systems.",
    "Contact": {
      "Email": "margareth@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/margareth"
    }
  },
  {
    "UserID": 7,
    "FirstName": "Linus",
    "LastName": "Torvalds",
    "Login": "linust",
    "Email": "linust@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Computer Science",
    "GraduationYear": 2028,
    "CareerInterests": [
      "Operating Systems",
      "Open Source"
    ],
    "Companies": [
      "Red Hat"
    ],
    "Bio": "Kernel hacker in training.",
    "Contact": {
      "Email": "linust@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/linust"
    }
  },
  {
    "UserID": 8,
    "FirstName": "Tim",
    "LastName": "Berners",
    "Login": "timb",
    "Email": "timb@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Information Technology",
    "GraduationYear": 2027,
    "CareerInterests": [
      "Web Development",
      "UX"
    ],
    "Companies": [
      "Disney",
      "Oracle"
    ],
    "Bio": "Full-stack web, love good UX.",
    "Contact": {
      "Email": "timb@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/timb"
    }
  },
  {
    "UserID": 9,
    "FirstName": "Marie",
    "LastName": "Curie",
    "Login": "mariec",
    "Email": "mariec@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Chemical Engineering",
    "GraduationYear": 2026,
    "CareerInterests": [
      "Materials Science",
      "Research"
    ],
    "Companies": [
      "Siemens Energy"
    ],
    "Bio": "Materials and lab research.",
    "Contact": {
      "Email": "mariec@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/mariec"
    }
  },
  {
    "UserID": 10,
    "FirstName": "Nikola",
    "LastName": "Tesla",
    "Login": "nikolat",
    "Email": "nikolat@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Electrical Engineering",
    "GraduationYear": 2027,
    "CareerInterests": [
      "Power Systems",
      "Renewable Energy"
    ],
    "Companies": [
      "Duke Energy",
      "Siemens Energy"
    ],
    "Bio": "Power electronics and grid.",
    "Contact": {
      "Email": "nikolat@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/nikolat"
    }
  },
  {
    "UserID": 11,
    "FirstName": "Sheryl",
    "LastName": "Sandberg",
    "Login": "sheryls",
    "Email": "sheryls@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Business Administration",
    "GraduationYear": 2027,
    "CareerInterests": [
      "Marketing",
      "Product Management"
    ],
    "Companies": [
      "Meta",
      "Walt Disney World"
    ],
    "Bio": "Business + tech crossover.",
    "Contact": {
      "Email": "sheryls@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/sheryls"
    }
  },
  {
    "UserID": 12,
    "FirstName": "Dennis",
    "LastName": "Ritchie",
    "Login": "dennisr",
    "Email": "dennisr@ucf.edu",
    "Password": "Test1234!",
    "EmailVerified": true,
    "Major": "Computer Science",
    "GraduationYear": 2028,
    "CareerInterests": [
      "Systems Programming",
      "C"
    ],
    "Companies": [
      "Bell Labs"
    ],
    "Bio": "Low-level everything.",
    "Contact": {
      "Email": "dennisr@ucf.edu",
      "LinkedIn": "https://linkedin.com/in/dennisr"
    }
  }
];
