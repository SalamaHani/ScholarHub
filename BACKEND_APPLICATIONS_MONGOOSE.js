/**
 * Backend code for GET /api/applications endpoint
 * This version uses Mongoose (MongoDB)
 */

const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Scholarship = require("../models/Scholarship");
const { authenticateToken } = require("../middleware/auth");

/**
 * @route   GET /api/applications
 * @desc    Get applications based on user role
 *          - Students: Get their submitted applications
 *          - Professors: Get applications for their scholarships
 * @access  Private (Student/Professor)
 */
router.get("/applications", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log(`📋 Fetching applications for ${userRole}: ${userId}`);

    let applications = [];

    if (userRole === "STUDENT") {
      // Students get applications THEY submitted
      applications = await Application.find({ studentId: userId })
        .populate({
          path: "scholarship",
          select: "title organization amount deadline",
        })
        .sort({ createdAt: -1 })
        .lean();

      console.log(`✅ Found ${applications.length} applications for student`);
    } else if (userRole === "PROFESSOR") {
      // Professors get applications for THEIR scholarships

      // Step 1: Find all scholarships created by this professor
      const professorScholarships = await Scholarship.find({
        professorId: userId,
      }).select("_id");

      const scholarshipIds = professorScholarships.map((s) => s._id);

      console.log(
        `🎓 Professor has ${scholarshipIds.length} scholarships:`,
        scholarshipIds
      );

      // Step 2: Find all applications for those scholarships
      applications = await Application.find({
        scholarshipId: { $in: scholarshipIds },
      })
        .populate({
          path: "student",
          select: "name email avatar gpa university fieldOfStudy",
        })
        .populate({
          path: "scholarship",
          select: "title organization amount deadline",
        })
        .sort({ createdAt: -1 })
        .lean();

      console.log(
        `✅ Found ${applications.length} applications for professor's scholarships`
      );
    } else {
      return res.status(403).json({
        success: false,
        message: "Only students and professors can access this endpoint",
      });
    }

    return res.status(200).json({
      success: true,
      data: applications,
      count: applications.length,
    });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
});

module.exports = router;
