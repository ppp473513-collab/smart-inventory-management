const express = require("express");

const bcrypt = require("bcryptjs");

const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");

const {
  adminMiddleware,
} = require("../middleware/authMiddleware");

const createAuditLog = require("../utils/createAuditLog");

const router = express.Router();

// =====================================================
// CHANGE PASSWORD
// PUT /api/users/change-password
// LOGGED-IN USER
// =====================================================

router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      // -----------------------------------------
      // VALIDATION
      // -----------------------------------------

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          message:
            "Current password and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message:
            "New password must be at least 6 characters",
        });
      }

      // -----------------------------------------
      // FIND LOGGED-IN USER
      // -----------------------------------------

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      // -----------------------------------------
      // CHECK CURRENT PASSWORD
      // -----------------------------------------

      const passwordMatches =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!passwordMatches) {
        return res.status(400).json({
          message:
            "Current password is incorrect",
        });
      }

      // -----------------------------------------
      // DON'T ALLOW SAME PASSWORD
      // -----------------------------------------

      const samePassword =
        await bcrypt.compare(
          newPassword,
          user.password
        );

      if (samePassword) {
        return res.status(400).json({
          message:
            "New password must be different from current password",
        });
      }

      // -----------------------------------------
      // HASH NEW PASSWORD
      // -----------------------------------------

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      // -----------------------------------------
      // SAVE PASSWORD
      // -----------------------------------------

      user.password =
        hashedPassword;

      await user.save();

      // -----------------------------------------
      // AUDIT LOG
      // -----------------------------------------

      try {
        await createAuditLog({
          action:
            "PASSWORD_CHANGED",

          description:
            `Password changed for "${user.name}"`,

          user: user._id,

          metadata: {
            userId:
              user._id,

            userName:
              user.name,

            userEmail:
              user.email,
          },
        });
      } catch (auditError) {
        console.error(
          "PASSWORD AUDIT ERROR:",
          auditError
        );
      }

      // -----------------------------------------
      // RESPONSE
      // -----------------------------------------

      return res.json({
        success: true,
        message:
          "Password changed successfully",
      });

    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to change password",
      });
    }
  }
);

// =====================================================
// GET ALL USERS
// GET /api/users
// ADMIN ONLY
// =====================================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users =
        await User.find(
          {},
          "name email role createdAt"
        ).sort({
          createdAt: -1,
        });

      return res.json(users);

    } catch (error) {
      console.error(
        "GET USERS ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch users",
      });
    }
  }
);

// =====================================================
// CHANGE USER ROLE
// PUT /api/users/:id/role
// ADMIN ONLY
// =====================================================
router.put(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          message: "Name and email are required",
        });
      }

      const user = await User.findById(
        req.user.id
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const cleanName = name.trim();
      const cleanEmail =
        email.trim().toLowerCase();

      const emailExists =
        await User.findOne({
          email: cleanEmail,
          _id: { $ne: user._id },
        });

      if (emailExists) {
        return res.status(400).json({
          message:
            "Email is already registered",
        });
      }

      user.name = cleanName;
      user.email = cleanEmail;

      await user.save();

      return res.json({
        success: true,
        message:
          "Profile updated successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update profile",
      });
    }
  }
);
router.put(
  "/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const { role } =
        req.body;

      // -----------------------------------------
      // VALID ROLE
      // -----------------------------------------

      if (
        !["user", "admin"].includes(
          role
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid role",
        });
      }

      // -----------------------------------------
      // DON'T CHANGE YOURSELF
      // -----------------------------------------

      if (
        req.user.id === id
      ) {
        return res.status(400).json({
          message:
            "You cannot change your own role",
        });
      }

      // -----------------------------------------
      // FIND USER
      // -----------------------------------------

      const user =
        await User.findById(id);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const oldRole =
        user.role;

      // -----------------------------------------
      // UPDATE ROLE
      // -----------------------------------------

      user.role = role;

      await user.save();

      // -----------------------------------------
      // AUDIT
      // -----------------------------------------

      await createAuditLog({
        action:
          "USER_ROLE_CHANGED",

        description:
          `Role of "${user.name}" was changed from ${oldRole} to ${user.role}`,

        user: req.user.id,

        metadata: {
          targetUserId:
            user._id,

          targetUserName:
            user.name,

          targetUserEmail:
            user.email,

          oldRole,

          newRole:
            user.role,
        },
      });

      return res.json({
        message:
          "User role updated successfully",

        user: {
          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          createdAt:
            user.createdAt,
        },
      });

    } catch (error) {
      console.error(
        "CHANGE USER ROLE ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to change user role",
      });
    }
  }
);

// =====================================================
// DELETE USER
// DELETE /api/users/:id
// ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } =
        req.params;

      // -----------------------------------------
      // DON'T DELETE YOURSELF
      // -----------------------------------------

      if (
        req.user.id === id
      ) {
        return res.status(400).json({
          message:
            "You cannot delete your own account",
        });
      }

      // -----------------------------------------
      // FIND USER
      // -----------------------------------------

      const user =
        await User.findById(id);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      // -----------------------------------------
      // SAVE DETAILS BEFORE DELETE
      // -----------------------------------------

      const deletedUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // -----------------------------------------
      // DELETE
      // -----------------------------------------

      await User.findByIdAndDelete(
        id
      );

      // -----------------------------------------
      // AUDIT
      // -----------------------------------------

      await createAuditLog({
        action:
          "USER_DELETED",

        description:
          `User "${deletedUser.name}" was deleted`,

        user: req.user.id,

        metadata: {
          targetUserId:
            deletedUser.id,

          targetUserName:
            deletedUser.name,

          targetUserEmail:
            deletedUser.email,

          targetUserRole:
            deletedUser.role,
        },
      });

      return res.json({
        message:
          "User deleted successfully",
      });

    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete user",
      });
    }
  }
);

module.exports = router;