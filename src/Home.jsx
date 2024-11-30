import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import './Shopping.css';
import { useMobile } from './MobileStorage';
import './main.css';
import homeImage from '../public/homeImage.png';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';
import imageNotAvailable from '../public/imageNotAvailable.png'
import HomeImage1 from '../public/HomeImage1.png'

const Home = () => {
    const navigate = useNavigate();
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const { mobileNumber } = useMobile();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [cart, setCart] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'menu-items'));
                const items = [];

                for (const docSnap of querySnapshot.docs) {
                    const brandsSnapshot = await getDocs(collection(db, 'menu-items', docSnap.id, 'brand'));
                    const brands = [];

                    for (const brandDoc of brandsSnapshot.docs) {
                        const itemsSnapshot = await getDocs(collection(db, 'menu-items', docSnap.id, 'brand', brandDoc.id, 'items'));
                        const brandItems = itemsSnapshot.docs.map((itemDoc) => ({
                            id: itemDoc.id,
                            ...itemDoc.data(),
                        }));

                        brands.push({ id: brandDoc.id, ...brandDoc.data(), items: brandItems });
                    }

                    items.push({ id: docSnap.id, ...docSnap.data(), brands });
                }

                setCategories(items);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', overflow: 'hidden', width: '100vw' }}>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 5,
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: '#ffffff',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                }}
            >
                <img style={{ height: 30, width: 30 }} src={homeImage} alt="Home" />
                <p style={{ fontSize: 24, margin: 0, color: 'darkGreen' }}>Real Solution</p>
            </div>

            <div style={{ padding: '5px', overflow: 'scroll', maxHeight: 'calc(100vh - 170px)' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', fontSize: '18px', color: '#6c757d' }}>Loading...</div>
                ) : (
                    <div style={{ display: 'grid', gap: 5, overflow: 'hidden' }}>
                        {categories.map((category) => (
                            <div key={category.id} style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', width: '92vw' }}>
                                <div onClick={() => {

                                    setSelectedCategory(category.id)
                                    setSelectedBrand(null)

                                }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }} >
                                    <img style={{ height: 60, width: 60, borderRadius: 5, boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)' }} src={category.imageUrl} alt="" />
                                    <p style={{ fontSize: '20px', color: '#343a40', cursor: 'pointer', margin: 0 }}>{category.id}</p>
                                </div>

                                {selectedCategory === category.id && (
                                    <div style={{ width: '100%' }} >
                                        <div style={{ borderWidth: 0.5, borderColor: 'grey', borderStyle: 'solid', marginTop: 10 }} ></div>
                                        <div style={{ display: 'flex', gap: 5, marginTop: '10px', overflowY: 'scroll', maxWidth: '100vw', scrollbarWidth: 'none', flexDirection: 'row' }}>
                                            {category.brands.map((brand) => (
                                                <div
                                                    key={brand.id}
                                                    onClick={(e) => {
                                                        setSelectedBrand(brand)
                                                        e.target.style.backgroundColor = 'black'
                                                    }}
                                                    style={{ cursor: 'pointer', textAlign: 'center', maxWidth: '100px', backgroundColor: selectedBrand?.id === brand.id ? 'grey' : 'white', borderRadius: 7 }}
                                                >
                                                    <img
                                                        src={brand.imageUrl || imageNotAvailable}
                                                        alt={brand.id}
                                                        style={{
                                                            height: 60,
                                                            width: 60,
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)',
                                                        }}
                                                    />
                                                    <p style={{ fontSize: '16px', margin: '0px', color: selectedBrand?.id === brand.id ? 'white' : '#495057' }}>{brand.id}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedBrand && (
                                            <div style={{ marginTop: '5px', width: '100%' }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: 5,
                                                        overflowY: 'scroll',
                                                        maxWidth: '100vw',
                                                        scrollbarWidth: 'none',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    {selectedBrand.items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 5,
                                                                border: '1px solid #dee2e6',
                                                                borderRadius: '8px',
                                                                padding: '10px',
                                                                backgroundColor: '#f8f9fa',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <img
                                                                src={item.imageUrl || imageNotAvailable}
                                                                alt=""
                                                                style={{
                                                                    height: 90,
                                                                    width: 90,
                                                                    borderRadius: '5px',
                                                                    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.1)'
                                                                }}
                                                            />
                                                            <p style={{ margin: 0, fontSize: '16px', flexGrow: 1, textAlign: 'center' }}>{item.name}</p>
                                                            <p style={{ margin: 0, fontSize: '16px', flexGrow: 1, color: 'green' }}>
                                                                ₹ {item.price}
                                                            </p>
                                                            {isInCart(item.id) > 0 ? (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, }}>
                                                                    <button
                                                                        style={{ padding: '5px', border: '1px solid #dee2e6', borderRadius: '4px', backgroundColor: '#d9534f', color: '#fff', height: 30, width: 30, fontWeight: 'bold', boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)' }}
                                                                        onClick={() => updateQuantity(item.id, -1)}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span>{isInCart(item.id)}</span>
                                                                    <button
                                                                        style={{ padding: '5px', border: '1px solid #dee2e6', borderRadius: '4px', backgroundColor: '#5cb85c', color: '#fff', height: 30, width: 30, fontWeight: 'bold', boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)' }}
                                                                        onClick={() => updateQuantity(item.id, 1)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    style={{
                                                                        padding: '5px',
                                                                        border: 'none',
                                                                        borderRadius: '5px',
                                                                        backgroundColor: 'black',
                                                                        color: '#fff',
                                                                        cursor: 'pointer',
                                                                        fontSize: 14,
                                                                        width: 90,
                                                                        height: 30,
                                                                        boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.3)'
                                                                    }}
                                                                    onClick={() => addToCart(item)}
                                                                >
                                                                    <span>Add</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {cart.length > 0 && (<div style={{ position: 'absolute', width: '100%', bottom: 75, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <button onClick={() => navigate('/realSolution/Cart')} style={{ width: '90%', height: 45, backgroundColor: 'black', color: 'white', borderRadius: 7, fontSize: 16 }} >Go To Cart</button>
            </div>)}
            <BottomNavBar HomeImage1={HomeImage1} />
        </div>
    );
};

export default Home;
