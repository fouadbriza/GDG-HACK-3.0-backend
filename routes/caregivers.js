import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  Caregiver,
  validateRegisterCaregiver,
  validateUpdateCaregiver,
} from "../schemas/Caregiver.js";
import bcryptjs from "bcryptjs";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const caregivers = await Caregiver.find().select("-password");
    res.status(200).json(caregivers);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findById(req.params.id).select(
      "-password"
    );
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }
    res.status(200).json(caregiver);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterCaregiver(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let caregiver = await Caregiver.findOne({ email: req.body.email });
    if (caregiver) {
      return res.status(409).json({ message: "Caregiver already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    req.body.password = await bcryptjs.hash(req.body.password, salt);

    caregiver = new Caregiver({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      specialization: req.body.specialization,
      phone: req.body.phone,
    });
    await caregiver.save();

    const result = await Caregiver.findById(caregiver._id).select("-password");
    res.status(201).json(result);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateCaregiver(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    const { password } = req.body;
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      req.body.password = await bcryptjs.hash(password, salt);
    }

    const result = await Caregiver.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(result);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    const result = await Caregiver.deleteOne({ _id: req.params.id });
    res.status(200).json(result);
  })
);

export default router;
