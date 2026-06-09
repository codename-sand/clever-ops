import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@assets/scss/setting.scss";
import { StopSwitch } from "@components";
import { restart, restart_white, StatusStart, StatusStop } from "@assets/img";
import { ApiGet, ApiPut } from "@services";

//datas
import systemStatusData from "../../_apiDatas/settings/systemStatus.json"

export const SystemInfo = () => {
    // 공통
    const navigate = useNavigate();
    // 받아온 시스템정보
    const [list, setList] = useState([]);
    
    const getSysList = async () => {
        // const systemList = await ApiGet(`api_v1/system/settings/serverStatus`, navigate);
        const systemList = systemStatusData;
        setList(systemList.serverStatus);
    }

    const getTitle = (status, title) => {
        const proName = document.getElementById("productname");
        const versionInfo = document.getElementById("version");

        title === "version" ? versionInfo.innerHTML = status : proName.innerHTML = status;
    }

    const restartAgent = async (e) => {
        // const res = await ApiPut('api_v1/system/settings/agentRestart', navigat);
        const res = {
            "code": 200
        };
        if (res.code === 200) getSysList();
    };

    const reload = (e) => {
        getSysList();
    };

    useEffect(() => {
        getSysList();
    }, []);

    return (
        <div className="setting_page">
            <p className="setting_title">시스템 정보</p>
            <div className="info_line">
                <p className="sub_title">제품명</p>
                <p className="result" id="productname"></p>
            </div>
            <div className="info_line">
                <p className="sub_title">버전</p>
                <p className="result" id="version"></p>
            </div>
            <div className="line"></div>
            <div className="title_wrap">
                <p className="setting_title">서비스 상태</p>
                <button onClick={e => reload(e)}>
                    <img src={restart_white} alt="icons" />
                    Reload
                </button>
            </div>

            <ul className="system_table info_table">
                <li className="system_header">
                    <p>서비스명</p>
                    <p>기능 제어</p>
                    <p>시간</p>
                    <p>설명</p>
                </li>
                {list && list.map((item) => {
                  // 시스템 버전, 제품명 데이터 가져오기
                  if (item.service === 'productName' || item.service === 'version') return getTitle(item.status, item.service);
                  // detection btn
                  const detectBtn = item.predict ? true : false;
                  // agent btn
                  const agentBtn = item.service === 'Agent' ? true : false;
                  const dotIcons = item.status === 'true' ? <StatusStart/> : <StatusStop/>;

                    return (
                        <li key={item.service}>
                            <p className="service_name">
                                {dotIcons}
                                {item.service}
                            </p>
                            <p>
                                {detectBtn && <StopSwitch service={item.service} status={item.predict}/>}
                                {agentBtn && 
                                <span className="draw_btn" onClick={e => restartAgent(e)}>
                                    <img src={restart} alt="btn_icon" className="restart" />
                                    <span>Restart</span>
                                </span>}    
                            </p>
                            <p>{item.reg_day}</p>
                            <p>{item.description}</p>
                        </li>
                    );
                })}
            </ul>
            <p className="status_desc">※ 현재 서비스 상태 :ㅤ<StatusStart/> 동작중 &#40;Started&#41;ㅤ|ㅤ<StatusStop/> 정지 &#40;Stopped&#41;</p>
        </div>
    )
}