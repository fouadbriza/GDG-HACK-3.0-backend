import { Router } from "express";
import asyncHandler from "express-async-handler";
import { Caregiver } from "../schemas/Caregiver.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const caregivers = await Caregiver.find().select("-password");
    res.status(200).json(caregivers);
  })
);

export default router;
