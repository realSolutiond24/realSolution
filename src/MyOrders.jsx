import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import { useMobile } from './MobileStorage';
import './main.css';
import BottomNavBar from './BottomNavBar';

const MyOrders = () => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const { mobileNumber } = useMobile();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders from Firestore
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userDocRef = doc(db, 'users', mobileNumber);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setOrders(userDoc.data().orders || []);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [mobileNumber]);

    return (
        <div>
            <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif' }}>
                <h1 style={{ marginTop: '0px', marginBottom: 5 }}>My Orders</h1>
                {loading ? (
                    <div style={{ textAlign: 'center' }}>Loading...</div>
                ) : orders.length > 0 ? (
                    orders.map((order, index) => (
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
                            <h3 style={{ fontSize: '18px', marginBottom: '10px', marginTop: '5px' }}>Order #{index + 1}</h3>
                            <div style={{ marginBottom: '10px' }}>
                                <p style={{ margin: '0', fontSize: '16px' }}>Date: {new Date(order.orderDate).toLocaleString()}</p>
                            </div>

                            <div style={{ marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '5px' }}>
                                <h4 style={{ fontSize: '16px', marginBottom: '5px', marginTop: '0px' }}>Items:</h4>
                                {order.items.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '5px',
                                        }}
                                    >
                                        <span style={{ fontSize: '14px' }}>{item.name} (x{item.quantity})</span>
                                        <span style={{ fontSize: '14px' }}>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}

                                {/* Total calculation */}
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
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', fontSize: '16px', color: '#555' }}>You have no orders yet.</div>
                )}

            </div>
            <BottomNavBar></BottomNavBar>
        </div>
    );
};

export default MyOrders;
