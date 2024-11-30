import React, { useEffect, useState } from "react";
import BottomNavBar from "./BottomNavBar";
import WalletImage1 from '../public/walletImage1.png';
import { useMobile } from "./MobileStorage";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";  // Make sure to import your firebase configuration
import WalletImage from '../public/walletImage.png'
function Wallet() {
    const { mobileNumber } = useMobile(); // Get the mobile number from context
    const [walletAmount, setWalletAmount] = useState(0); // State to store wallet amount
    const [walletHistory, setWalletHistory] = useState([]); // State to store wallet history
    const [loading, setLoading] = useState(true); // State to show loading status

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, "users", mobileNumber); // Reference to the user document
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setWalletAmount(userData.walletAmount || 0); // Set wallet amount
                    setWalletHistory(userData.walletHistory || []); // Set wallet history
                } else {
                    console.log("No such user!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        if (mobileNumber) {
            fetchUserData(); // Fetch data if mobileNumber exists
        }
    }, [mobileNumber]); // Depend on mobileNumber

    // Display loading spinner if data is still being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div style={{ padding: 10 }} >
                <div style={{ display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center' }} >
                    <img style={{ height: 40, width: 40 }} src={WalletImage} alt="" />
                    <p style={{ fontSize: 20, margin: 0 }} >Wallet</p>
                    <p style={{ fontSize: 20, margin: 0, position: 'absolute', top: 20, right: 20 }} >₹ {walletAmount.toFixed(2)}</p>
                </div>
                <div>

                    <h4 style={{ margin: 5 }} >History:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: 10, maxHeight: 500, overflowX: 'scroll' }} >
                        {walletHistory.length > 0 ? (
                            walletHistory.slice().reverse().map((entry, index) => (
                                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', borderRadius: 7, boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)' }} key={index}>
                                    <strong>Date: {entry.dateTime}</strong>
                                    <span>Order Id: {entry.orderId || 'none'}</span>
                                    <span>Previous Amount: {entry.previousAmount.toFixed(2)}</span>
                                    {entry.type === "Addition"
                                        ? <span style={{ color: 'green' }} ><strong>Added -</strong> ₹ {entry.addedAmount.toFixed(2)}</span>
                                        : <span style={{ color: 'red' }} ><strong>Deducted -</strong> ₹ {entry.deductedAmount.toFixed(2)}</span>
                                    }

                                </div>
                            ))
                        ) : (
                            <p>No wallet history available.</p>
                        )}
                    </div>
                </div>
            </div>
            <BottomNavBar WalletImage1={WalletImage1} />
        </div>
    );
}

export default Wallet;
