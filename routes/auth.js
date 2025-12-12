import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  User,
  validateLoginUser,
  validateRegisterUser,
} from "../schemas/User.js";
import {
  Caregiver,
  validateLoginCaregiver,
  validateRegisterCaregiver,
} from "../schemas/Caregiver.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful, returns token and user
 *       400:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ message: "Wrong Email or Password" });
    }

    const isPasswordMatch = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Wrong Email or Password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const data = user._doc;
    delete data.password;

    res.status(200).json({ token, ...data });
  })
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    req.body.password = await bcryptjs.hash(req.body.password, salt);

    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const data = user._doc;
    delete data.password;
    res.status(201).json({ token, ...data });
  })
);

router.post(
  "/caregiver/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginCaregiver(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const caregiver = await Caregiver.findOne({ email: req.body.email });
    if (!caregiver) {
      res.status(400).json({ message: "Wrong Email or Password" });
    }

    const isPasswordMatch = await bcryptjs.compare(
      req.body.password,
      caregiver.password
    );
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Wrong Email or Password" });
    }

    const token = jwt.sign(
      { id: caregiver._id, isAdmin: caregiver.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const data = caregiver._doc;
    delete data.password;

    res.status(200).json({ token, ...data });
  })
);

router.post(
  "/caregiver/register",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterCaregiver(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    let caregiver = await Caregiver.findOne({ email: req.body.email });
    if (caregiver) {
      res.status(409).json({ message: "Caregiver already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    req.body.password = await bcryptjs.hash(req.body.password, salt);

    caregiver = new Caregiver({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      specialization: req.body.specialization,
      phone: req.body.phone,
    });
    await caregiver.save();

    const token = jwt.sign(
      { id: caregiver._id, isAdmin: caregiver.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const data = caregiver._doc;
    delete data.password;
    res.status(201).json({ token, ...data });
  })
);

export default router;
