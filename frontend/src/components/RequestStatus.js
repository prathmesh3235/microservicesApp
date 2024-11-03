import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestStatus = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}/status`)
            .then(response => setRequests(response.data))
            .catch(error => console.error('Error fetching request status:', error));
    }, []);

    return (
        <div>
            <h1>Request Status</h1>
            <ul>
                {requests.map(request => (
                    <li key={request._id}>
                        {request.title} - Status: {request.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RequestStatus;
