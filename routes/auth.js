import { Router } from "express";
import asyncHandler from 'express-async-handler';
import { User, validateLoginUser, validateRegisterUser } from "../schemas/User.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

/**
 * @desc Login User
 * @route /auth/login
 * @method POST
 * @access public
 */
router.post('/login', asyncHandler(
  async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ message: 'Wrong Email or Password' });
    }

    const isPasswordMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({ message: 'Wrong Email or Password' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    const data = user._doc;
    delete data.password;

    res.status(200).json({ token, ...data });
  }
))

/**
 * @desc Register User
 * @route /auth/register
 * @method POST
 * @access public
 */
router.post('/register', asyncHandler(
  async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(409).json({ message: 'User already exists' });
    }
    
    const salt = await bcryptjs.genSalt(10);
    req.body.password = await bcryptjs.hash(req.body.password, salt);

    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    await user.save();

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    const data = user._doc;
    delete data.password;
    res.status(201).json({ token, ...data });
  }
))

export default router;
