import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from '../public/homeImage.png';
import WalletImage from '../public/walletImage.png';
import MyOrdersImage from '../public/myOrdersImage.png';
import CartImage from '../public/cartImage.png';
import LogoutImage from '../public/logoutImage.png';
import ReferralImage from '../public/referralLogo.png';
import SettingsImage from '../public/settingsImage.png';
import { useMobile } from "./MobileStorage";
import CrossImage from '../public/crossImage.png'
import BottomNavBar from "./BottomNavBar";
function Menu({ display }) {
    const { setMobileNumber, mobileNumber } = useMobile()
    const [isMenuVisibleAccCross, setIsMenuVisibleAccCross] = useState(true);
    const navigate = useNavigate();

    const handleMenuClick = (route) => {
        switch (route) {
            case "Home":
                navigate('/realSolution/Home');
                break;
            case "Settings":
                navigate('/realSolution/Settings');
                break;
            case "Wallet":
                navigate('/realSolution/Wallet');
                break;
            case "My Orders":
                navigate('/realSolution/MyOrders');
                break;
            case "My Referrals":
                navigate('/realSolution/MyReferrals');
                break;
            case "My Cart":
                navigate('/realSolution/Cart');
                break;
            case "Logout":
                setMobileNumber('')
                navigate('/realSolution/'); // Adjust based on your logout logic
                break;
            default:
                console.warn(`No route defined for ${route}`);
        }
    };

    const menuItems = [
        { label: "Home", icon: homeImage, route: "Home" },
        { label: "Settings", icon: SettingsImage, route: "Settings" },
        { label: "Wallet", icon: WalletImage, route: "Wallet" },
        { label: "My Orders", icon: MyOrdersImage, route: "My Orders" },
        { label: "My Referrals", icon: ReferralImage, route: "My Referrals" },
        { label: "My Cart", icon: CartImage, route: "My Cart" },
        { label: "Logout", icon: LogoutImage, route: "Logout" },
    ];

    return (
        <div style={{
            height: 350, width: 225, backgroundColor: 'white',
            position: 'absolute', bottom: 65, right: 5, display,
            borderRadius: 7, border: '1px solid black'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
                <p style={{ margin: 3 }}>Menu</p>
                <hr style={{ border: '1px solid grey', margin: '5px 0' }} />
                {menuItems.map(({ label, icon, route }, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex', flexDirection: 'row',
                            gap: 10, alignItems: 'center', margin: '5px 0', cursor: 'pointer'
                        }}
                        onClick={() => handleMenuClick(route)}
                    >
                        <img src={icon} alt={label} style={{ height: 20, width: 20 }} />
                        <p style={{ margin: 0 }}>{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Menu;
