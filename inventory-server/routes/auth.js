const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // -----------------------------
    // CHECK EXISTING USER
    // -----------------------------

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // -----------------------------
    // HASH PASSWORD
    // -----------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // -----------------------------
    // CREATE USER
    // IMPORTANT:
    // Normal registration is ALWAYS user
    // -----------------------------

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({
      message: "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Registration failed",
    });
  }
});

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // -----------------------------
    // FIND USER
    // -----------------------------

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // -----------------------------
    // CHECK PASSWORD
    // -----------------------------

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // -----------------------------
    // HANDLE OLD USERS
    // If role does not exist,
    // treat them as normal users
    // -----------------------------

    const userRole =
      user.role === "admin"
        ? "admin"
        : "user";

    // -----------------------------
    // CREATE JWT
    // -----------------------------

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: userRole,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return res.json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
      },
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

// =====================================================
// UPDATE PROFILE
// PUT /api/auth/profile/:id
// =====================================================

router.put(
  "/profile/:id",
  async (req, res) => {
    try {
      const { name } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            name: name.trim(),
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json({
        message:
          "Profile updated successfully",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role:
            user.role === "admin"
              ? "admin"
              : "user",
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

// =====================================================
// CHANGE PASSWORD
// PUT /api/auth/change-password/:id
// =====================================================

router.put(
  "/change-password/:id",
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      // -----------------------------
      // VALIDATION
      // -----------------------------

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          message:
            "All fields are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message:
            "New password must be at least 6 characters",
        });
      }

      // -----------------------------
      // FIND USER
      // -----------------------------

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // -----------------------------
      // CHECK CURRENT PASSWORD
      // -----------------------------

      const validPassword =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!validPassword) {
        return res.status(401).json({
          message:
            "Current password is incorrect",
        });
      }

      // -----------------------------
      // HASH NEW PASSWORD
      // -----------------------------

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await user.save();

      return res.json({
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

module.exports = router;