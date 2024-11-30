import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; // Import your Firebase config
import BottomNavBar from "./BottomNavBar";
import settingsImage from '../public/settingsImage.png';
import { useMobile } from "./MobileStorage";

function Settings() {
    const { mobileNumber } = useMobile();
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFields, setEditFields] = useState({
        name: "",
        instagramId: "",
        facebookId: "",
        emailId: '',
        password: '',
        address: '',
        pincode: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, "users", mobileNumber);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUserData();
    }, [mobileNumber]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);

        if (userData) {
            setEditFields({
                name: userData.name || "",
                instagramId: userData.instagramId || "",
                facebookId: userData.facebookId || "",
                emailId: userData.emailId || "",
                password: userData.password || '',
                address: userData.address || '',
                pincode: userData.pincode || ''
            });
        }
    };

    const handleFieldChange = (field, value) => {
        setEditFields((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const saveChanges = async () => {
        try {
            const docRef = doc(db, "users", mobileNumber);
            await updateDoc(docRef, editFields);
            setUserData((prev) => ({ ...prev, ...editFields }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user data: ", error);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>

                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <img style={{ height: 30, width: 30 }} src={settingsImage} alt="Settings Icon" />
                    <p style={{ fontSize: 20, margin: 0 }}>Settings</p>
                </div>

                <div style={{ borderWidth: 0.5, borderStyle: 'solid', borderColor: 'grey', width: '100%', marginTop: 5 }}></div>

                <div style={{ marginTop: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>

                    <span style={{ fontSize: 16 }}>Mobile Number: {userData.mobileNumber}</span>

                    <span style={{ fontSize: 16 }} >Name: {isEditing ? (
                        <input
                            type="text"
                            value={editFields.name}
                            onChange={(e) => handleFieldChange("name", e.target.value)}
                        />
                    ) : userData.name}</span>

                    <span style={{ fontSize: 16 }} >Password: {isEditing ? (
                        <input
                            type="text"
                            value={editFields.password}
                            onChange={(e) => handleFieldChange("password", e.target.value)}
                        />
                    ) : userData.password}</span>

                    <span style={{ fontSize: 16 }} >Address: {isEditing ? (
                        <input
                            type="text"
                            value={editFields.address}
                            onChange={(e) => handleFieldChange("address", e.target.value)}
                        />
                    ) : userData.address}</span>

                    <span style={{ fontSize: 16 }} >Pincode: {isEditing ? (
                        <input
                            type="text"
                            value={editFields.pincode}
                            onChange={(e) => handleFieldChange("pincode", e.target.value)}
                        />
                    ) : userData.pincode}</span>

                    <span style={{ fontSize: 16 }} >Gmail Id: {isEditing ? (
                        <input
                            type="text"
                            value={editFields.emailId}
                            onChange={(e) => handleFieldChange("emailId", e.target.value)}
                        />
                    ) : userData.emailId}</span>

                    <span style={{ fontSize: 16 }}>Instagram ID: {isEditing ? (
                        <input
                            type="text"
                            value={editFields.instagramId}
                            onChange={(e) => handleFieldChange("instagramId", e.target.value)}
                        />
                    ) : userData.instagramId}</span>

                    <span style={{ fontSize: 16 }}>Facebook ID: {isEditing ? (
                        <input
                            type="text"
                            value={editFields.facebookId}
                            onChange={(e) => handleFieldChange("facebookId", e.target.value)}
                        />
                    ) : userData.facebookId}</span>

                </div>

                <button
                    style={{ width: isEditing ? '40%' : '20%', height: 35, alignSelf: 'center', backgroundColor: 'black', color: 'white', borderRadius: 5, fontSize: 16, border: 'none', position: 'absolute', top: 7, right: 5, boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)' }}
                    onClick={isEditing ? saveChanges : handleEditToggle}>
                    {isEditing ? "Save Changes" : "Edit"}
                </button>
                {
                    isEditing &&
                    <button
                        style={{ width: '90%', height: 40, alignSelf: 'center', backgroundColor: 'black', color: 'white', borderRadius: 5, fontSize: 16, border: 'none', boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)' }}
                        onClick={() => setIsEditing(false)}>
                        Cancel
                    </button>
                }

                <div style={{ borderWidth: 0.5, borderStyle: 'solid', borderColor: 'grey', width: '100%', marginTop: 5 }}></div>

                <span style={{ margin: 0, fontSize: 20 }} >Contact Us: --</span>

                <div style={{ display: 'flex', flexDirection: 'row', gap: 5, marginTop: 10, fontSize: 16 }} >
                    <p style={{ margin: 0 }} >Contact: --</p>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}  >
                        <p style={{ margin: 0 }} >9352000360</p>
                        <a style={{ textDecoration: 'none', margin: 0 }} href="tel:9352000360">Call Now <a style={{ textDecoration: 'none', fontSize: 12, margin: 0 }} href=""> &nbsp; &#128222;</a></a>
                    </div>

                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 5, marginTop: 10 }} >
                    <p style={{ margin: 0 }} >Support: --</p>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}  >
                        <p style={{ margin: 0 }} >realsolutiond24@gmail.com</p>
                        <a style={{ fontSize: 14, textDecoration: 'none' }} href="mailto:realsolutiond24@gmail.com">Mail Now</a>
                    </div>

                </div>


            </div>

            <BottomNavBar />
        </div >
    );
}

export default Settings;
