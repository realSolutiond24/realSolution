import React, { useState } from "react";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { firebaseConfig } from './firebase';
import { useNavigate } from "react-router-dom";
import './main.css';
import { useMobile } from "./MobileStorage";  // Import the mobile context

function App() {
  const { setMobileNumber } = useMobile();  // To update mobile number in context
  const navigate = useNavigate();
  const [mobileNumber, setMobile] = useState("");  // Store mobile number
  const [otp, setOtp] = useState("");  // Store OTP
  const [confirmationResult, setConfirmationResult] = useState(null);  // Store confirmation result from OTP
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);  // Initialize Firestore
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [emailId, setEmailId] = useState('')
  const [password, setPassword] = useState('')
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

  // Handle user signup (send OTP)
  const handleSignup = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, `+91${mobileNumber}`, appVerifier);
      setConfirmationResult(confirmation);  // Store the confirmation result
    } catch (error) {
      console.error("Error sending OTP: ", error.message);
      alert("Failed to send OTP. Please try again.");
    }
  };

  // Verify OTP and save data to Firestore after OTP confirmation
  const verifyOtp = async () => {
    if (!otp || otp.length < 6) {
      alert("Please enter the correct OTP.");
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      // Set mobile number in the app context after successful OTP confirmation
      setMobileNumber(mobileNumber);
      // Save user data to Firestore in the "users" collection
      const userRef = doc(db, "users", mobileNumber);  // Use mobile number as the document ID
      await setDoc(userRef, {
        mobileNumber: mobileNumber,
        name: name,
        address: address,
        emailId: emailId,
        password: password,
      });

      navigate('/realSolution/Home');  // Redirect to Home page after successful signup
      console.log("User data:", result.user);
    } catch (error) {
      console.error("Error verifying OTP: ", error.message);
      alert("Invalid OTP. Please try again.");
    }
  };

  const goToLogin = () => {
    navigate("/realSolution/Login");
  };

  return (
    <div
      style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "Arial, sans-serif", }}>
      <h1 style={{ fontSize: 24, marginBottom: 15, color: 'black' }}>Sign Up</h1>
      <div style={{ width: "90%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10, }}>

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobile(e.target.value)}  // Update mobile number
          style={{ padding: 10, fontSize: 16, border: "1px solid #555", borderRadius: 7, outlineStyle: 'none', borderWidth: 5, borderColor: 'black' }} />
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => { }}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 16, border: "1px solid #555", borderRadius: 7, outlineStyle: 'none', borderWidth: 5, borderColor: 'black' }} />
        <input
          type="password"
          placeholder="Enter Your New Password"
          onChange={(e) => { }}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 16, border: "1px solid #555", borderRadius: 7, outlineStyle: 'none', borderWidth: 5, borderColor: 'black' }} />
        <input
          type="text"
          placeholder="Address"
          onChange={(e) => { }}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 16, border: "1px solid #555", borderRadius: 7, outlineStyle: 'none', borderWidth: 5, borderColor: 'black' }} />
        <input
          type='email'
          placeholder="Email Id"
          onChange={(e) => { }}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 16, border: "1px solid #555", borderRadius: 7, outlineStyle: 'none', borderWidth: 5, borderColor: 'black' }} />

        {confirmationResult && (
          <input
            type="number"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ padding: 10, fontSize: 16, border: "1px solid #555", borderRadius: 7, outlineStyle: 'none', borderWidth: 5, borderColor: 'black' }} />
        )}
        <button
          onClick={confirmationResult ? verifyOtp : handleSignup}
          style={{ padding: 12, fontSize: 16, borderRadius: 5, border: "none", backgroundColor: "black", color: "#ffffff", cursor: "pointer", }}>
          {confirmationResult ? "Verify OTP" : "Sign Up / Send OTP"}
        </button>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }} >
          <a onClick={goToLogin} style={{ textDecoration: 'none', color: 'black', fontSize: 15 }} >Already have an account?</a>
        </div>
      </div>
      <div id="recaptcha-container" style={{ marginTop: 10 }}></div>
    </div>
  );
}

export default App;
