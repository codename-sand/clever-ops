import { React, useState } from "react";
import { switchOff, switchOn } from "@/assets/img";
import { ApiPut } from "@services";
import { useNavigate } from "react-router-dom";

export const StopSwitch = ({ service, status}) => {
    // status값 타입 변경 
    const realStatus = status === "true" ? true : false;
    // 공통
    const navigate = useNavigate();
    // 버튼 스위치값
    const [switchStatus, setStatus] = useState(realStatus);
    // 버튼 배경 변경
    const [btns, setBtns] = useState(realStatus);
    const switchSrc = switchStatus ? switchOn : switchOff;


    const putBtnValue = async () => {
        // const response = await ApiPut(`api_v1/system/settings/serverStatus?service=${service}&status=${!switchStatus}`,navigate);
        // if (response.code === 200) {
            setStatus(!switchStatus);
            setBtns(!btns);
        // }
    }

    return (
        <>
            <button
            style={{cursor:"pointer", backgroundImage:`url(${switchSrc})`}}
            onClick={() => putBtnValue()}
            className="switchBtn"></button>
        </>
    );
}