import { model, Schema } from "mongoose";
import Joi from 'joi';

const AuthorSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 30
  },
  nationality: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 30
  },
  profileAvatar: {
    type: String,
    required: false,
    trim: true,
    minlength: 10
  }
}, { timestamps: true });

export const Author = model('Author', AuthorSchema);

export const validateCreateAuthor = (obj) => {
  const schema = Joi.object({
    fullName: Joi.string().trim().min(5).max(30).required(),
    nationality: Joi.string().trim().min(5).max(30).required(),
    profileAvatar: Joi.string().trim(),
  });
  return schema.validate(obj);
}

export const validateUpdateAuthor = (obj) => {
  const schema = Joi.object({
    fullName: Joi.string().trim().min(5).max(30),
    nationality: Joi.string().trim().min(5).max(30),
    profileAvatar: Joi.string().trim(),
  })
  return schema.validate(obj);
}