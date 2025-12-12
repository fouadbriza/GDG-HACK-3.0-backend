import Joi from "joi";
import { model, Schema } from "mongoose";

const ServiceRequestSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caregiverId: {
      type: Schema.Types.ObjectId,
      ref: "Caregiver",
    },
    category: {
      type: String,
      enum: ["health", "transport", "home care", "groceries"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const ServiceRequest = model("ServiceRequest", ServiceRequestSchema);

export const validateCreateServiceRequest = (obj) => {
  const schema = Joi.object({
    patientId: Joi.string().required(),
    category: Joi.string()
      .valid("health", "transport", "home care", "groceries")
      .required(),
    description: Joi.string().trim(),
  });
  return schema.validate(obj);
};

export const validateUpdateServiceRequest = (obj) => {
  const schema = Joi.object({
    caregiverId: Joi.string(),
    status: Joi.string().valid("pending", "accepted", "completed", "cancelled"),
    description: Joi.string().trim(),
  });
  return schema.validate(obj);
};
