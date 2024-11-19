import React, { useState } from "react";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, PhoneAuthProvider, signInWithCredential } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { firebaseConfig } from './firebase'

function App() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
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

  const handleSignup = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        appVerifier
      );
      setConfirmationResult(confirmation);
      alert("OTP sent to your phone.");
    } catch (error) {
      console.error("Error sending OTP: ", error.message);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 6) {
      alert("Please enter the correct OTP.");
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      alert("Phone verified successfully!");
      console.log("User data:", result.user);
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
        backgroundColor: "#121212",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Phone Authentication</h1>
      <div
        style={{
          width: "90%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            padding: 10,
            fontSize: 16,
            border: "1px solid #555",
            borderRadius: 5,
            backgroundColor: "#1e1e1e",
            color: "#ffffff",
          }}
        />
        {confirmationResult && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{
              padding: 10,
              fontSize: 16,
              border: "1px solid #555",
              borderRadius: 5,
              backgroundColor: "#1e1e1e",
              color: "#ffffff",
            }}
          />
        )}
        <button
          onClick={confirmationResult ? verifyOtp : handleSignup}
          style={{
            padding: 12,
            fontSize: 16,
            borderRadius: 5,
            border: "none",
            backgroundColor: "#007BFF",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          {confirmationResult ? "Verify OTP" : "Send OTP"}
        </button>
      </div>
      <div id="recaptcha-container" style={{ marginTop: 10 }}></div>
    </div>
  );
}

export default App;
