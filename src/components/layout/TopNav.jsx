import React, { useState, useCallback } from 'react';
import { FavoriteIcon, AlarmIcon, profile } from "@assets/img";
import { AlarmContainer } from './AlarmContainer';
import { UserInfo } from '@components';
import { togleUseFavorite, setUseFavorite, GetStore, SetStore } from "@services";
import { useDispatch } from 'react-redux';

export const TopNav = () => {
    const dispatch = useDispatch();
    const getStore = GetStore("user", "usefavorite");
    const getActive = GetStore("user", "useactive");
    const getUser = GetStore("user", "user");
    // 알림 리스트 show-hide
    const [alarmVal, showAlarmList] = useState(false);
    // 알림 리스트 내부 show-hide
    const changeAlarmContainer = (childValue) => showAlarmList(childValue);
    // 유저정보 show-hide
    const [infos, showUserInfo] = useState(false);
    // 유저정보 로그아웃 show-hide
    const setShowUserInfo = (childVal) => showUserInfo(childVal);
    // 알림 받은 경우 빨간 아이콘 생성
    const [redDot, addRedDot] = useState(false);
    const setRedDot = (childVal) => addRedDot(childVal);

    const handleStar = useCallback(() => {
        dispatch(SetStore(togleUseFavorite));
    })

    const handleActive = useCallback(() => {
        if (getActive === "active") dispatch(SetStore(setUseFavorite, ""));
        else dispatch(SetStore(setUseFavorite, "active"));
    })

    const handleMasterStar = (e) => {
        handleStar();
        handleActive();
    }

    return (
        <ul className="top_navi">
            <li className={`top_menu ${getActive} top_nav_list`} onClick={handleMasterStar}>
                <FavoriteIcon className="menu_icons" fill="transparent" />
            </li>
            <li className={`top_nav_list top_menu ${alarmVal ? "active" : ""}`} >
                <button
                    className={`top_nav_btns ${redDot ? 'onRed' : ''}`}
                    onMouseDown={() => {
                        showAlarmList(true);
                        showUserInfo(false);
                    }}>
                    <AlarmIcon className="menu_icons" />
                </button>
                <AlarmContainer alarmVal={alarmVal} isShow={changeAlarmContainer} setRedDot={setRedDot}/>
            </li>
            <li className='top_menu top_nav_list'>
                <button 
                    className='top_nav_btns user_wrap' 
                    onMouseDown={() => {
                        showUserInfo(!infos);
                        showAlarmList(false);
                }}>
                    <img src={profile} alt="user" className='profile_icon' />
                    <p className='user_name'>{getUser}</p>
                </button>
                {infos && <UserInfo isShow={setShowUserInfo} />}
            </li>
        </ul>
    );
}
