import { Router } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../schemas/User.js";

const router = Router();

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients (elderly users)
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of all patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const patients = await User.find({ role: "user" })
      .select("-password")
      .populate("assignedCaregivers", "username specialization phone");
    res.status(200).json(patients);
  })
);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Patient not found
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const patient = await User.findById(req.params.id)
      .select("-password")
      .populate("assignedCaregivers", "username specialization phone");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  })
);

/**
 * @swagger
 * /patients/{id}/appointments:
 *   get:
 *     summary: Get patient's appointments
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Patient's appointments
 */
router.get(
  "/:id/appointments",
  asyncHandler(async (req, res) => {
    const patient = await User.findById(req.params.id).select("_id");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const { Appointment } = await import("../schemas/Appointment.js");
    const appointments = await Appointment.find({ patientId: req.params.id })
      .populate("caregiverId", "username specialization phone")
      .sort({ date: -1 });

    res.status(200).json(appointments);
  })
);

/**
 * @swagger
 * /patients/{id}/medical-notes:
 *   get:
 *     summary: Get patient's medical notes
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Patient's medical notes
 */
router.get(
  "/:id/medical-notes",
  asyncHandler(async (req, res) => {
    const patient = await User.findById(req.params.id).select("_id");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const { MedicalNote } = await import("../schemas/MedicalNote.js");
    const notes = await MedicalNote.find({ patientId: req.params.id })
      .populate("caregiverId", "username specialization")
      .sort({ issuedAt: -1 });

    res.status(200).json(notes);
  })
);

/**
 * @swagger
 * /patients/{id}/service-requests:
 *   get:
 *     summary: Get patient's service requests
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Patient's service requests
 */
router.get(
  "/:id/service-requests",
  asyncHandler(async (req, res) => {
    const patient = await User.findById(req.params.id).select("_id");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const { ServiceRequest } = await import("../schemas/ServiceRequest.js");
    const requests = await ServiceRequest.find({ patientId: req.params.id })
      .populate("caregiverId", "username specialization phone")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  })
);

/**
 * @swagger
 * /patients/{id}/messages:
 *   get:
 *     summary: Get patient's messages
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Patient's messages
 */
router.get(
  "/:id/messages",
  asyncHandler(async (req, res) => {
    const patient = await User.findById(req.params.id).select("messages");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient.messages);
  })
);

export default router;
