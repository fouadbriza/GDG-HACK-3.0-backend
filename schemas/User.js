import Joi from "joi";
import { model, Schema } from "mongoose";

const UserSchema = new Schema(
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
    role: {
      type: String,
      enum: ["user", "admin", "caregiver"],
      default: "user",
    },
    avatar: { type: String, trim: true },
    phone: { type: String, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    assignedCaregivers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Caregiver",
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
    serviceRequests: [
      {
        category: {
          type: String,
          enum: ["health", "transport", "home care", "groceries"],
        },
        description: { type: String, trim: true },
        status: {
          type: String,
          enum: ["pending", "accepted", "completed", "cancelled"],
          default: "pending",
        },
        caregiverId: {
          type: Schema.Types.ObjectId,
          ref: "Caregiver",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);

export const validateUpdateUser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(30),
    email: Joi.string().email().trim().lowercase(),
    password: Joi.string().min(6).trim(),
    avatar: Joi.string().trim(),
    phone: Joi.string().trim(),
    status: Joi.string().valid("active", "inactive"),
    role: Joi.string().valid("user", "admin", "caregiver"),
    emergencyContact: Joi.object({
      name: Joi.string().trim(),
      phone: Joi.string().trim(),
    }),
    assignedCaregivers: Joi.array().items(Joi.string()),
  });
  return schema.validate(obj);
};

export const validateLoginUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
};

export const validateRegisterUser = (obj) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(6).required(),
    avatar: Joi.string().trim(),
    phone: Joi.string().trim(),
  });
  return schema.validate(obj);
};

export const validateForgotPassword = (obj) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
  });
  return schema.validate(obj);
};

export const validateResetPassword = (obj) => {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
};
