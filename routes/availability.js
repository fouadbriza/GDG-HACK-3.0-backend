import { Router } from "express";
import asyncHandler from "express-async-handler";
import { Caregiver } from "../schemas/Caregiver.js";
import Joi from "joi";

const router = Router();

const validateAvailability = (obj) => {
  const schema = Joi.object({
    dayOfWeek: Joi.string()
      .valid(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      )
      .required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
  });
  return schema.validate(obj);
};

router.get(
  "/:caregiverId",
  asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findById(req.params.caregiverId).select(
      "availability"
    );
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }
    res.status(200).json(caregiver.availability);
  })
);

router.post(
  "/:caregiverId",
  asyncHandler(async (req, res) => {
    const { error } = validateAvailability(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.caregiverId,
      { $push: { availability: req.body } },
      { new: true }
    );
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    res.status(201).json(caregiver.availability);
  })
);

router.put(
  "/:caregiverId/:availabilityId",
  asyncHandler(async (req, res) => {
    const { error } = validateAvailability(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.caregiverId,
      {
        $set: {
          "availability.$[elem]": req.body,
        },
      },
      {
        arrayFilters: [{ "elem._id": req.params.availabilityId }],
        new: true,
      }
    );
    if (!caregiver) {
      return res
        .status(404)
        .json({ message: "Caregiver or availability not found" });
    }

    res.status(200).json(caregiver.availability);
  })
);

router.delete(
  "/:caregiverId/:availabilityId",
  asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.caregiverId,
      { $pull: { availability: { _id: req.params.availabilityId } } },
      { new: true }
    );
    if (!caregiver) {
      return res
        .status(404)
        .json({ message: "Caregiver or availability not found" });
    }

    res.status(200).json(caregiver.availability);
  })
);

export default router;
