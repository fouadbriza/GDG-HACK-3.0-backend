import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  Author,
  validateCreateAuthor,
  validateUpdateAuthor,
} from "../schemas/Author.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const authorsList = await Author.find();
    res.status(200).json(authorsList);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (!author) {
      res.status(404).json({ message: "Author doesn't exist" });
    }
    res.status(200).json(author);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = validateCreateAuthor(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    let author = await Author.findOne({ fullName: req.body.fullName });
    if (author) {
      res.status(409).json({ message: "Author already exists" });
    }
    author = new Author({
      fullName: req.body.fullName,
      nationality: req.body.nationality,
      profileAvatar: req.body.profileAvatar,
    });
    const result = await author.save();
    res.status(201).json(result);
  })
);

/**
 * @desc Update an author's information
 * @route /authors/:id
 * @method PUT
 * @access private (only admin)
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    const author = await Author.findById(req.params.id);
    if (!author) {
      res.status(404).json({ message: "Author doesn't exist" });
    }
    const result = await Author.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(result);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (!author) {
      res.status(404).json({ message: "Author doesn't exist" });
    }
    const result = await Author.deleteOne({ _id: req.params.id });
    res.status(200).json(result);
  })
);

export default router;
