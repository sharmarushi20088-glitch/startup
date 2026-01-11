import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { uploadIdCard } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";
import { isValidCollegeEmail } from "../utils/validator.js";

const router = express.Router();

// POST /api/auth/signup  (multipart/form-data)
router.post("/signup", (req, res) => {
  uploadIdCard(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ message: err.message });

      const { firstName, lastName, email, rollNo, branch, password, confirmPassword, terms } = req.body;

      // Basic validation
      if (!firstName || !lastName || !email || !rollNo || !branch || !password) {
        return res.status(400).json({ message: "Missing fields" });
      }
      if (!isValidCollegeEmail(email)) {
        return res.status(400).json({ message: "Use official college email" });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      if (confirmPassword && password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // checkbox sends "on" when checked (HTML default)
      if (terms !== "on" && terms !== "true") {
        return res.status(400).json({ message: "Accept terms" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "ID card image required" });
      }

      // Uniqueness checks
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) return res.status(409).json({ message: "Email already registered" });

      const rollExists = await User.findOne({ rollNo });
      if (rollExists) return res.status(409).json({ message: "Roll number already registered" });

      // Hash password (bcrypt)
      const passwordHash = await bcrypt.hash(password, 10);

      // Save user
      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        rollNo,
        branch,
        idCardUrl: `/uploads/idcards/${req.file.filename}`,
        passwordHash
      });

      // Issue JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      return res.status(201).json({
        message: "Account created",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          rollNo: user.rollNo,
          branch: user.branch,
          idCardUrl: user.idCardUrl
        }
      });
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  });
});

// POST /api/auth/login (application/json)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        rollNo: user.rollNo,
        branch: user.branch,
        idCardUrl: user.idCardUrl
      }
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me (protected)
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
