import { model, Schema } from "mongoose";
import Joi from 'joi';

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 38
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  },
  description: {
    type: String,
    required: false,
    trim: true,
    minlength: 15
  },
  cover: {
    type: String,
    enum: ['soft cover', 'hard cover'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

export const Book = model('Book', BookSchema);

export const validateCreateBook = (obj) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(8).max(38).required(),
    author: Joi.string().required(),
    description: Joi.string().trim().min(15),
    cover: Joi.string().valid(['soft cover', 'hard cover']).required(),
    price: Joi.number().min(0).required(),
  })
  return schema.validate(obj);
}

export const validateUpdateBook = (obj) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(8).max(38),
    author: Joi.string(),
    description: Joi.string().trim().min(15),
    price: Joi.number().min(0),
  })
  return schema.validate(obj);
}
