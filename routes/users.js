import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { User, validateUpdateUser } from '../schemas/User.js';
import * as bcrypt from 'bcryptjs';

const router = Router();

/**
 * @description Get all users
 * @route /users
 * @method GET
 * @access private (only admin)
 */
router.get('/', asyncHandler(
  async (req, res) => {
    const usersList = await User.find().select('-password');
    res.status(200).json(usersList);
  }
))

/**
 * @description Get user by id
 * @route /users/:id
 * @method GET
 * @access private (admin and user himself)
 */
router.get('/:id', asyncHandler(
  async(req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User doesn\'t exist' });
    }
    res.status(200).json(user);
  }
))

/**
 * @description Update a user's information
 * @route /users/:id
 * @method PUT
 * @access private (admin and user himself)
 */
router.put('/:id', asyncHandler(
  async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User doesn\'t exist' });
    }
    const { password } = req.body;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(201).json(result);
  }
))

/**
 * @desc Delete user by id
 * @route /users/:id
 * @method DELETE
 * @access private (only admin and user himself)
 */
router.delete('/:id', asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User doesn\'t exist' });
    }
    const result = await User.deleteOne({ _id: req.params.id });
    res.status(200).json(result);
  }
))

export default router;
