import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import './Shopping.css'; // For styling
import { useMobile } from './MobileStorage'
import './main.css'
import homeImage from './assets/homeImage.png'
import { useNavigate } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';


const Home = () => {
    const navigate = useNavigate();
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
        <div>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 10,
                    alignItems: 'center',
                    gap: 10
                }}
            >
                <img
                    style={{ height: 30, width: 30 }}
                    src={homeImage}
                />
                <p style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>Home</p>
                <div style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }} >
                </div>
            </div>
            <div style={{ padding: '5px', fontFamily: 'Arial, sans-serif', }}>
                {loading ? (
                    <div style={{ textAlign: 'center' }}>Loading...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {menuItems.map((item) => (
                            <div style={{ display: 'flex', flexDirection: 'row', borderWidth: '0.5px', borderColor: 'black', borderStyle: 'solid', backgroundColor: '#f9f9f9', borderRadius: 5, padding: 7 }} key={item.id}>
                                <img style={{ height: 100, width: 100, borderRadius: 5 }} src={item.imageUrl} alt={item.name} />
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'space-evenly' }} >
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }} >
                                        <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >{item.name}</p>
                                        <p style={{ margin: 0, color: 'grey', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >₹{item.price}</p>
                                        <p style={{ margin: 0, color: 'grey', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >{item.measurement}</p>
                                    </div>
                                    {isInCart(item.id) ? (
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                            <button style={{ height: 30, fontSize: 20, fontWeight: 40, width: 40, backgroundColor: '#ff6347', border: 'none', borderRadius: 5, color: 'white' }} onClick={() => updateQuantity(item.id, -1)}>-</button>
                                            <span style={{ height: 30, width: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }} >{isInCart(item.id)}</span>
                                            <button style={{ height: 30, fontSize: 20, fontWeight: 40, width: 40, backgroundColor: '#ff6347', border: 'none', borderRadius: 5, color: 'white' }} onClick={() => updateQuantity(item.id, 1)}>+</button>
                                            <button style={{ height: 30, fontSize: 14, width: '100%', backgroundColor: '#ff6347', border: 'none', borderRadius: 5, color: 'white' }} onClick={() => removeItem(item.id)} >Remove</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => addToCart(item)} style={{ height: 30, width: '80%', backgroundColor: '#ff6347', border: 'none', borderRadius: 5, color: 'white' }}>
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 65 }} >
                    <div onClick={() => navigate('/realSolution/Cart')} style={{ width: '90%', height: 40, backgroundColor: '#ff6347', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} >Go To Cart</div>
                </div>
            </div>
            <BottomNavBar></BottomNavBar>
        </div>

    );
};

export default Home;
