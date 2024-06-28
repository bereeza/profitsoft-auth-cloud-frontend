import React from 'react';
import Button from "../../../components/Button";

function Login({ onSignIn }) {
    const handleSignIn = () => {
        onSignIn();
    };

    return (
        <div>
            <p>Sign in to continue.</p>
            <Button onClick={handleSignIn}>Sign In</Button>
        </div>
    );
}

export default Login;
