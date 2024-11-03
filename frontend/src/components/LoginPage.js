import React from 'react';

const LoginPage = () => {
    const handleLogin = () => {
        window.location.href = `${process.env.REACT_APP_AUTH_SERVICE_URL}/google`;
    };
    

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login with Google</button>
        </div>
    );
};

export default LoginPage;
