
let db;

exports.setDatabase = function (client) {
  db = client.db(process.env.DB_NAME);
};

function formatUser(user) {
  return {
    userId: user.UserID,
    firstName: user.FirstName,
    lastName: user.LastName,
    email: user.Email,
    emailVerified: user.EmailVerified,
    major: user.Major || "",
    graduationYear: user.GraduationYear || null,
    careerInterests: user.CareerInterests || [],
    companies: user.Companies || [],
    bio: user.Bio || "",
    contact: user.Contact || {},
  };
}

const safeProjection = {
  _id: 0,
  Password: 0,
  VerifyToken: 0,
  VerifyExpires: 0,
  ResetToken: 0,
  ResetExpires: 0,
};

exports.getProfile = async function (req, res) {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isSafeInteger(userId) || userId < 1) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const user = await db.collection("Users").findOne(
      { UserID: userId },
      { projection: safeProjection }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Error getting profile:", error);

    return res.status(500).json({
      error: "Server error getting profile",
    });
  }
};

exports.updateProfile = async function (req, res) {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isSafeInteger(userId) || userId < 1) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    if (req.user.userId !== userId) {
      return res.status(403).json({
        error: "You cannot update profiles that are not yours",
      });
    }

    const updateableFields = [
      "FirstName",
      "LastName",
      "Major",
      "GraduationYear",
      "CareerInterests",
      "Companies",
      "Bio",
      "Contact",
    ];

    const updates = {};

    for (const field of updateableFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Validate first and last name changes.
    for (const field of ["FirstName", "LastName"]) {
      if (updates[field] !== undefined) {
        const value = updates[field];

        if (
          typeof value !== "string" ||
          !value.trim() ||
          value.trim().length > 50
        ) {
          return res.status(400).json({
            error: `${field} must be between 1 and 50 characters`,
          });
        }

        updates[field] = value.trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "No changes made",
      });
    }

    const result = await db.collection("Users").updateOne(
      { UserID: userId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const user = await db.collection("Users").findOne(
      { UserID: userId },
      { projection: safeProjection }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    return res.status(500).json({
      error: "Server error updating profile",
    });
  }
};

exports.searchProfile = async function (req, res) {
  try {
    const rawSearchTerm = req.query.q;
    const graduationYear = req.query.graduationYear;

    if (
      rawSearchTerm !== undefined &&
      typeof rawSearchTerm !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid search term",
      });
    }

    const searchTerm = rawSearchTerm?.trim();

    if (searchTerm && searchTerm.length > 100) {
      return res.status(400).json({
        error: "Search term must be at most 100 characters",
      });
    }

    if (graduationYear !== undefined) {
      if (
        typeof graduationYear !== "string" ||
        !/^\d{4}$/.test(graduationYear)
      ) {
        return res.status(400).json({
          error: "Graduation year must be a valid four-digit year",
        });
      }
    }

    if (!searchTerm && graduationYear === undefined) {
      return res.status(400).json({
        error: "At least one search parameter is required",
      });
    }

    const filters = {
      UserID: { $ne: req.user.userId },
    };

    if (searchTerm) {
      // Treat search text literally, not as regular-expression syntax.
      const escapedTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(escapedTerm, "i");

      filters.$or = [
        { FirstName: regex },
        { LastName: regex },
        { Major: regex },
        { Companies: regex },
        { CareerInterests: regex },
      ];
    }

    if (graduationYear !== undefined) {
      filters.GraduationYear = Number(graduationYear);
    }

    const users = await db
      .collection("Users")
      .find(filters, {
        projection: {
          _id: 0,
          UserID: 1,
          FirstName: 1,
          LastName: 1,
          Major: 1,
          GraduationYear: 1,
          CareerInterests: 1,
          Companies: 1,
          Bio: 1,
        },
      })
      .sort({ LastName: 1, FirstName: 1 })
      .limit(20)
      .toArray();

    return res.status(200).json({
      users: users.map((user) => ({
        userId: user.UserID,
        firstName: user.FirstName,
        lastName: user.LastName,
        major: user.Major || "",
        graduationYear: user.GraduationYear || null,
        careerInterests: user.CareerInterests || [],
        companies: user.Companies || [],
        bio: user.Bio || "",
      })),
    });
  } catch (error) {
    console.error("Error searching users:", error);

    return res.status(500).json({
      error: "Server error searching users",
    });
  }
};
