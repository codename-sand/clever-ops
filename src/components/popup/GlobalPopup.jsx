import { React, useState } from "react";
import "@/assets/scss/common.scss";
import { NoticeIcon } from "@assets/img";

export const GlobalPopup = (props) => {

    return (
        <div className="popup_container" style={{ display: props.isShow ? "flex" : "none" }}>
            <div className="global_popup">
                <div className="inner_contents">
                    <NoticeIcon fill="#FF9F43"/>
                    <p>{props.innerText}</p>
                </div>
                <div className="button_wrap">
                    <button className="save_btn" onClick={() => {
                        props.isShow(false);
                        props.isConfirmResult !== undefined && props.isConfirmResult();
                        props.isResult !== undefined && props.isResult(true);
                        }}>확인</button>
                    <button
                        style={{ display: props.btnType === "all" ? "block" : "none" }}
                        className="cancel_btn"
                        onClick={() => {
                            props.isShow(false);
                            props.isCancelResult !== undefined && props.isCancelResult();
                            props.isResult !== undefined && props.isResult(false);
                        }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}