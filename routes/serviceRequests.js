import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  ServiceRequest,
  validateCreateServiceRequest,
  validateUpdateServiceRequest,
} from "../schemas/ServiceRequest.js";
import { User } from "../schemas/User.js";
import { Caregiver } from "../schemas/Caregiver.js";

const router = Router();

/**
 * @swagger
 * /service-requests:
 *   get:
 *     summary: Get all service requests
 *     tags: [Service Requests]
 *     responses:
 *       200:
 *         description: List of service requests
 *   post:
 *     summary: Create new service request
 *     tags: [Service Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId: { type: string }
 *               category: { type: string, enum: [health, transport, home care, groceries] }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Service request created
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const requests = await ServiceRequest.find()
      .populate("patientId", "username phone email")
      .populate("caregiverId", "username specialization phone")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  })
);

router.get(
  "/patient/:patientId",
  asyncHandler(async (req, res) => {
    const requests = await ServiceRequest.find({
      patientId: req.params.patientId,
    })
      .populate("caregiverId", "username specialization phone")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  })
);

router.get(
  "/caregiver/:caregiverId",
  asyncHandler(async (req, res) => {
    const requests = await ServiceRequest.find({
      caregiverId: req.params.caregiverId,
    })
      .populate("patientId", "username phone email")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  })
);

router.get(
  "/pending/:caregiverId",
  asyncHandler(async (req, res) => {
    const requests = await ServiceRequest.find({
      status: "pending",
    })
      .populate("patientId", "username phone email")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const request = await ServiceRequest.findById(req.params.id)
      .populate("patientId", "username phone email")
      .populate("caregiverId", "username specialization phone");
    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }
    res.status(200).json(request);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateServiceRequest(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const serviceRequest = new ServiceRequest({
      patientId: req.body.patientId,
      category: req.body.category,
      description: req.body.description,
    });

    await serviceRequest.save();
    const result = await ServiceRequest.findById(serviceRequest._id)
      .populate("patientId", "username phone email")
      .populate("caregiverId", "username specialization phone");

    res.status(201).json(result);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateServiceRequest(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

    const result = await ServiceRequest.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(result);
  })
);

router.patch(
  "/:id/accept/:caregiverId",
  asyncHandler(async (req, res) => {
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      {
        caregiverId: req.params.caregiverId,
        status: "accepted",
      },
      { new: true }
    )
      .populate("patientId", "username phone email")
      .populate("caregiverId", "username specialization phone");

    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

    res.status(200).json(request);
  })
);

router.patch(
  "/:id/complete",
  asyncHandler(async (req, res) => {
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    )
      .populate("patientId", "username phone email")
      .populate("caregiverId", "username specialization phone");

    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

    res.status(200).json(request);
  })
);

router.patch(
  "/:id/cancel",
  asyncHandler(async (req, res) => {
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    )
      .populate("patientId", "username phone email")
      .populate("caregiverId", "username specialization phone");

    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

    res.status(200).json(request);
  })
);

export default router;
