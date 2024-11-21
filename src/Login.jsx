import React, { useState } from "react";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { firebaseConfig } from './firebase';
import { useNavigate } from "react-router-dom";
import './main.css';
import { useMobile } from "./MobileStorage";

function Login() {
    const { setMobileNumber } = useMobile();
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumberState] = useState("");
    const [password, setPassword] = useState("");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const handleLogin = async () => {
        if (!mobileNumber || mobileNumber.length < 10 || !password) {
            alert("Please enter a valid mobile number and password.");
            return;
        }

        try {
            const docRef = doc(db, "users", mobileNumber);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (userData.password === password) {
                    setMobileNumber(mobileNumber);
                    navigate('/realSolution/Home');
                } else {
                    alert("Incorrect password. Please try again.");
                }
            } else {
                alert("This mobile number is not registered. Please sign up.");
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            alert("Failed to log in. Please try again.");
        }
    };

    const goToSignUp = () => {
        navigate("/realSolution/App");
    };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ fontSize: 24, marginBottom: 15, color: 'black' }}>Login</h1>
            <div style={{ width: "90%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                    type="number"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumberState(e.target.value)}
                    style={{ padding: 10, fontSize: 16, border: "1px solid #555", borderRadius: 7, outlineStyle: 'none', borderWidth: 5, borderColor: 'black' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: 10, fontSize: 16, border: "1px solid #555", borderRadius: 7, outlineStyle: 'none', borderWidth: 5, borderColor: 'black' }}
                />
                <button
                    onClick={handleLogin}
                    style={{ padding: 12, fontSize: 16, borderRadius: 5, border: "none", backgroundColor: "black", color: "#ffffff", cursor: "pointer" }}
                >
                    {"Login"}
                </button>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <a style={{ textDecoration: 'none', color: 'red', fontSize: 15 }} onClick={() => { navigate('/realSolution/ForgotPassword') }}>Forgot Password</a>
                    <a onClick={goToSignUp} style={{ textDecoration: 'none', color: 'black', fontSize: 15 }}>Don't have an account?</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
