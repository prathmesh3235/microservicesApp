import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [role, setRole] = useState('requester'); // Mock role for now
    const [requests, setRequests] = useState([]);
    const [newRequest, setNewRequest] = useState({
        title: '',
        description: '',
        type: 'Leave',
        urgency: 'Medium',
        requesterEmail: '',
        approverEmail: ''
    });

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
        setNewRequest(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateRequest = () => {
        axios.post(`${process.env.REACT_APP_REQUEST_SERVICE_URL}/create`, newRequest)
            .then(response => alert('Request created successfully!'))
            .catch(error => console.error('Error creating request:', error));
    };

    const handleApproveRequest = (id) => {
        axios.put(`${process.env.REACT_APP_REQUEST_SERVICE_URL}/approve/${id}`)
            .then(response => alert('Request approved successfully!'))
            .catch(error => console.error('Error approving request:', error));
    };

    const handleLogout = () => {
        // Clear the token from localStorage or sessionStorage
        localStorage.removeItem('token'); // or sessionStorage.removeItem('token')
    
        // Redirect to the frontend login page
        window.location.href = `${window.location.origin}/`; // This will redirect to localhost:3000 by default
    };
    
    

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
            {role === 'requester' ? (
                <div>
                    <h2>Create New Request</h2>
                    <form onSubmit={e => { e.preventDefault(); handleCreateRequest(); }}>
                        <input name="title" placeholder="Title" onChange={handleInputChange} required />
                        <input name="description" placeholder="Description" onChange={handleInputChange} required />
                        <input name="requesterEmail" placeholder="Your Email" onChange={handleInputChange} required />
                        <input name="approverEmail" placeholder="Approver's Email" onChange={handleInputChange} required />
                        <button type="submit">Submit Request</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Pending Requests for Approval</h2>
                    <ul>
                        {requests.map(request => (
                            <li key={request._id}>
                                {request.title} - {request.description}
                                <button onClick={() => handleApproveRequest(request._id)}>Approve</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
