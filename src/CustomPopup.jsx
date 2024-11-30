import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function CustomPopup({ display }) {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(display);

    useEffect(() => {
        setIsVisible(display); // Sync visibility prop with internal state
    }, [display]);

    const changeVisibility = () => {
        setIsVisible('none');
        navigate('/realSolution/Home');
    };

    return (
        <div style={{ display: isVisible }} >
            <div style={{ position: 'absolute', height: 200, width: 250, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', zIndex: 10000000000, borderWidth: 3, borderStyle: 'solid', borderColor: 'green', borderRadius: 7, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                    <div style={{ borderWidth: 5, borderColor: 'green', borderStyle: 'solid', borderRadius: '50%', width: 100 }} >
                        <div style={{ color: 'green', fontSize: 50, borderRadius: '50%', textAlign: 'center' }}>&#x2713;</div>
                    </div>
                    <h1 style={{ color: 'green', fontSize: 20 }} >Order Successfull</h1>
                    <div onClick={changeVisibility} style={{ height: 30, width: 50, backgroundColor: 'green', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 5, cursor: 'pointer' }} >OK</div>
                </div>
            </div>
        </div>
    )
}
export default CustomPopup;