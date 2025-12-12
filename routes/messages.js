import { Router } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../schemas/User.js";
import { Caregiver } from "../schemas/Caregiver.js";
import Joi from "joi";

const router = Router();

const validateSendMessage = (obj) => {
  const schema = Joi.object({
    recipientId: Joi.string().required(),
    content: Joi.string().required(),
    type: Joi.string().valid("appointment", "service", "notification"),
  });
  return schema.validate(obj);
};

router.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId)
      .select("messages")
      .populate("messages.senderId", "username avatar");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.messages);
  })
);

router.get(
  "/caregiver/:caregiverId",
  asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findById(req.params.caregiverId)
      .select("messages")
      .populate("messages.senderId", "username avatar");
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }
    res.status(200).json(caregiver.messages);
  })
);

router.get(
  "/user/:userId/unread",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).select("messages");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const unreadMessages = user.messages.filter((msg) => !msg.read);
    res.status(200).json(unreadMessages);
  })
);

router.get(
  "/caregiver/:caregiverId/unread",
  asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findById(req.params.caregiverId).select(
      "messages"
    );
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }
    const unreadMessages = caregiver.messages.filter((msg) => !msg.read);
    res.status(200).json(unreadMessages);
  })
);

router.post(
  "/send-to-caregiver",
  asyncHandler(async (req, res) => {
    const { error } = validateSendMessage(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const caregiver = await Caregiver.findByIdAndUpdate(
      req.body.recipientId,
      {
        $push: {
          messages: {
            senderId: req.body.senderId,
            content: req.body.content,
            type: req.body.type || "notification",
          },
        },
      },
      { new: true }
    );
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    res.status(201).json({
      message: "Message sent successfully",
      caregiver: caregiver.messages[caregiver.messages.length - 1],
    });
  })
);

router.post(
  "/send-to-user",
  asyncHandler(async (req, res) => {
    const { error } = validateSendMessage(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findByIdAndUpdate(
      req.body.recipientId,
      {
        $push: {
          messages: {
            senderId: req.body.senderId,
            content: req.body.content,
            type: req.body.type || "notification",
          },
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({
      message: "Message sent successfully",
      user: user.messages[user.messages.length - 1],
    });
  })
);

router.patch(
  "/user/:userId/mark-as-read/:messageId",
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          "messages.$[elem].read": true,
        },
      },
      {
        arrayFilters: [{ "elem._id": req.params.messageId }],
        new: true,
      }
    );
    if (!user) {
      return res.status(404).json({ message: "User or message not found" });
    }

    res.status(200).json({ message: "Message marked as read" });
  })
);

router.patch(
  "/caregiver/:caregiverId/mark-as-read/:messageId",
  asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.caregiverId,
      {
        $set: {
          "messages.$[elem].read": true,
        },
      },
      {
        arrayFilters: [{ "elem._id": req.params.messageId }],
        new: true,
      }
    );
    if (!caregiver) {
      return res
        .status(404)
        .json({ message: "Caregiver or message not found" });
    }

    res.status(200).json({ message: "Message marked as read" });
  })
);

router.delete(
  "/user/:userId/:messageId",
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { messages: { _id: req.params.messageId } } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User or message not found" });
    }

    res.status(200).json({ message: "Message deleted" });
  })
);

router.delete(
  "/caregiver/:caregiverId/:messageId",
  asyncHandler(async (req, res) => {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.caregiverId,
      { $pull: { messages: { _id: req.params.messageId } } },
      { new: true }
    );
    if (!caregiver) {
      return res
        .status(404)
        .json({ message: "Caregiver or message not found" });
    }

    res.status(200).json({ message: "Message deleted" });
  })
);

export default router;
