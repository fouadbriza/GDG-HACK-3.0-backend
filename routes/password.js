import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { User, validateForgotPassword, validateResetPassword } from '../schemas/User.js';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const router = Router();

/** 
 * @desc Forgot password route
 * @route /password/forgot-password
 * @method POST
 * @access public
 */
router.post('/forgot-password', asyncHandler(
  async (req, res) => {
    const { error } = validateForgotPassword(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ message: 'Something went wrong' });
    }

    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, secret, {
      expiresIn: '5m'
    });
    const url = `http://localhost:${process.env.PORT}/password/reset-password/${user._id}/${token}`;
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
      }
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `<div>
               <h4>Click on the link below to reset you password</h4>
               <p>${url}</p>
             </div>`
    };
    transport.sendMail(mailOptions, function(err, succ){
      if(err) {
        console.error(err);
      } else {
        console.log("Email sent: " + succ.response);
      }
    });
    res.status(200).json({ message: 'Check you inbox' });
  }
))

/**
 * @desc Reset password route
 * @route /password/reset-password/:id/:token
 * @method POST
 * @access public
 */
router.post('/:id/:token', asyncHandler(
  async(req, res) => {
    const { error } = validateResetPassword(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.status(400).json({ message: 'Something went wrong' });
    }
    const secret = process.env.JWT_SECRET + user.password;
    const payload = jwt.verify(req.params.token, secret);
    if (payload.id !== req.params.id) {
      res.status(400).json(jwt.JsonWebTokenError());
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body.password }
    );
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    delete result.password;
    res.status(201).json({ ...result, token });
  }
))

export default router;
