const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Request = require("../models/Request");
const router = express.Router();
require("dotenv").config();

// Route to create a new request
router.post("/create", async (req, res) => {
  const { title, description, type, urgency, requesterEmail, approverEmail } =
    req.body;

  // Log the received data
  console.log("Received request data:", {
    title,
    description,
    type,
    urgency,
    requesterEmail,
    approverEmail,
  });

  // Validate required fields
  if (
    !title ||
    !description ||
    !type ||
    !urgency ||
    !requesterEmail ||
    !approverEmail
  ) {
    return res.status(400).json({
      message: "All fields are required",
      missingFields: {
        title: !title,
        description: !description,
        type: !type,
        urgency: !urgency,
        requesterEmail: !requesterEmail,
        approverEmail: !approverEmail,
      },
    });
  }

  try {
    // Create new request
    const newRequest = new Request({
      title,
      description,
      type,
      urgency,
      requesterEmail,
      approverEmail,
      status: "Pending",
    });

    // Save to database
    const savedRequest = await newRequest.save();
    console.log("Request saved successfully:", savedRequest);

    try {
      const notificationUrl = `${process.env.NOTIFICATION_SERVICE_URL}/notification/send-request-notification`;
      console.log("Attempting to send notification to:", notificationUrl);

      await axios.post(notificationUrl, {
        requesterEmail,
        approverEmail,
        requestTitle: title,
      });

      console.log("Notification sent successfully");
    } catch (notificationError) {
      console.error("Notification error details:", {
        message: notificationError.message,
        response: notificationError.response?.data,
        status: notificationError.response?.status,
        url: notificationError.config?.url,
      });
    }

    res.status(201).json({
      request: savedRequest,
    });
  } catch (error) {
    console.error("Error in request creation:", error);
    res.status(500).json({
      message: "Failed to create request",
      error: error.message,
    });
  }
});
// Route to approve a request
router.put("/approve/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid request ID" });
  }

  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/send-approval-notification`,
      {
        requesterEmail: updatedRequest.requesterEmail,
        approverEmail: updatedRequest.approverEmail,
        requestTitle: updatedRequest.title,
      }
    );

    res
      .status(200)
      .json({
        message: "Request approved and notifications sent",
        request: updatedRequest,
      });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Failed to approve request" });
  }
});

// Route to fetch requests for a user
router.get("/fetch", async (req, res) => {
  const email = decodeURIComponent(req.query.email);
  const { role, includeAll } = req.query;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required" });
  }

  try {
    let requests;

    if (role === "requester") {
      requests = await Request.find({ requesterEmail: email });
    } else if (role === "approver") {
      if (includeAll === "true") {
        // If includeAll is true, fetch all requests for the approver
        requests = await Request.find({ approverEmail: email });
      } else {
        // Otherwise, fetch only pending requests
        requests = await Request.find({
          approverEmail: email,
          status: "Pending",
        });
      }
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});
// Route to update request status
router.put("/update-status/:id", async (req, res) => {
  console.log("Received update request:", req.params, req.body);

  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate status
    if (!["approved", "rejected"].includes(status?.toLowerCase())) {
      return res.status(400).json({
        message:
          'Invalid status value. Must be either "approved" or "rejected"',
      });
    }

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid request ID format",
      });
    }

    // Find the request 
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        requestId: id,
      });
    }

    // Update the request
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() },
      { new: true }
    );

    console.log("Request updated successfully:", updatedRequest);

    return res.status(200).json({
      message: "Request status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating request:", error);
    return res.status(500).json({
      message: "Failed to update request status",
      error: error.message,
    });
  }
});

module.exports = router;
