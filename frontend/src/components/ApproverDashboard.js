import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle, Search } from "lucide-react";
import axios from "axios";

// RequestCard component
const RequestCard = ({ request, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const handleAction = async (action) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      console.log("Updating request:", request._id, "with status:", action);

      // Add proper URL formatting and headers
      const updateResponse = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}/request/update-status/${request._id}`,
        data: { status: action },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (updateResponse.data.request) {
        // Only send notification if update was successful
        try {
          await axios({
            method: "POST",
            url: `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/notification/send-status-update-notification`,
            data: {
              requesterEmail: request.requesterEmail,
              approverEmail: request.approverEmail,
              requestTitle: request.title,
              status: action,
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (notificationError) {
          console.error("Notification error:", notificationError);
          // Continue even if notification fails
        }

        onStatusChange(request._id, action);
      }
    } catch (error) {
      console.error("Error updating request:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update request status. Please try again.";
      alert(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };
  const statusColorClass = getStatusColor(request.status);

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            From: {request.requesterEmail}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full flex items-center space-x-1 ${statusColorClass}`}
        >
          {getStatusIcon(request.status)}
          <span className="text-sm font-medium capitalize">
            {request.status}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{request.description}</p>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{request.type}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div
              className={`w-2 h-2 rounded-full ${
                request.urgency === "High"
                  ? "bg-red-500"
                  : request.urgency === "Medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            <span>{request.urgency} Priority</span>
          </div>
        </div>

        {request.status?.toLowerCase() === "pending" && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleAction("rejected")}
              disabled={isUpdating}
              className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-md hover:bg-red-50 flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => handleAction("approved")}
              disabled={isUpdating}
              className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-50 flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
//Approver Dashboard component

const ApproverDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          console.error("User email not found in localStorage");
          return;
        }

        const response = await axios({
          method: "GET",
          url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}/request/fetch`,
          params: {
            email: userEmail,
            role: "approver",
            includeAll: true,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });

        const sortedRequests = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRequests(sortedRequests);
      } catch (error) {
        console.error(
          "Error fetching requests:",
          error.response?.data || error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = (requestId, newStatus) => {
    setRequests((prevRequests) =>
      prevRequests
        .map((request) =>
          request._id === requestId
            ? { ...request, status: newStatus }
            : request
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  const filteredRequests = requests.filter((request) => {
    const matchesFilter =
      filter === "all" || request.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requesterEmail
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No requests found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "No requests match the current filter"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApproverDashboard;
