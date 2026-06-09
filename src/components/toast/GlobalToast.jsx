import { React, useEffect, useState } from "react";
import "@/assets/scss/common.scss";

export const GlobalToast = (props) => {
    const [displayIs, setDisplayIs] = useState('flex');

    setTimeout(()=>{ 
        setDisplayIs('none');
        props.status(false);
    },props.sec * 1000);

    return (
        <div className="toast_container" style={{display : displayIs}}>
            <div className="toast_box">
                <p>{props.innerText}</p>
            </div>
        </div>
    );
}