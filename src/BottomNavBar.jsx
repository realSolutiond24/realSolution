import React from "react";
import homeImage from './assets/homeImage.png'
import { useNavigate } from "react-router-dom";
function BottomNavBar() {
    const navigate = useNavigate()
    return (
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', border: '1px solid black', zIndex: 99999999, backgroundColor: 'white' }} >
            <img onClick={() => navigate('/realSolution/Home')} style={{ height: 50, width: 50 }} src={homeImage} alt="home" />
            <img onClick={() => navigate('/realSolution/Cart')} style={{ height: 50, width: 50 }} src={homeImage} alt="home" />
            <img onClick={() => navigate('/realSolution/MyOrders')} style={{ height: 50, width: 50 }} src={homeImage} alt="home" />
            <img onClick={() => navigate('/realSolution/Home')} style={{ height: 50, width: 50 }} src={homeImage} alt="home" />
            <img onClick={() => navigate('/realSolution/Home')} style={{ height: 50, width: 50 }} src={homeImage} alt="home" />
        </div>
    )
}

export default BottomNavBar