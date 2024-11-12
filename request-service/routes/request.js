const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Request = require("../models/Request");
const router = express.Router();
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Initialize cache
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// Define rate limiters
const createRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 create requests per window
  message: "Too many create requests from this IP, please try again later.",
});

const fetchRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 fetch requests per window
  message: "Too many fetch requests from this IP, please try again later.",
});

const approveRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 30 approve requests per window
  message: "Too many approve requests from this IP, please try again later.",
});

// Route to create a new request with rate limiting
router.post("/create", createRequestLimiter, async (req, res) => {
  const { title, description, type, urgency, requesterEmail, approverEmail } = req.body;

  console.log("Received request data:", { title, description, type, urgency, requesterEmail, approverEmail });

  // Validate required fields
  if (!title || !description || !type || !urgency || !requesterEmail || !approverEmail) {
    return res.status(400).json({
      message: "All fields are required",
      missingFields: { title: !title, description: !description, type: !type, urgency: !urgency, requesterEmail: !requesterEmail, approverEmail: !approverEmail },
    });
  }

  try {
    // Create new request
    const newRequest = new Request({ title, description, type, urgency, requesterEmail, approverEmail, status: "Pending" });
    const savedRequest = await newRequest.save();
    console.log("Request saved successfully:", savedRequest);

    try {
      const notificationUrl = `${process.env.NOTIFICATION_SERVICE_URL}/notification/send-request-notification`;
      await axios.post(notificationUrl, { requesterEmail, approverEmail, requestTitle: title });
      console.log("Notification sent successfully");
    } catch (notificationError) {
      console.error("Notification error details:", notificationError);
    }

    res.status(201).json({ request: savedRequest });
  } catch (error) {
    console.error("Error in request creation:", error);
    res.status(500).json({ message: "Failed to create request", error: error.message });
  }
});

// Route to approve a request with rate limiting
router.put("/approve/:id", approveRequestLimiter, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid request ID" });
  }

  try {
    const updatedRequest = await Request.findByIdAndUpdate(id, { status: "Approved" }, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/send-approval-notification`, {
      requesterEmail: updatedRequest.requesterEmail,
      approverEmail: updatedRequest.approverEmail,
      requestTitle: updatedRequest.title,
    });

    res.status(200).json({ message: "Request approved and notifications sent", request: updatedRequest });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Failed to approve request" });
  }
});

// Route to fetch requests for a user with rate limiting and caching
router.get("/fetch", fetchRequestLimiter, async (req, res) => {
  const email = decodeURIComponent(req.query.email);
  const { role, includeAll } = req.query;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required" });
  }

  // Generate a cache key based on query parameters
  const cacheKey = `requests_${email}_${role}_${includeAll}`;
  // const cachedRequests = cache.get(cacheKey);

  // Serve cached data if available (disabled temporarily)
  // if (cachedRequests) {
  //   console.log("Serving cached data", cachedRequests.length);
  //   return res.status(200).json(cachedRequests);
  // }

  try {
    let requests;
    if (role === "requester") {
      requests = await Request.find({ requesterEmail: email });
    } else if (role === "approver") {
      requests = await Request.find({
        approverEmail: email,
        ...(includeAll === "true" ? {} : { status: "Pending" })
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Log the number of requests retrieved from the database
    console.log("Fetched requests from DB:", requests.length);

    // Cache the results (disabled temporarily)
    // cache.set(cacheKey, requests);
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
    if (!["approved", "rejected"].includes(status?.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid status value. Must be either "approved" or "rejected"' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID format" });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found", requestId: id });
    }

    const updatedRequest = await Request.findByIdAndUpdate(id, { status: status.toLowerCase() }, { new: true });
    console.log("Request updated successfully:", updatedRequest);

    return res.status(200).json({ message: "Request status updated successfully", request: updatedRequest });
  } catch (error) {
    console.error("Error updating request:", error);
    return res.status(500).json({ message: "Failed to update request status", error: error.message });
  }
});

module.exports = router;
