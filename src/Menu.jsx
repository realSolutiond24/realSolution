import React from "react";
import { useNavigate } from "react-router-dom";
import homeImage from './assets/homeImage.png';
import WalletImage from './assets/walletImage.png';
import MyOrdersImage from './assets/myOrdersImage.png';
import CartImage from './assets/cartImage.png';
import LogoutImage from './assets/logoutImage.png';
import ReferralImage from './assets/referralLogo.png';
import SettingsImage from './assets/settingsImage.png';
import { useMobile } from "./MobileStorage";
function Menu({ display }) {
    const { setMobileNumber, mobileNumber } = useMobile()
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
                navigate('/realSolution/App'); // Adjust based on your logout logic
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
