import React, { useState, useEffect } from "react";
import homeImage from '../public/homeImage.png'
import WalletImage from '../public/walletImage.png'
import MyOrdersImage from '../public/myOrdersImage.png'
import CartImage from '../public/cartImage.png'
import MenuImage from '../public/menuImage.png'
import Menu from './Menu'
import { useNavigate } from "react-router-dom";
import MenuImage1 from '../public/menuImage1.png'
import { useMobile } from "./MobileStorage";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
function BottomNavBar({ HomeImage1, CartImage1, MyOrdersImage1, WalletImage1 }) {
    const navigate = useNavigate()
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const { mobileNumber } = useMobile()
    const [isMenuVisible, setIsMenuVisible] = useState('none')
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const userDocRef = doc(db, 'users', mobileNumber);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const items = userDoc.data().cartItems || [];
                    setCartItems(items);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
            }
        };

        fetchCartItems();
    }, [mobileNumber]);
    return (
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', border: '1px solid black', zIndex: 99999999, backgroundColor: 'white' }} >
            <img onClick={() => navigate('/realSolution/Home')} style={{ height: 45, width: 45 }} src={HomeImage1 || homeImage} alt="Home" />
            <img onClick={() => navigate('/realSolution/Cart')} style={{ height: 50, width: 50 }} src={CartImage1 || CartImage} alt="Cart" />
            <img onClick={() => navigate('/realSolution/MyOrders')} style={{ height: 50, width: 50 }} src={MyOrdersImage1 || MyOrdersImage} alt="MyOrders" />
            <img onClick={() => navigate('/realSolution/Wallet')} style={{ height: 50, width: 50 }} src={WalletImage1 || WalletImage} alt="Wallet" />

            <img onClick={() => {
                if (isMenuVisible === 'none') {
                    setIsMenuVisible('block')
                } else {
                    setIsMenuVisible('none')
                }
            }} style={{ height: 50, width: 50 }} src={isMenuVisible === 'block' ? MenuImage1 : MenuImage} alt="Menu" />
            <div onClick={() => navigate('/realSolution/AdminRavi')} style={{ height: 40, width: 40, borderRadius: '50%', display: mobileNumber === '9352000360' ? 'flex' : mobileNumber === '9829435433' ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', color: 'white', boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.5)' }}>a</div>
            <Menu display={isMenuVisible} ></Menu>
        </div>
    )
}

export default BottomNavBar