import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  MedicalNote,
  validateCreateMedicalNote,
  validateUpdateMedicalNote,
} from "../schemas/MedicalNote.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const notes = await MedicalNote.find()
      .populate("caregiverId", "username specialization")
      .populate("patientId", "username email");
    res.status(200).json(notes);
  })
);

router.get(
  "/patient/:patientId",
  asyncHandler(async (req, res) => {
    const notes = await MedicalNote.find({ patientId: req.params.patientId })
      .populate("caregiverId", "username specialization")
      .sort({ issuedAt: -1 });
    res.status(200).json(notes);
  })
);

router.get(
  "/caregiver/:caregiverId",
  asyncHandler(async (req, res) => {
    const notes = await MedicalNote.find({
      caregiverId: req.params.caregiverId,
    })
      .populate("patientId", "username email")
      .sort({ issuedAt: -1 });
    res.status(200).json(notes);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const note = await MedicalNote.findById(req.params.id)
      .populate("caregiverId", "username specialization")
      .populate("patientId", "username email");
    if (!note) {
      return res.status(404).json({ message: "Medical note not found" });
    }
    res.status(200).json(note);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateMedicalNote(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const note = new MedicalNote({
      caregiverId: req.body.caregiverId,
      patientId: req.body.patientId,
      notes: req.body.notes,
      medications: req.body.medications,
    });

    await note.save();
    const result = await MedicalNote.findById(note._id)
      .populate("caregiverId", "username specialization")
      .populate("patientId", "username email");
    res.status(201).json(result);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateMedicalNote(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const note = await MedicalNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Medical note not found" });
    }

    const result = await MedicalNote.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(result);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const note = await MedicalNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Medical note not found" });
    }

    const result = await MedicalNote.deleteOne({ _id: req.params.id });
    res.status(200).json(result);
  })
);

export default router;
