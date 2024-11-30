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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', width: "80%", maxWidth: 400 }}>
                <h1 style={{ fontSize: 20, marginBottom: 10, color: 'black', fontWeight: 'normal' }}>Login</h1>
            </div>
            <div style={{ width: "80%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                    type="number"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onInput={(e) => {
                        if (e.target.value.length > 10) {
                            e.target.value = e.target.value.slice(0, 10);
                        }
                        setMobileNumberState(e.target.value)
                    }}
                    style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }}
                />
                <button
                    onClick={handleLogin}
                    style={{ padding: 12, fontSize: 16, borderRadius: 5, border: "none", backgroundColor: "black", color: "#ffffff", cursor: "pointer" }}
                >
                    {"Login"}
                </button>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <a style={{ textDecoration: 'none', color: 'blue', fontSize: 16 }} onClick={() => { navigate('/realSolution/ForgotPassword') }}>Forgot Password</a>
                    <a onClick={goToSignUp} style={{ textDecoration: 'none', color: 'black', fontSize: 20 }}>Sign Up</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
