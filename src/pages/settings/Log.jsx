import { React, useState, useEffect } from "react";
import { ApiGet, ApiDelete } from "@services";
import "@assets/scss/setting.scss";
import { LogForms, GlobalPopup } from "@components";
import { deleteIcon, editIcon } from "@assets/img";
import { useNavigate } from "react-router-dom";

//data
import logDatas from "../../_apiDatas/settings/logData.json";

export const Log = () => {
    const navigate = useNavigate();
    const [totalData, setTotalData] = useState([]);
    const [flag, setFlag] = useState(true);
    const handleFlag = (val) => setFlag(true);

    // modal 관련
    const [modals, showModal] = useState(false);
    const setModalStatus = (childVal) => showModal(childVal);
    // popup 관련
    const [popups, showPopup] = useState(false); // 팝업 show-hide
    const setPopupStatus = (childVal) => showPopup(childVal); // 팝업 내부 show-hide 상태
    const [btns, setBtnVal] = useState(false); // 팝업 버튼값
    const btnValue = (popVal) => setBtnVal(popVal); // 팝업 내부 버튼값
    const [keys, setKeys] = useState();

    const [btnType, setBtnType] = useState();
    const [logData, setLogData] = useState([]);

    const getLogData = async () => {
        // const res = await ApiGet('api_v1/system/settings/logs', navigate);
        const res = logDatas;
        setTotalData(res.logsStatus);
    }

    const deleteLogData = async () => {
        // let res = await ApiDelete(`api_v1/system/settings/logs?key=${keys}`);
        let res = {"code": 200};
        if (res.code === 200) {
            alert('삭제 되었습니다');
            getLogData();
            setBtnVal(false);
        }
        else alert('오류가 발생했습니다.')
    }

    const deleteLogSettings = (logData) => {
        showPopup(!popups); // 팝업 띄우기
        setKeys(logData);
    };

    useEffect(() => {
        if (btns) deleteLogData(); //팝업 - 삭제버튼 누름
    }, [btns]);

    useEffect(() => {
        if (flag) {
            getLogData()
            setFlag(false)
        }
    }, [flag])

    return (
        <div className="setting_page">
            {modals && <LogForms isShow={setModalStatus} title={"로그추가"} logData={logData} eventType={btnType} handleFlag={handleFlag} showValue={modals}/>}
            {popups && <GlobalPopup innerText={'로그 설정 정보를 정말로 삭제하시겠습니까?'} btnType={"all"} isShow={setPopupStatus} isResult={btnValue} />}
            <p className="setting_title">로그 전송 설정</p>
            <div className="ac_top_container">
                <button onClick={() => {
                    setBtnType('insert');
                    showModal(!modals);
                }} className="log"></button>
                <p>전체 개수 : {totalData.length} 개</p>
            </div>
            <ul className="system_table ac_table">
                <li className="system_header">
                    <p>
                        <img src={editIcon} alt="edit_icon" />
                    </p>
                    <p>
                        <img src={deleteIcon} alt="del_icon" />
                    </p>
                    <p>IP주소</p>
                    <p>포트(UDP)</p>
                </li>
                {totalData && totalData.map((item, index) => {
                    return (
                        <li key={item.key}>
                            <p>
                                <button
                                    className="edit_btn"
                                    onClick={() => {
                                        setLogData(item)
                                        setBtnType('update');
                                        showModal(!modals);
                                    }} />
                            </p>
                            <p><button className="del_btn" onClick={() => deleteLogSettings(item.key)} /></p>
                            <p>{item.ip}</p>
                            <p>{item.port}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}