/**
 * Backend code for GET /api/applications endpoint
 * This handles both STUDENT and PROFESSOR roles
 */

// Example using Express + Prisma/Sequelize
router.get("/applications", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let applications = [];

    if (userRole === "STUDENT") {
      // Students get applications THEY submitted
      applications = await Application.findAll({
        where: { studentId: userId },
        include: [
          {
            model: Scholarship,
            as: "scholarship",
            attributes: ["id", "title", "organization", "amount"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } else if (userRole === "PROFESSOR") {
      // Professors get applications for THEIR scholarships

      // Step 1: Find all scholarships created by this professor
      const professorScholarships = await Scholarship.findAll({
        where: { professorId: userId },
        attributes: ["id"],
      });

      const scholarshipIds = professorScholarships.map((s) => s.id);

      // Step 2: Find all applications for those scholarships
      applications = await Application.findAll({
        where: {
          scholarshipId: scholarshipIds,
        },
        include: [
          {
            model: User,
            as: "student",
            attributes: ["id", "name", "email", "avatar", "gpa", "university"],
          },
          {
            model: Scholarship,
            as: "scholarship",
            attributes: ["id", "title", "organization", "amount"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    }

    return res.status(200).json({
      success: true,
      data: applications,
      count: applications.length,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
});

module.exports = router;
