import { React, useState, useEffect, useCallback } from "react";
import { alarmTitle } from "@assets/img";
import { ApiGet, GetStore, SetStore, setAlarmDatas, spliceAlarmData, setLastAlarm, useInterval } from "@services";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { ModalEvent } from "@components";

//data
import alarmListData from "../../_apiDatas/layout/alarmList.json";

export const AlarmContainer = ({ alarmVal, isShow, setRedDot }) => {
    const listOn = alarmVal ? "active" : "";
    const getStore = GetStore("user", "logintime");
    const alarmData = GetStore("user", "alarmdata");
    const lastData = GetStore("user", "lastalarm");

    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Modal 
    const [modalStatus, showModals] = useState(false);
    const changeModal = (val) => showModals(val);
    const [modalOpened, setModalOpened] = useState(false);
    const [modalName, setModalName] = useState('');
    const [modalId, setModalId] = useState('');
    const [modalDate, setDate]=useState('');

    const [navStatus , setNavi] = useState(false);

    const handleAlarm = useCallback((params) => {
        dispatch(SetStore(setAlarmDatas, [...params]));
        dispatch(SetStore(setLastAlarm, {...params[0]}));
    });

    const getEventData = async () => {
        // let response = await ApiGet(`api_v1/service/events/listInfo?limit=10&offset=0&tagName=&modelName=&startOccurDate=${getStore}&endOccurDate=&content=&like=`, navigate);
        // let new_data = response.eventList;
        
        let response = alarmListData;
        let new_data = response.eventList;
        if (new_data !== undefined) {
            // let last_idx = new_data.length - 1;
            // for(let i in new_data) {
            //     if (lastData.occur_date === new_data[i].occur_date && lastData.modelname === new_data[i].modelname) {
            //         new_data.splice(i);
            //         break;
            //     }
            // }
            if (new_data.length > 1 && alarmData.length < 1) {
                dispatch(SetStore(setAlarmDatas, new_data));
                dispatch(SetStore(setLastAlarm, {...new_data[0]}));
            } else if (new_data.length > 1){
                dispatch(SetStore(setAlarmDatas, [
                    ...new_data,
                    ...alarmData
                ]));
                dispatch(SetStore(spliceAlarmData));
            } else { }
            if (new_data.length > 0) dispatch(SetStore(setLastAlarm, {...new_data[0]}));
        }
    }

    const handleRedDot = () => {
        if (alarmData.length < 1) setRedDot(false);
        else setRedDot(true);
    }

    useEffect(() => {
        getEventData();
    }, [getStore]);

    useEffect(() => {
        handleRedDot();
    }, [alarmData]);

    useInterval(async () => {
        if(getStore!=='') getEventData();
    }, 10000);

    return (
        <ul className={`alarm_container ${listOn}`} >
            {modalStatus && <ModalEvent changeModal={changeModal} selectModel={modalName} occurDate={modalDate} modelId={modalId}/>}
            <li className='title alarm_list'>
                <div className='title_left'>
                    <img src={alarmTitle} alt="alarm_icon" />
                    <p>이벤트 알림</p>
                </div>
                <button className='all_clear' onClick={() => isShow(false)}></button>
            </li>
            {alarmData && alarmData.map((list, index) => {
                return (
                    <li key={index+1} className="alarm_list">
                        <div className='list_left' onClick={() => {
                            dispatch(SetStore(spliceAlarmData, alarmData.indexOf(list)));
                            showModals(!modalStatus);
                            setModalName(list.modelname);
                            setDate(list.occur_date);
                            setModalId(list.id);
                        }}>
                            <p className='alarm_title' data-num={index+1}>{list.modelname}</p>
                            <p className='date'>{list.occur_date}</p>
                        </div>
                        <button className='clear' onClick={() => {
                            dispatch(SetStore(spliceAlarmData, alarmData.indexOf(list)));
                        }}></button>
                    </li>
                );
            })}
        </ul>
    );
}
