import { React, useState, useEffect } from "react";
import { ApiPost, ApiPut } from "@services";

export const LogForms = (props) => {
    const [ip, setIp] = useState('');
    const [port, setPort] = useState('');
    const [key, setKey] = useState('')

    useEffect(() => {
        // console.log(props.logData)
        if (props.eventType === 'update') {
            setIp(props.logData.ip)
            setPort(props.logData.port)
            setKey(props.logData.key)
        }
    }, [props]);

    const updateLogData = async (key, ip, port) => {
        const data = {
            "ipAddress": ip,
            "port": port,
        }
        // let res = await ApiPut(`api_v1/system/settings/logs?key=${key}`, data);
        let res = {"code": 200};
        if (res.code === 200) {
            alert("업데이트 되었습니다.");
            props.isShow(false);
        }
        props.handleFlag()
    };

    const postLogData = async (ip, port) => {
        const data = {
            "ipAddress": ip,
            "port": port,
        }
        // let res = await ApiPost('api_v1/system/settings/logs', data);
        let res = {"code": 200};

        if (res.code === 200) {
            alert("등록되었습니다.");
            props.isShow(false);
        }
        props.handleFlag()
    };
    
    return (
        <div className="modal_wrap" style={{ display: props.showValue ? "flex" : "none" }}>
            <div className="modal">
                <div className="modal_header">
                    <p>{props.title}</p>
                    <button onClick={() => props.isShow(false)}></button>
                </div>
                <form>
                    <div className="input_line">
                        <label htmlFor="">IP 주소</label>
                        <input type="text" name="" placeholder="IPv4 입력" defaultValue={ip} style={{width:"400px"}} onChange={(e) => setIp(e.target.value)}/>
                    </div>
                    <div className="input_line">
                        <label htmlFor="">포트(UDP)</label>
                        <input type="text" name="" placeholder="" defaultValue={port} style={{width:"180px"}} onChange={(e) => setPort(e.target.value)}/>
                    </div>
                </form>
                <div className="button_wrap">
                    <button className="save_btn" onClick={() => {
                        if (ip==='') alert("ip 주소를 입력해주세요");
                        else if (port === '') alert("포트를 입력해주세요");
                        else props.eventType === 'update' ? updateLogData(key, ip, port) : postLogData(ip, port);
                    }}>저장</button>
                    <button onClick={() => props.isShow(false)} className="cancel_btn">취소</button>
                </div>
            </div>
        </div>
    );
}
