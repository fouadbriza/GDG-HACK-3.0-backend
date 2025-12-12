import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  Appointment,
  validateCreateAppointment,
  validateUpdateAppointment,
  validateCancelAppointment,
} from "../schemas/Appointment.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const appointments = await Appointment.find()
      .populate("caregiverId", "username specialization phone")
      .populate("patientId", "username phone");
    res.status(200).json(appointments);
  })
);

router.get(
  "/patient/:patientId",
  asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
    })
      .populate("caregiverId", "username specialization phone")
      .sort({ date: -1 });
    res.status(200).json(appointments);
  })
);

router.get(
  "/caregiver/:caregiverId",
  asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({
      caregiverId: req.params.caregiverId,
    })
      .populate("patientId", "username phone")
      .sort({ date: -1 });
    res.status(200).json(appointments);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id)
      .populate("caregiverId", "username specialization phone")
      .populate("patientId", "username phone");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateAppointment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const appointment = new Appointment({
      caregiverId: req.body.caregiverId,
      patientId: req.body.patientId,
      date: req.body.date,
      notes: req.body.notes,
    });

    await appointment.save();
    const result = await Appointment.findById(appointment._id)
      .populate("caregiverId", "username specialization phone")
      .populate("patientId", "username phone");
    res.status(201).json(result);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateAppointment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const result = await Appointment.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(result);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const result = await Appointment.deleteOne({ _id: req.params.id });
    res.status(200).json(result);
  })
);

router.patch(
  "/:id/cancel",
  asyncHandler(async (req, res) => {
    const { error } = validateCancelAppointment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    )
      .populate("caregiverId", "username specialization")
      .populate("patientId", "username");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  })
);

export default router;
