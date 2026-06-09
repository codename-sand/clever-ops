import React, { useState, useContext, useCallback } from 'react';
import { ApiPost, setUser, GetStore, SetStore } from "@services";
import { useNavigate } from "react-router-dom";
import { persistor } from '@services'

export const UserInfo = (props) => {
    const navigate = useNavigate();
    const getUser = GetStore("user", "user");

    const logout = async (e) => {
        e.preventDefault();
        // await ApiPost('api_v1/service/logout');
        // await persistor.purge();
        // window.sessionStorage.removeItem('persist:root');
        navigate('/login');
        props.isShow(false);
    }
    return(
        <form className={`top_user_detail`} onSubmit={(e) => logout(e)}>
            <h3>사용자 정보</h3>
            <p className="user_id">{getUser}</p>
            <button type="submit" >로그아웃</button>
        </form>
    );
} 