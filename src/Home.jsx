import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import './Shopping.css'; // For styling
import { useMobile } from './MobileStorage'
import './main.css'
// Initialize Firebase


const Home = () => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const { mobileNumber } = useMobile()
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch menu items from Firestore
    useEffect(() => {
        const fetchMenuItems = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'menu-items'));
                const items = [];
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() });
                });
                setMenuItems(items);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    // Fetch user's cart items
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const userDocRef = doc(db, 'users', mobileNumber);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setCart(userDoc.data().cartItems || []);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [mobileNumber]);

    const addToCart = async (item) => {
        try {
            const userDocRef = doc(db, 'users', mobileNumber);
            const updatedCart = [...cart, { ...item, quantity: 1 }];
            setCart(updatedCart);

            await updateDoc(userDocRef, { cartItems: updatedCart });
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Could not add item to cart.');
        }
    };

    const updateQuantity = async (itemId, change) => {
        try {
            const userDocRef = doc(db, 'users', mobileNumber);
            const updatedCart = cart
                .map((cartItem) => {
                    if (cartItem.id === itemId) {
                        const newQuantity = (cartItem.quantity || 0) + change;
                        return newQuantity > 0 ? { ...cartItem, quantity: newQuantity } : null;
                    }
                    return cartItem;
                })
                .filter(Boolean);

            setCart(updatedCart);
            await updateDoc(userDocRef, { cartItems: updatedCart });
        } catch (error) {
            console.error('Error updating cart quantity:', error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            const userDocRef = doc(db, 'users', mobileNumber);
            const updatedCart = cart.filter((cartItem) => cartItem.id !== itemId);
            setCart(updatedCart);

            await updateDoc(userDocRef, { cartItems: updatedCart });
        } catch (error) {
            console.error('Error removing item from cart:', error);
            alert('Could not remove item from cart.');
        }
    };

    const isInCart = (itemId) => {
        const cartItem = cart.find((cartItem) => cartItem.id === itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    return (
        <div style={{ padding: '5px', fontFamily: 'Arial, sans-serif', }}>
            <h1 style={{ margin: 5 }} >Shopping</h1>
            {loading ? (
                <div style={{ textAlign: 'center' }}>Loading...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {menuItems.map((item) => (
                        <div style={{ display: 'flex', flexDirection: 'row', border: '1px solid black' }} key={item.id}>
                            <img style={{ height: 100, width: 100, border: '1px solid black' }} src={item.imageUrl} alt={item.name} />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }} >
                                <p style={{ margin: 0, fontSize: 16, fontWeight: 40 }} >{item.name}</p>
                                <p style={{ margin: 0 }} >₹{item.price}</p>
                                <p style={{ margin: 0 }} >{item.quantity}</p>
                            </div>
                            {isInCart(item.id) ? (
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                    <span>{isInCart(item.id)}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                    <button onClick={() => removeItem(item.id)} className="remove-button">
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => addToCart(item)} className="add-to-cart-button">
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <button className="go-to-cart-button" onClick={() => console.log('Navigate to cart')}>
                Go to Cart
            </button>
        </div>
    );
};

export default Home;
