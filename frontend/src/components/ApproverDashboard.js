import React, { useState, useEffect } from 'react';
import { Bell, LogOut, CheckCircle, XCircle, Clock, AlertCircle, Search } from 'lucide-react';
import axios from 'axios';

const Navbar = ({ notificationCount = 0, onLogout }) => (
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <h1 className="text-xl font-semibold text-gray-900">Approver Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const RequestCard = ({ request, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const handleAction = async (action) => {
    try {
        console.log("Sending request ID:", request._id);
        await axios.put(`${process.env.REACT_APP_REQUEST_SERVICE_URL}/api/requests/update-status/${request._id}`, { status: action });
        onStatusChange(request._id, action);
    } catch (error) {
        console.error('Error updating request:', error);
    }
};


  const statusColorClass = getStatusColor(request.status);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
          <p className="text-sm text-gray-500 mt-1">From: {request.requesterEmail}</p>
        </div>
        <div className={`px-3 py-1 rounded-full flex items-center space-x-1 ${statusColorClass}`}>
          {getStatusIcon(request.status)}
          <span className="text-sm font-medium capitalize">{request.status}</span>
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
            <div className={`w-2 h-2 rounded-full ${
              request.urgency === 'High' ? 'bg-red-500' : 
              request.urgency === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            <span>{request.urgency} Priority</span>
          </div>
        </div>
        
        {request.status === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleAction('rejected')}
              className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-md hover:bg-red-50 flex items-center space-x-2 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => handleAction('approved')}
              className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-50 flex items-center space-x-2 transition-colors"
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

const FilterBar = ({ searchQuery, onSearchChange, filter, onFilterChange }) => (
  <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
    <div className="flex items-center space-x-4 w-full sm:w-auto">
      <div className="relative flex-1 sm:flex-none">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search requests..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="all">All Requests</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  </div>
);

const EmptyState = ({ searchQuery }) => (
  <div className="text-center py-12">
    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
    <p className="mt-1 text-sm text-gray-500">
      {searchQuery ? 'Try adjusting your search terms' : 'You have no pending requests to review'}
    </p>
  </div>
);

export default function ApproverDashboard() {
  const [requests, setRequests] = useState([
    {
      _id: '5f50c31f5e3c6e79b19c1e96', // Replace with a valid ObjectId
      title: 'Leave Request 1',
      description: 'This is to request for a leave on 12th Nov',
      requesterEmail: 'prathmesh.admg@gmail.com',
      status: 'pending',
      type: 'Leave',
      urgency: 'Medium'
    },
    {
      _id: '5f50c31f5e3c6e79b19c1e97', // Replace with another valid ObjectId
      title: 'Leave Request 2',
      description: 'This is to request leave on 14th',
      requesterEmail: 'prathmesh.admg@gmail.com',
      status: 'pending',
      type: 'Leave',
      urgency: 'High'
    }
  ]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(2);

  const handleStatusChange = (requestId, newStatus) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request._id === requestId ? { ...request, status: newStatus } : request
      )
    );
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requesterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar notificationCount={notificationCount} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map(request => (
            <RequestCard
              key={request._id}
              request={request}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <EmptyState searchQuery={searchQuery} />
        )}
      </main>
    </div>
  );
}
