import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, LogOut, Plus, Calendar, Box, Clock3 } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const Dashboard = () => {
    const [role] = useState('requester');
    const [userEmail, setUserEmail] = useState('');
    const [requests, setRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newRequest, setNewRequest] = useState({
        title: '',
        description: '',
        type: 'Leave',
        urgency: 'Medium',
        requesterEmail: '', // Initialize requesterEmail
        approverEmail: ''
    });

    // Fetch user email and token from URL on initial load and store it
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email');

        if (token) localStorage.setItem('token', token);
        if (email) {
            localStorage.setItem('userEmail', email);
            setUserEmail(email);
            setNewRequest(prev => ({ ...prev, requesterEmail: email }));
        } else {
            console.error('User email not found in URL parameters');
        }
    }, []);

    // Load pending requests for approvers
    useEffect(() => {
        if (role === 'approver') {
            axios.get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}/pending`)
                .then(response => setRequests(response.data))
                .catch(error => console.error('Error fetching requests:', error));
        }
    }, [role]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRequest(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateRequest = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_SERVICE_URL}/create`, newRequest);
            alert('Request created successfully!');
            setShowModal(false);
            setRequests(prev => [...prev, response.data.request]);
        } catch (error) {
            console.error('Error creating request:', error.response?.data || error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail'); // Clear stored email on logout
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {role === 'requester' ? 'My Dashboard' : 'Approver Dashboard'}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-full hover:bg-gray-100">
                                <Bell className="w-6 h-6 text-gray-600" />
                            </button>
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
                {role === 'requester' ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium text-gray-900">My Requests</h2>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-5 h-5" />
                                <span>New Request</span>
                            </button>
                        </div>

                        <Dialog open={showModal} onClose={() => setShowModal(false)}>
                            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                            <div className="fixed inset-0 flex items-center justify-center p-4">
                                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                    <h2 className="text-lg font-medium mb-4">Create New Request</h2>
                                    <form onSubmit={(e) => { e.preventDefault(); handleCreateRequest(); }}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea
                                                    name="description"
                                                    rows="3"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Type</label>
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
                                                <label className="block text-sm font-medium text-gray-700">Urgency</label>
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
                                                <label className="block text-sm font-medium text-gray-700">Approver's Email</label>
                                                <input
                                                    type="email"
                                                    name="approverEmail"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                                    onChange={handleInputChange}
                                                    required
                                                />
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
                                </div>
                            </div>
                        </Dialog>
                    </>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Approver's list rendering */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
