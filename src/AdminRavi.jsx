import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import './main.css';
import { useMobile } from './MobileStorage';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from './BottomNavBar'

const AdminRavi = () => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [mobileNumber, setMobileNumber1] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setMobileNumber } = useMobile();
    const navigate = useNavigate()

    // Fetch orders from Firestore
    const fetchOrders = async () => {
        try {
            const userDocRef = doc(db, 'users', mobileNumber);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setOrders(userDoc.data().orders.slice().reverse() || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate the commission for an item based on the commission percentage
    const calculateItemCommission = (price, quantity, commissionPercentage) => {
        return (price * quantity * commissionPercentage) / 100;
    };

    // Calculate total commission for an order
    const calculateTotalCommission = (items) => {
        return items.reduce((total, item) => {
            const itemCommission = calculateItemCommission(item.price, item.quantity, item.commission || 0);
            return total + itemCommission;
        }, 0);
    };

    // Approve order and add commission to wallet
    // Approve order and add commission to wallet
    const approveOrder = async (index) => {
        try {
            const order = orders[index];
            const totalCommission = calculateTotalCommission(order.items);
            const totalAmount = order.total; // Order total (before commission)
            // const commissionDeducted = totalAmount - totalCommission; // Deduct commission from total 

            const userDocRef = doc(db, 'users', mobileNumber);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Ensure walletAmount is not undefined
                const updatedWalletAmount = (userData.walletAmount || 0) + totalCommission;

                // Get the current date and time
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleString(); // Or you can use a custom format

                // Get previous wallet amount
                const previousAmount = userData.walletAmount || 0;

                // Create wallet history entry
                const walletHistoryEntry = {
                    dateTime: formattedDate,
                    previousAmount,
                    orderId: `Order #${index + 1}`,
                    addedAmount: totalCommission || 0,
                    type: 'Addition',
                };

                // Update the user document
                await updateDoc(userDocRef, {
                    walletAmount: updatedWalletAmount,
                    walletHistory: [...(userData.walletHistory || []), walletHistoryEntry], // Add new history entry
                    orders: orders.map((order, i) =>
                        i === index ? { ...order, status: 'Approved', total: totalAmount } : order
                    ),
                });

                setOrders((prevOrders) =>
                    prevOrders.map((order, i) =>
                        i === index ? { ...order, status: 'Approved', total: totalAmount } : order
                    )
                );

                alert(`Order #${index + 1} approved. Commission of ₹${totalCommission.toFixed(2)} added to wallet.`);
            }
        } catch (error) {
            console.error('Error approving order:', error);
        }
    };


    // Reject order
    const rejectOrder = async (index) => {
        try {
            const updatedOrders = [...orders];
            updatedOrders[index].status = 'Rejected';

            const userDocRef = doc(db, 'users', mobileNumber);
            await updateDoc(userDocRef, { orders: updatedOrders });

            setOrders(updatedOrders);
            alert(`Order #${index + 1} rejected.`);
        } catch (error) {
            console.error('Error rejecting order:', error);
        }
    };

    const goInside = async () => {
        if (!mobileNumber || mobileNumber.trim() === "") {
            alert("Please enter a valid mobile number.");
            return;
        }

        try {
            // Ensure a valid document path: 'users/<mobileNumber>'
            const userDocRef = doc(db, 'users', mobileNumber.trim());
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setMobileNumber(mobileNumber);
                navigate('/realSolution/Home');
            } else {
                console.log("User not found");
                alert("User not found. Try again.");
            }
        } catch (error) {
            console.error("Error checking user existence:", error);
            alert("An error occurred while verifying the user. Please try again.");
        }
    };


    return (
        <div>
            <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px', gap: 5, flexDirection: 'column', width: '100%' }} >
                    <input
                        type="number"
                        placeholder="Enter Number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber1(e.target.value)}
                        style={{ padding: 10, fontSize: 14, borderRadius: 7, outlineStyle: 'none', borderStyle: 'solid', borderWidth: 3, borderColor: 'black', width: '80%' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '90%' }} >
                        <button
                            onClick={fetchOrders}
                            style={{ padding: 12, fontSize: 16, borderRadius: 5, border: "none", backgroundColor: "black", color: "#ffffff", cursor: "pointer", width: '40%' }}
                        >Fetch Orders</button>
                        <button
                            onClick={goInside}
                            style={{ padding: 12, fontSize: 16, borderRadius: 5, border: "none", backgroundColor: "black", color: "#ffffff", cursor: "pointer", width: '40%' }}
                        >Go Inside</button>
                    </div>
                </div>
                {loading ? (
                    <div style={{ textAlign: 'center' }}></div>
                ) : orders.length > 0 ? (
                    <div
                        style={{
                            maxHeight: '75vh',
                            overflowY: 'auto',
                            paddingRight: '5px',
                        }}
                    >
                        {orders.map((order, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '5px',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <h3 style={{ fontSize: '18px', marginBottom: '10px', marginTop: '5px', color: order.status === 'Approved' ? 'green' : order.status === 'Rejected' ? 'red' : '#BA8E23' }}>
                                    Order #{index + 1} - {order.status || 'Pending'}
                                </h3>
                                <div style={{ marginBottom: '10px' }}>
                                    <p style={{ margin: '0', fontSize: '16px' }}>
                                        Date: {new Date(order.orderDate).toLocaleString()}
                                    </p>
                                </div>

                                <div
                                    style={{
                                        marginTop: '10px',
                                        borderTop: '1px solid #ddd',
                                        paddingTop: '5px',
                                    }}
                                >
                                    <h4 style={{ fontSize: '16px', marginBottom: '5px', marginTop: '0px' }}>
                                        Items:
                                    </h4>
                                    {order.items.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '5px',
                                            }}
                                        >
                                            <span style={{ fontSize: '14px' }}>
                                                {item.name} (x {item.quantity})
                                            </span>
                                            <span style={{ fontSize: '14px' }}>
                                                Comm: ({item.commission || 0}%) ₹{calculateItemCommission(item.price, item.quantity, item.commission || 0).toFixed(2)}
                                            </span> <span style={{ fontSize: '14px' }}>
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}



                                    <div
                                        style={{
                                            marginTop: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        <span style={{ fontSize: '16px' }}>Total Commission:</span>
                                        <span style={{ fontSize: '16px', marginRight: 73 }}>
                                            ₹{calculateTotalCommission(order.items).toFixed(2)}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            marginTop: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        <span style={{ fontSize: '16px' }}>Total:</span>
                                        <span style={{ fontSize: '16px' }}>₹{order.total}</span>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: '10px',
                                    }}
                                >
                                    {order.status !== 'Approved' && order.status !== 'Rejected' && (
                                        <>
                                            <button
                                                style={{
                                                    padding: '5px 10px',
                                                    backgroundColor: 'green',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => approveOrder(index)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                style={{
                                                    padding: '5px 10px',
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => rejectOrder(index)}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '16px',
                            color: '#555',
                        }}
                    >
                        You have no orders yet.
                    </div>
                )}
            </div>
            {/* <BottomNavBar></BottomNavBar> */}
        </div>
    );
};

export default AdminRavi;
