import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import { useMobile } from './MobileStorage';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';
// Initialize Firebase
const Cart = () => {
    const navigate = useNavigate();
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const { mobileNumber } = useMobile();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    // Fetch cart items
    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            try {
                const userDocRef = doc(db, 'users', mobileNumber);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const items = userDoc.data().cartItems || [];
                    setCartItems(items);
                    calculateTotal(items);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [mobileNumber]);

    // Calculate total price
    const calculateTotal = (items) => {
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(totalAmount);
    };

    // Update cart in Firestore
    const updateCartInDatabase = async (updatedCart) => {
        try {
            const userDocRef = doc(db, 'users', mobileNumber);
            await updateDoc(userDocRef, { cartItems: updatedCart });
        } catch (error) {
            console.error('Error updating cart in Firestore:', error);
        }
    };

    // Update quantity
    const updateQuantity = (itemId, change) => {
        const updatedCart = cartItems
            .map((item) => {
                if (item.id === itemId) {
                    const newQuantity = (item.quantity || 0) + change;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            })
            .filter(Boolean);
        setCartItems(updatedCart);
        updateCartInDatabase(updatedCart);
        calculateTotal(updatedCart);
    };

    // Remove item
    const removeItem = (itemId) => {
        const updatedCart = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCart);
        updateCartInDatabase(updatedCart);
        calculateTotal(updatedCart);
    };

    // Confirm order
    const confirmOrder = async () => {
        try {
            const userDocRef = doc(db, 'users', mobileNumber);
            const orderDetails = {
                items: cartItems,
                total,
                orderDate: new Date().toISOString(),
            };
            // Add order to orders collection
            await updateDoc(userDocRef, {
                orders: arrayUnion(orderDetails),
                cartItems: [],
            });
            setCartItems([]);
            setTotal(0);
            alert('Order Confirmed!');
        } catch (error) {
            console.error('Error confirming order:', error);
            alert('Failed to confirm order. Try again.');
        }
    };

    return (
        <div>
            <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif' }}>
                <h1 style={{ margin: '5px' }}>My Cart</h1>
                {loading ? (
                    <div style={{ textAlign: 'center' }}>Loading...</div>
                ) : cartItems.length > 0 ? (
                    <>
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                    border: '1px solid #ddd',
                                    padding: '10px',
                                    borderRadius: '5px',
                                }}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    style={{
                                        height: '80px',
                                        width: '80px',
                                        marginRight: '10px',
                                        borderRadius: '5px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{item.name}</p>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>
                                        ₹{item.price * item.quantity}
                                    </p>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>{item.measurement}</p>

                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}
                                >
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        style={{
                                            padding: '5px',
                                            border: 'none',
                                            background: '#ff6347',
                                            color: 'white',
                                            cursor: 'pointer',
                                            borderRadius: '5px',
                                            width: '30px',
                                            height: '30px',
                                        }}
                                    >
                                        -
                                    </button>
                                    <span style={{ fontSize: '16px' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        style={{
                                            padding: '5px',
                                            border: 'none',
                                            background: '#ff6347',
                                            color: 'white',
                                            cursor: 'pointer',
                                            borderRadius: '5px',
                                            width: '30px',
                                            height: '30px',
                                        }}
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        style={{
                                            padding: '5px 10px',
                                            border: '1px solid #f00',
                                            background: '#fdd',
                                            color: '#f00',
                                            cursor: 'pointer',
                                            borderRadius: '5px',
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                            Total: ₹{total}
                        </div>
                        <button
                            onClick={confirmOrder}
                            style={{
                                marginTop: '20px',
                                padding: '10px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                        >
                            Confirm Order
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', fontSize: '16px', color: '#555' }}>Your cart is empty.</div>
                )}

            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 65 }} >
                <div onClick={() => navigate('/realSolution/Home')} style={{ width: '80%', height: 40, backgroundColor: '#ff6347', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} >Continue Purchasing</div>
            </div>
            <BottomNavBar></BottomNavBar>
        </div>
    );
};

export default Cart;
