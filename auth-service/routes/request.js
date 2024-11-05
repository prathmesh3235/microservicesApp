const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Request = require("../models/Request");
const router = express.Router();
require("dotenv").config();

// Route to update request status
router.put("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("Request to update status:", id, status);

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid request ID" });
  }

  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Send notification
    try {
      await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/notification/send-status-update-notification`,
        {
          requesterEmail: updatedRequest.requesterEmail,
          approverEmail: updatedRequest.approverEmail,
          requestTitle: updatedRequest.title,
          status,
        }
      );
    } catch (notificationError) {
      console.error("Error sending notification:", notificationError);
    }

    res
      .status(200)
      .json({ message: "Request status updated", request: updatedRequest });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Failed to update request status" });
  }
});

module.exports = router;
