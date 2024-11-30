import React, { useState, useEffect } from "react";
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
  const [pincode, setPincode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [instagramId, setInstagramId] = useState('')
  const [facebookId, setFacebookId] = useState('')
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

  useEffect(() => {
    if (name) {
      console.log("Name has been updated:", name);
    }
  }, [name]);

  useEffect(() => {
    if (password) {
      console.log("Password has been updated:", password);
    }
  }, [password]);

  // Handle user signup (send OTP)
  const handleSignup = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!name || !address || !pincode || !password) {
      alert("Please fill in all fields.");
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
        pincode: pincode,
        password: password,
        facebookId: facebookId,
        instagramId: instagramId,
        referralCode: referralCode
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
      <div style={{ width: '80%', maxWidth: 400, display: 'flex', justifyContent: 'start' }} ><h1 style={{ fontSize: 20, marginBottom: 10, color: 'black', fontWeight: 'normal' }}>Sign Up</h1></div>
      <div style={{ width: "80%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 5, }}>

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
          style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }} />
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }} />
        <input
          type="password"
          placeholder="Create Password"
          onChange={(e) => setPassword(e.target.value)}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }} />
        <input
          type="text"
          placeholder="Re-Enter Password"
          onChange={(e) => setConfirmPassword(e.target.value)}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }} />

        <input
          type="text"
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }} />
        <input
          type='number'
          placeholder="Pincode"
          onInput={(e) => {
            // Restrict the input to a maximum of 10 digits
            if (e.target.value.length > 6) {
              e.target.value = e.target.value.slice(0, 6);
            }
            setPincode(e.target.value);
          }}
          style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }} />
        <input
          type="text"
          placeholder="Referral Code (Optional)"
          onChange={(e) => setReferralCode(e.target.value)}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }} />
        <input
          type="text"
          placeholder="Instagram Id (Optional)"
          onChange={(e) => setInstagramId(e.target.value)}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }} />
        <input
          type="text"
          placeholder="Facebook Id (Optional)"
          onChange={(e) => setFacebookId(e.target.value)}  // Add logic to handle other fields
          style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }} />

        {confirmationResult && (
          <input
            type="number"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', }} />
        )}
        <button
          onClick={confirmationResult ? verifyOtp : handleSignup}
          style={{ padding: 12, fontSize: 16, borderRadius: 5, border: "none", backgroundColor: "black", color: "#ffffff", cursor: "pointer", }}>
          {confirmationResult ? "Verify OTP" : "SIGN UP WITH OTP"}
        </button>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }} >
          <a onClick={goToLogin} style={{ textDecoration: 'none', color: 'black', fontSize: 20 }} >Login</a>
        </div>
      </div>
      <div id="recaptcha-container" style={{ marginTop: 10 }}></div>
    </div>
  );
}

export default App;
