import Joi from "joi";
import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const User = model('User', UserSchema);

export const validateUpdateUser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(30),
    email: Joi.string().email().trim(),
    password: Joi.string().min(6).trim(),
  })
  return schema.validate(obj);
}

export const validateLoginUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().min(6)
  })
  return schema.validate(obj);
}

export const validateRegisterUser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).required()
  })
  return schema.validate(obj);
}

export const validateForgotPassword = (obj) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().required()
  });
  return schema.validate(obj);
}

export const validateResetPassword = (obj) => {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).required()
  });
  return schema.validate(obj);
}
