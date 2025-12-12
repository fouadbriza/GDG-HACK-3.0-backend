import Joi from "joi";
import { model, Schema } from "mongoose";

const CaregiverSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    specialization: {
      type: String,
      trim: true,
      default: "General",
    },
    phone: {
      type: String,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    availability: [
      {
        dayOfWeek: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: { type: String },
        endTime: { type: String },
      },
    ],
    messages: [
      {
        senderId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        content: { type: String, required: true },
        type: {
          type: String,
          enum: ["appointment", "service", "notification"],
          default: "notification",
        },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Caregiver = model("Caregiver", CaregiverSchema);

export const validateUpdateCaregiver = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(30),
    email: Joi.string().email().trim(),
    password: Joi.string().min(6).trim(),
    specialization: Joi.string().trim(),
    phone: Joi.string().trim(),
  });
  return schema.validate(obj);
};

export const validateLoginCaregiver = (obj) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
};

export const validateRegisterCaregiver = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).required(),
    specialization: Joi.string().trim(),
    phone: Joi.string().trim(),
  });
  return schema.validate(obj);
};

export const validateForgotPassword = (obj) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
  });
  return schema.validate(obj);
};

export const validateResetPassword = (obj) => {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
};
