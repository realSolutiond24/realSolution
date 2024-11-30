import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import { useMobile } from './MobileStorage';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';
import imageNotAvailable from '../public/imageNotAvailable.png'
import CartImage1 from '../public/cartImage1.png'
// Initialize Firebase
const Cart = () => {
    const navigate = useNavigate();
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const { mobileNumber } = useMobile();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [deliveryAddress, setDeliveryAddress] = useState('')
    const [pincode, setPincode] = useState('')
    const [mobile, setMobileNumber] = useState('')

    const handleChange = (e) => {
        setDeliveryAddress(e.target.value);
        // Automatically adjust height based on the text
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
        console.log(e.target.style.height)
    };

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

        if (document.getElementById('deliveryAddress').style.borderColor === 'red' && document.getElementById('deliveryPincode').style.borderColor === 'red' && document.getElementById('mobileNumberInput').style.borderColor === 'red') {
            alert('Please fill all required fields');
            return;
        }
        if (document.getElementById('deliveryAddress').style.borderColor === 'red') {
            alert('Please fill Delivery Address');
            return;
        }
        if (document.getElementById('deliveryPincode').style.borderColor === 'red') {
            alert('Please fill 6 digit pincode');
            return;
        }
        if (document.getElementById('mobileNumberInput').style.borderColor === 'red') {
            alert('Please fill 10 digit mobile number');
            return;
        }



        try {
            const userDocRef = doc(db, 'users', mobileNumber);
            const orderDetails = {
                items: cartItems,
                total,
                orderDate: new Date().toISOString(),
                status: 'Pending'
            };
            // Add order to orders collection
            await updateDoc(userDocRef, {
                orders: arrayUnion(orderDetails),
                cartItems: [],
            });
            setCartItems([]);
            setTotal(0);
            navigate('/realSolution/CustomPopup')
        } catch (error) {
            console.error('Error confirming order:', error);
            alert('Failed to confirm order. Try again.');
        }
    };

    return (
        <div>
            <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif' }}>
                <h1 style={{ margin: '5px', fontSize: 20, marginBottom: 0 }}>My Cart</h1>
                <div style={{ borderWidth: 0.5, borderStyle: 'solid', borderColor: 'grey', width: '100%', marginTop: 5 }} ></div>
                {loading ? (
                    <div style={{ textAlign: 'center' }}>Loading...</div>
                ) : cartItems.length > 0 ? (
                    <>
                        <textarea
                            id='deliveryAddress'
                            onChange={handleChange}
                            type="text"
                            placeholder='Delivery Address'
                            maxLength={100}
                            style={{ height: 20, minHeight: 20, width: '96.5%', paddingLeft: 10, borderWidth: 1, borderColor: deliveryAddress ? 'black' : 'red', borderRadius: 5, marginTop: 5, borderStyle: 'solid', fontSize: 16, maxHeight: '61px', outlineStyle: 'none' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '0.5%' }} >
                            <input
                                id='deliveryPincode'
                                type="number"
                                onInput={(e) => {
                                    if (e.target.value.length < 6) {
                                        e.target.style.borderColor = 'red';
                                    } else {
                                        e.target.style.borderColor = 'black';
                                    }
                                    // Restrict the input to a maximum of 10 digits
                                    if (e.target.value.length > 6) {
                                        e.target.value = e.target.value.slice(0, 6);
                                    }
                                    setPincode(e.target.value);
                                }}
                                placeholder='Delivery Pincode'
                                style={{ height: 25, width: '50%', paddingLeft: 10, borderWidth: 1, borderColor: 'red', borderRadius: 5, marginBottom: 5, marginTop: 1, borderStyle: 'solid', fontSize: 16, outlineStyle: 'none' }}
                            />
                            <input
                                id='mobileNumberInput'
                                type="number"
                                onInput={(e) => {
                                    if (e.target.value.length < 10) {
                                        e.target.style.borderColor = 'red';
                                    } else {
                                        e.target.style.borderColor = 'black';
                                    }
                                    if (e.target.value.length > 10) {
                                        e.target.value = e.target.value.slice(0, 10);
                                    }
                                    setMobileNumber(e.target.value);
                                }}
                                placeholder='Mobile Number'
                                style={{ height: 25, width: '50%', paddingLeft: 10, borderWidth: 1, borderColor: 'red', borderRadius: 5, marginBottom: 5, marginTop: 1, borderStyle: 'solid', fontSize: 16, outlineStyle: 'none' }}
                            />
                        </div>
                        <div style={{ maxHeight: 400, overflowY: 'auto', }} >
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #ddd',
                                        padding: '5px',
                                        borderRadius: '5px',
                                        marginTop: 5,
                                        boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.09)'
                                    }}
                                >
                                    <img
                                        src={item.imageUrl || imageNotAvailable}
                                        alt={item.name}
                                        style={{
                                            height: '70px',
                                            width: '70px',
                                            marginRight: '15px',
                                            borderRadius: '5px',
                                            objectFit: 'cover',
                                            borderRightWidth: 0.5,
                                            borderRightColor: 'black',
                                            borderRightStyle: 'solid',
                                            boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)'
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
                                            gap: '5px',
                                            alignSelf: 'end'
                                        }}
                                    >
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            style={{
                                                padding: '5px',
                                                border: 'none',
                                                background: 'red',
                                                color: 'white',
                                                cursor: 'pointer',
                                                borderRadius: '5px',
                                                width: '30px',
                                                height: '30px',
                                                fontWeight: 'bold',
                                                boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)'
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
                                                background: 'green',
                                                color: 'white',
                                                cursor: 'pointer',
                                                borderRadius: '5px',
                                                width: '30px',
                                                height: '30px',
                                                fontWeight: 'bold',
                                                boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)'
                                            }}
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            style={{
                                                padding: '5px 10px',
                                                background: 'black',
                                                color: 'white',
                                                cursor: 'pointer',
                                                borderRadius: '5px',
                                                marginLeft: 5,
                                                boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}</div>
                        <div style={{ marginTop: '5px', fontSize: '18px', fontWeight: 'bold', textAlign: 'right' }}>
                            Total: ₹{total}
                        </div>
                        <button
                            onClick={confirmOrder}
                            style={{
                                marginTop: '5px',
                                padding: '10px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                width: '100%',
                                height: 40
                            }}
                        >
                            Confirm Order
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', fontSize: '16px', color: '#555', marginTop: 10 }}>Your cart is empty.</div>
                )}

            </div>
            <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 5, right: 5, }} >
                <div onClick={() => navigate('/realSolution/Home')} style={{ width: '95%', height: 35, backgroundColor: '#ff6347', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.5)' }} >Continue Purchasing</div>
            </div>
            <BottomNavBar CartImage1={CartImage1} ></BottomNavBar>
        </div>
    );
};

export default Cart;
