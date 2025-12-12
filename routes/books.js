import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  Book,
  validateCreateBook,
  validateUpdateBook,
} from "../schemas/Book.js";
import { Author } from "../schemas/Author.js";
import { verifyToken, verifyAdmin } from "../middlewares/verifyToken.js";

const router = Router();

router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const booksList = await Book.find().populate("author", ["_id", "fullName"]);
    res.status(200).json(booksList);
  })
);

router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author", [
      "_id",
      "fullName",
    ]);
    if (!book) {
      res.status(404).json({ message: "Book doesn't exist" });
    }
    res.status(200).json(book);
  })
);

router.post(
  "/",
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateCreateBook(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    let book = await Book.findOne({ title: req.body.title });
    if (book) {
      res.status(409).json({ message: "Book already exists" });
    }
    const author = await Author.findById(req.body.author);
    if (!author) {
      res.status(400).json({ message: "Add the author of this book first" });
    }
    book = new Book({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      price: req.body.price,
      cover: req.body.cover,
    });
    const result = await book.save();
    res.status(201).json(result);
  })
);

router.put(
  "/:id",
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: "Book doesn't exist" });
    }
    const result = await Book.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(201).json(result);
  })
);

router.delete(
  "/:id",
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: "Book doesn't exist" });
    }
    const result = await Book.deleteOne({ _id: req.params.id });
    res.json(200).json(result);
  })
);

export default router;
