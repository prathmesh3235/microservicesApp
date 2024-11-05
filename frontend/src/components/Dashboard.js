import React, { useState, useEffect } from "react";
import {
  LogOut,
  Plus,
  Box,
  Clock3,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  X,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import ApproverDashboard from "./ApproverDashboard";

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
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "rejected":
      return <XCircle className="w-5 h-5 text-red-600" />;
    default:
      return <Clock className="w-5 h-5 text-yellow-600" />;
  }
};

const RequestCard = ({ request }) => {
  const statusColorClass = getStatusColor(request.status);
  const StatusIcon = () => getStatusIcon(request.status);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{request.type}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full flex items-center space-x-1 ${statusColorClass}`}
        >
          <StatusIcon />
          <span className="text-sm font-medium">{request.status}</span>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{request.description}</p>
      <div className="border-t pt-4">
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Clock3 className="w-4 h-4" />
            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
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
      </div>
    </div>
  );
};

const CustomAlert = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in duration-300 max-w-sm">
      <div
        className={`rounded-lg shadow-lg p-4 ${
          type === "success" ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <div className="flex items-start space-x-3">
          {type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                type === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-white/25 ${
              type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-gray-700 font-medium">Creating your request...</p>
    </div>
  </div>
);

const RequesterDashboard = ({
  requests,
  showModal,
  setShowModal,
  newRequest,
  handleInputChange,
  handleCreateRequest,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState(null);
  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await handleCreateRequest();
      setShowModal(false);
      setNotification({
        type: "success",
        message: "Request created successfully!",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Failed to create request",
      });
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">My Requests</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your requests
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Request</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRequests.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <Box className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new request.
          </p>
        </div>
      )}

      {notification && (
        <CustomAlert
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {isCreating && <LoadingSpinner />}

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-medium mb-4">
              Create New Request
            </Dialog.Title>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    name="type"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    onChange={handleInputChange}
                  >
                    <option value="Leave">Leave</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Overtime">Overtime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Urgency
                  </label>
                  <select
                    name="urgency"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    onChange={handleInputChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Approver's Email
                  </label>
                  <select
                    name="approverEmail"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Approver's Email</option>
                    <option value={process.env.REACT_APP_ADMIN_MAIL}>
                      {process.env.REACT_APP_ADMIN_MAIL}
                    </option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Request
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

const Dashboard = () => {
  const [isManager, setIsManager] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    type: "Leave",
    urgency: "Medium",
    requesterEmail: "",
    approverEmail: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (token) localStorage.setItem("token", token);
    if (email) {
      localStorage.setItem("userEmail", email);
      setUserEmail(email);
      setNewRequest((prev) => ({ ...prev, requesterEmail: email }));

      // Fetch user role
      axios
        .get(`${process.env.REACT_APP_AUTH_SERVICE_URL}/user/${email}`)
        .then((response) => {
          const user = response.data;
          setIsManager(user.isManager);
          const role = user.isManager ? "approver" : "requester";

          // Fetch requests for the user based on their role
          axios
            .get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}/request/fetch`, {
              params: { email, role },
            })
            .then((response) => setRequests(response.data))
            .catch((error) => console.error("Error fetching requests:", error));
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateRequest = async () => {
    try {
      console.log("Service URL:", process.env.REACT_APP_REQUEST_SERVICE_URL);
      console.log("Request Data:", newRequest);
      const response = await axios.post(
        `${process.env.REACT_APP_REQUEST_SERVICE_URL}/request/create`,
        newRequest
      );
      // alert("Request created successfully!");
      setShowModal(false);
      setRequests((prev) => [...prev, response.data.request]);
    } catch (error) {
      console.error(
        "Error creating request:",
        error.response?.data || error.message
      );
      alert(
        "Error creating request: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleLogout = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        console.error("No user email found in localStorage");
        window.location.href = "/";
        return;
      }

      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_AUTH_SERVICE_URL}/auth/logout`,
        data: { email },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.message === "Logged out successfully") {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        window.location.href = "/";
      } else {
        throw new Error("Logout was not successful");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // clearing local storage and redirecting even if there's an error
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {!isManager ? "My Dashboard" : "Approver Dashboard"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isManager ? (
          <ApproverDashboard />
        ) : (
          <RequesterDashboard
            requests={requests}
            showModal={showModal}
            setShowModal={setShowModal}
            newRequest={newRequest}
            handleInputChange={handleInputChange}
            handleCreateRequest={handleCreateRequest}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
