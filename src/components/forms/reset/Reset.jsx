import React from "react";
import { reload } from "@assets/img";

export const Reset = ({ onClickMethod }) => {
    return (
        <button className="reset_btn" onClick={() => {
            onClickMethod();
        }}>
            <img src={reload} alt="reload_icon" />
        </button>
    );

}