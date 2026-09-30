const express = require("express");

const AuditLog = require("../models/AuditLog");

const authMiddleware = require("../middleware/authMiddleware");

const {
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// GET AUDIT LOGS
// GET /api/audit
// ADMIN ONLY
// =====================================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const logs = await AuditLog.find()
        .populate(
          "user",
          "name email role"
        )
        .sort({
          createdAt: -1,
        })
        .limit(100);

      return res.json({
        success: true,
        logs,
      });
    } catch (error) {
      console.error(
        "GET AUDIT LOGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch audit logs",
      });
    }
  }
);

// =====================================================
// CREATE AUDIT LOG
// POST /api/audit
// ADMIN ONLY
// =====================================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        action,
        description,
        targetType,
        targetId,
      } = req.body;

      if (!action) {
        return res.status(400).json({
          message: "Action is required",
        });
      }

      const log =
        await AuditLog.create({
          action,
          description:
            description || "",
          targetType:
            targetType || "",
          targetId:
            targetId || null,
          user: req.user.id,
        });

      const populatedLog =
        await AuditLog.findById(
          log._id
        ).populate(
          "user",
          "name email role"
        );

      return res.status(201).json({
        success: true,
        log: populatedLog,
      });
    } catch (error) {
      console.error(
        "CREATE AUDIT LOG ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create audit log",
      });
    }
  }
);

module.exports = router;