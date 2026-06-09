import React, { useState, useContext, useCallback } from 'react';
import "@assets/scss/login.scss";
import { biImage } from "@assets/img";
import { ApiPost, setUser, useStore, GetStore, SetStore, setLoginTime } from "@services";
import { useLocation, Navigate, useNavigate } from "react-router-dom"
import { Provider, useDispatch, useSelector, connect } from 'react-redux';
import moment from "moment";

export const Login = () => {
    const date = new Date();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleUser = useCallback((id) => {
        dispatch(SetStore(setUser, id));
        dispatch(SetStore(setLoginTime, moment(date).format('YYYY-MM-DD HH:mm:ss')));
    })
    
    const onSubmitForm = async (e, id) => {
        e.preventDefault();
        // const res = await ApiPost('api_v1/public/login', {
        //     id: id,
        //     passwd: password
        // });
        const res = {code : 200};
        if (res.code === 200) {
            handleUser(id);
            navigate('/');
        } else {
            alert("로그인 실패");
        }
    }

    return(
        <div className="login">
            <div className="left_wrap">
                <h2>서부발전</h2>
                <p>AI기반 발전제어시스템 이상행위 탐지 솔루션</p>
            </div>
            <form action="" onSubmit={(e) => onSubmitForm(e, id)}> 
                <div>
                    <img src={biImage} alt="bi" />
                    <input type="text" value={id} placeholder="아이디" autoComplete="autoComplete" onChange={(e) => setId(e.target.value)}/>
                    <input type="password" value={password} placeholder="비밀번호" autoComplete="autoComplete" onChange={(e) => setPassword(e.target.value)}/>
                    <input type="submit" value="로그인"/>
                </div>
                <p className="copyright">© Ahnlab, Inc. All rights reserved.</p>
            </form>
        </div>
    );
}

export default connect()