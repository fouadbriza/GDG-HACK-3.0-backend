import Joi from "joi";
import { model, Schema } from "mongoose";

const AppointmentSchema = new Schema(
  {
    caregiverId: {
      type: Schema.Types.ObjectId,
      ref: "Caregiver",
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export const Appointment = model("Appointment", AppointmentSchema);

export const validateCreateAppointment = (obj) => {
  const schema = Joi.object({
    caregiverId: Joi.string().required(),
    patientId: Joi.string().required(),
    date: Joi.date().required(),
    notes: Joi.string().trim(),
  });
  return schema.validate(obj);
};

export const validateUpdateAppointment = (obj) => {
  const schema = Joi.object({
    date: Joi.date(),
    notes: Joi.string().trim(),
    status: Joi.string().valid("scheduled", "completed", "cancelled"),
  });
  return schema.validate(obj);
};

export const validateCancelAppointment = (obj) => {
  const schema = Joi.object({
    status: Joi.string().valid("cancelled").required(),
  });
  return schema.validate(obj);
};
