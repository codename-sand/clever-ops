import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ApiPost, ApiGet } from "@services";
import { GlobalPopup } from "@components";
import { useEffect } from "react";

//data
import mailServerUpdate from "../../_apiDatas/settings/mailServerUpdate.json"

export const MailServer = () => {
    const {
        register,
        handleSubmit,
        resetField,
        reset,
        formState: { errors, },
    } = useForm({ mode: 'onBlur' });

    const navigate = useNavigate();

    // 메일서버 정보 업데이트
    const updateMailServer = async (data) => {
        const postData = {
                "ipAddress": data.ip,
                "port": data.port,
                "email": data.email,
                "pwd": data.password
        };
        // const updateMS = await ApiPost(`/api_v1/system/settings/mailServer`,postData);
        const updateMS = {"code": 200};
        if(updateMS.code === 200) alert("등록이 완료되었습니다");
    }

    const clearForm = () => resetField("ip");

    // popup 관련
    const [popups, showPopup] = useState(false); // 팝업 show-hide
    const setPopupStatus = (childVal) => showPopup(childVal); // 팝업 내부 show-hide 상태

    // 메일 테스트
    const [recvMail, setRecvMail] = useState(``);
    const mailTest = async () => {
        // const res = await ApiPost(`api_v1/system/settings/mailTest?email=${recvMail}`);
        const res = {"code": 200};
        res.code === 200 ? showPopup(!popups) : alert('테스트 메일 전송 실패');
    };

    // 초기값 설정
    const getMailInfo = async () => {
        // const res = await ApiGet(`api_v1/system/settings/mailServer`, navigate);
        const res = mailServerUpdate;
        if (res.code === 200) {
            let data = {}
            res.mailInfo.map((item, index) => data[item.key] = item.value);
            reset(data);
        };
    }
    
    useEffect(() => {
        getMailInfo();
    }, [])

    return (
        <div className="setting_page">
            {popups && <GlobalPopup innerText={'테스트 메일을 발송하였습니다.\n메일함에서 테스트 메일을 확인해주세요.'} btnType={"confirm"} isShow={setPopupStatus}/>}
            <p className="setting_title">메일 서버 설정</p>
            <p className="sub_title">메일 서버</p>
            <form 
                className="set_inner_form"
                onSubmit={handleSubmit((data,e) => {
                    if (e.keyCode === 13) e.preventDefault();

                    try {
                        updateMailServer(data);
                    }catch (e) {
                        console.log("err >>", e);
                    }
                })}
            >
                <div className="input_lines">
                    <label htmlFor="">IP 주소</label>
                    <input
                        type="text"
                        placeholder="IPv4입력"
                        {...register("ip", {
                            required: "IPv4를 입력해주세요",
                        })}
                        className={errors.ip?.message !== undefined ? `addError` : ''}
                    />
                    <span className="error_line">{errors.ip?.message}</span>
                </div>
                <div className="input_lines">
                    <label htmlFor="">포트</label>
                    <input
                        type="text"
                        style={{ width: "180px" }}
                        placeholder="포트를 입력해주세요"
                        {...register("port", {
                            required: "포트를 입력해주세요",
                        })}
                        className={errors.port?.message !== undefined ? `addError` : ''}
                    />
                    <span className="error_line">{errors.port?.message}</span>
                </div>
                <div className="input_lines">
                    <label htmlFor="">발신자 이메일 주소</label>
                    <input
                        type="mail"
                        placeholder="발신자 이메일을 입력해주세요"
                        {...register("email", {
                            required: "메일을 입력해주세요",
                            pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, message: '이메일 형식을 입력해주세요.' },
                        })}
                        className={errors.email?.message !== undefined ? `addError` : ''}
                    />
                    <span className="error_line">{errors.email?.message}</span>
                </div>
                <div className="input_lines">
                    <label htmlFor="">발신자 이메일 비밀번호</label>
                    <input
                        type="password"
                        autoComplete="on"
                        placeholder="발신자 비밀번호를 입력해주세요"
                        {...register("password", {
                            required: "비밀번호를 입력해주세요",
                        })}
                        className={errors.password?.message !== undefined ? `addError` : ''}
                    />
                    <span className="error_line">{errors.password?.message}</span>
                </div>
                <div className="button_wrap" style={{ border: "none",marginLeft: "200px"}}>
                    <button type="submit" className="save_btn">저장</button>
                    <button type="button" className="cancel_btn" onClick={() => clearForm()}>취소</button>
                </div>
            </form>
            
            <p className="sub_title" style={{marginTop:"40px"}}>메일 송수신 확인</p>
            <form className="set_inner_form" style={{borderBottom:"none"}}>
                <div className="input_lines">
                    <label htmlFor="">수신자 이메일 주소</label>
                    <input
                        type="mail"
                        placeholder="테스트용 수신자 이메일을 입력해주세요"
                        onChange={(e) => setRecvMail(e.target.value)}
                    />
                </div>          
                <button type="button" className="mail_btn" onClick={mailTest}>메일 테스트</button>
            </form>
        </div>
        
    )
}