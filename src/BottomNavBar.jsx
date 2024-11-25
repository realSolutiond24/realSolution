import React, { useState } from "react";
import homeImage from '../public/homeImage.png'
import WalletImage from '../public/walletImage.png'
import MyOrdersImage from '../public/myOrdersImage.png'
import CartImage from '../public/cartImage.png'
import MenuImage from '../public/menuImage.png'
import Menu from './Menu'
import { useNavigate } from "react-router-dom";
function BottomNavBar() {
    const navigate = useNavigate()
    const [isMenuVisible, setIsMenuVisible] = useState('none')
    return (
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', border: '1px solid black', zIndex: 99999999, backgroundColor: 'white' }} >
            <img onClick={() => navigate('/realSolution/Home')} style={{ height: 50, width: 50 }} src={homeImage} alt="Home" />
            <img onClick={() => navigate('/realSolution/Cart')} style={{ height: 50, width: 50 }} src={CartImage} alt="Cart" />
            <img onClick={() => navigate('/realSolution/MyOrders')} style={{ height: 50, width: 50 }} src={MyOrdersImage} alt="MyOrders" />
            <img onClick={() => navigate('/realSolution/Wallet')} style={{ height: 50, width: 50 }} src={WalletImage} alt="Wallet" />
            <img onClick={() => {
                if (isMenuVisible === 'none') {
                    setIsMenuVisible('block')
                } else {
                    setIsMenuVisible('none')
                }
            }} style={{ height: 50, width: 50 }} src={MenuImage} alt="Menu" />
            <Menu display={isMenuVisible} ></Menu>
        </div>
    )
}

export default BottomNavBar