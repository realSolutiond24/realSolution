import React, { useState } from "react";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { firebaseConfig } from './firebase';  // Import firebase config
import { useNavigate } from "react-router-dom";
import './main.css';

function ForgotPassword() {
    const navigate = useNavigate();
    const [mobileNumber, setMobile] = useState("");  // Mobile number for OTP
    const [otp, setOtp] = useState("");  // OTP for verification
    const [newPassword, setNewPassword] = useState("");  // New password
    const [confirmationResult, setConfirmationResult] = useState(null);  // Confirmation result after OTP
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);  // Initialize Firestore

    // Function to setup reCAPTCHA for phone number verification
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: (response) => {
                        console.log("Recaptcha solved.");
                    },
                },
                auth
            );
            window.recaptchaVerifier.render();
        }
    };

    // Function to handle reset request and send OTP
    const handleResetRequest = async () => {
        if (!mobileNumber || mobileNumber.length < 10) {
            alert("Please enter a valid mobile number.");
            return;
        }

        // Check if the mobile number exists in Firestore
        const userRef = doc(db, "users", mobileNumber);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            alert("This mobile number is not registered.");
            return;
        }

        // Set up reCAPTCHA and send OTP
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        try {
            const confirmation = await signInWithPhoneNumber(auth, `+91${mobileNumber}`, appVerifier);
            setConfirmationResult(confirmation);  // Store confirmation result
        } catch (error) {
            console.error("Error sending OTP: ", error.message);
            alert("Failed to send OTP. Please try again.");
        }
    };

    // Function to verify OTP and reset password
    const verifyOtpAndResetPassword = async () => {
        if (!otp || otp.length < 6) {
            alert("Please enter the correct OTP.");
            return;
        }
        if (!newPassword) {
            alert("Please enter a new password.");
            return;
        }

        try {
            // Confirm OTP
            const result = await confirmationResult.confirm(otp);

            // Update the user's password in Firestore
            const userRef = doc(db, "users", mobileNumber);
            await updateDoc(userRef, { password: newPassword });

            alert("Password has been reset successfully!");
            navigate('/realSolution/Login');  // Redirect to login page after successful password reset
        } catch (error) {
            console.error("Error verifying OTP: ", error.message);
            alert("Invalid OTP. Please try again.");
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1 style={{ fontSize: 20, marginBottom: 15, color: 'black', fontWeight: 'normal', width: '80%', maxWidth: 400 }}>Reset Password</h1>
            <div style={{ width: "90%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                    type="number"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onInput={(e) => {
                        if (e.target.value.length > 10) {
                            e.target.value = e.target.value.slice(0, 10);
                        }
                        setMobile(e.target.value);
                    }}
                    style={{
                        padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black',
                    }}
                />
                {confirmationResult && (
                    <input
                        type="number"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{
                            padding: 10,
                            fontSize: 16,
                            border: "1px solid #555",
                            borderRadius: 7,
                            outlineStyle: 'none',
                            borderWidth: 5,
                            borderColor: 'black',
                        }}
                    />
                )}
                {confirmationResult && (
                    <input
                        type="password"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{
                            padding: 10,
                            fontSize: 16,
                            border: "1px solid #555",
                            borderRadius: 7,
                            outlineStyle: 'none',
                            borderWidth: 5,
                            borderColor: 'black',
                        }}
                    />
                )}
                <button
                    onClick={confirmationResult ? verifyOtpAndResetPassword : handleResetRequest}
                    style={{
                        padding: 12,
                        fontSize: 16,
                        borderRadius: 5,
                        border: "none",
                        backgroundColor: "black",
                        color: "#ffffff",
                        cursor: "pointer",
                    }}
                >
                    {confirmationResult ? "Verify OTP and Reset Password" : "Send OTP"}
                </button>
            </div>
            <div id="recaptcha-container" style={{ marginTop: 10 }}></div>
        </div>
    );
}

export default ForgotPassword;
