import Joi from "joi";
import { model, Schema } from "mongoose";

const MedicalNoteSchema = new Schema(
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
    notes: {
      type: String,
      required: true,
      trim: true,
    },
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: {
          type: String,
          enum: ["daily", "twice daily", "weekly", "as needed"],
        },
      },
    ],
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const MedicalNote = model("MedicalNote", MedicalNoteSchema);

export const validateCreateMedicalNote = (obj) => {
  const schema = Joi.object({
    caregiverId: Joi.string().required(),
    patientId: Joi.string().required(),
    notes: Joi.string().required().trim(),
    medications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string().required(),
        frequency: Joi.string().valid(
          "daily",
          "twice daily",
          "weekly",
          "as needed"
        ),
      })
    ),
  });
  return schema.validate(obj);
};

export const validateUpdateMedicalNote = (obj) => {
  const schema = Joi.object({
    notes: Joi.string().trim(),
    medications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string().required(),
        frequency: Joi.string().valid(
          "daily",
          "twice daily",
          "weekly",
          "as needed"
        ),
      })
    ),
  });
  return schema.validate(obj);
};
