import React from "react";
import { useForm } from "react-hook-form";
import { ApiPost } from "@services";

export const AccountModal = ({ isShow, title, evtType, innerData, tableUpdate }) => {
    // 모달형태 확정
    const evt = evtType;
    // update 시 기존 사용자정보 가져오기
    const inputs = {
        name: innerData.name,
        idname: innerData.idname,
        role: innerData.role,
        email: innerData.email,
        alarm: innerData.alarm,
        desc: innerData.desc,
    };

    const { name, idname, role, email, alarm, desc } = inputs;

    // use form 사용
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, },
    } = useForm({ mode: 'onBlur' });

    // 사용자 정보 추가
    const addUserInfo = async (data) => {
        const addData = {
            "user": {
                "id": data.id,
                "name": data.name,
                "passwd": data.password,
                "email": data.email,
                "role": data.role,
                "desc": data.desc === null ? '' : data.desc
            },
            "userby": {
                "id": data.id,
                "value": data.alarm === null ? 'false' : data.alarm
            },
            "cur_passwd": ""
        }

        // const addUser = await ApiPost(`/api_v1/system/register/users`, addData);
        const addUser = {"code": 200};
        if (addUser.code === 200) {
            alert("등록이 완료되었습니다");
            if (tableUpdate) tableUpdate();
            setTimeout(isShow(false), 1000);
        }
    }
    // 사용자 정보 수정
    const updateUserInfo = async (data) => {
        const updateData = {
            "user": {
                "id": idname,
                "name": name,
                "passwd": data.password,
                "email": data.email === null ? email : data.email,
                "role": data.role === null ? role : data.role,
                "desc": data.desc === null ? desc : data.desc
            },
            "userby": {
                "id": idname,
                "value": data.alarm === null ? alarm : data.alarm
            },
            "cur_passwd": data.curPassword
        }

        // const updateUser = await ApiPost(`/api_v1/system/register/users`, updateData);
        const updateUser = {"code": 200};
        
        if (updateUser.code === 200) {
            alert("수정이 완료되었습니다");
            if (tableUpdate) tableUpdate();
            setTimeout(isShow(false), 1000);
        } else if (updateUser.code === 201) {
            alert("사용중인 비밀번호가 일치하지 않습니다");
        } else {
            alert("업데이트 실패");
        }
    }
    // 패스워드 타이틀 수정
    const pwStr = evt === 'update' ? '변경할 ' : '';
    // 패스워드 중복확인
    const onValid = (data) => {
        if (data.password !== data.passwordCheck) {
            setError(
                'passwordCheck', 
                { message: '비밀번호가 일치하지 않습니다.' }, 
                { shouldFocus: true }, 
            );
        }else{
            evt === 'add' ? addUserInfo(data) : updateUserInfo(data);
        }
    };

    return (
        <div className="modal_wrap" style={{ display: isShow ? "flex" : "none" }}>
            <div className="modal">
                <div className="modal_header">
                    <p>{evt === 'update' ? title+' 수정' : title+' 추가'}</p>
                    <button onClick={() => {
                        if (tableUpdate) tableUpdate();  
                        isShow(false)  
                    }}></button>
                </div>
                <form
                    onSubmit={handleSubmit((data) => {
                        try {
                            onValid(data);
                        }catch (e) {
                            console.log("err >>", e);
                        }
                    })}>
                    <div className="input_line">
                        <label htmlFor="">이름</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="이름을 입력하세요"
                            defaultValue={name}
                            className={errors.name?.message !== undefined ? `addError` : ''}
                            {...register("name", {
                                required: evt === 'add' ? "이름을 입력하세요" : false,
                            })}
                            disabled={evt === 'update' ? true : false}
                        />
                        <span className="error_line">{errors.name?.message}</span>
                    </div>
                    <div className="input_line">
                        <label htmlFor="">아이디</label>
                        <input
                            type="text"
                            name="id"
                            placeholder="아이디를 입력하세요"
                            defaultValue={idname}
                            className={errors.id?.message !== undefined ? `addError` : ''}
                            {...register("id", {
                                required: evt === 'add' ? "아이디를 입력하세요" : false,
                                // pattern: {
                                //     value: /^[A-za-z0-9가-힣]{3,10}$/,
                                //     message: '가능한 문자: 영문 대소문자, 글자 단위 한글, 숫자',
                                //   },
                            })}
                            disabled={evt === 'update' ? true : false}
                        />
                        <span className="error_line">{errors.id?.message}</span>
                    </div>
                    <div className="input_line" style={{ display: evt === 'update' ? "flex" : "none" }}>
                        <label htmlFor="">현재 비밀번호</label>
                        <input
                            type="password"
                            name="curPassword"
                            placeholder="사용중인 비밀번호를 입력하세요"
                            autoComplete="on"
                            className={errors.curPassword?.message !== undefined ? `addError` : ''}
                            {...register("curPassword", {
                                required: evt === 'update' ? "사용중인 비밀번호를 입력하세요" : false,
                            })}
                        />
                        <span className="error_line">{errors.curPassword?.message}</span>
                    </div>
                    <div className="input_line">
                        <label htmlFor="">{pwStr}비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호는 영문자 대문자,소문자,숫자,특수 문자를 조합하여 8자리 이상 입력하세요"
                            autoComplete="on"
                            className={errors.password?.message !== undefined ? `addError` : ''}
                            {...register("password", {
                                required: "비밀번호를 입력하세요",
                                minLength: {
                                    message: "8글자 이상 입력하세요",
                                    value: 8,
                                },
                                pattern: {
                                    value:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                    message:'비밀번호는 숫자, 영문 대문자, 소문자, 특수문자를 포함한 8글자 이상이어야 합니다.',
                                },
                            })}
                        />
                        <span className="error_line">{errors.password?.message}</span>
                    </div>
                    <div className="input_line">
                        <label htmlFor="">{pwStr}비밀번호 확인</label>
                        <input
                            type="password"
                            name="passwordCheck"
                            placeholder="비밀번호를 다시 입력해주세요"
                            autoComplete="on"
                            className={errors.passwordCheck?.message !== undefined ? `addError` : ''}
                            {...register("passwordCheck", {
                                required: "비밀번호를 다시 입력해주세요",
                            })}
                        />
                        <span className="error_line">{errors.passwordCheck?.message}</span>
                    </div>
                    <div className="input_line">
                        <label htmlFor="">권한</label>
                        <div className="radio_btn">
                            <div className="radio_wrap">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    id="admin"
                                    defaultChecked={role === "admin" ? true : false}
                                    {...register('role', {
                                        required : '권한을 선택해주세요'
                                    })}
                                />
                                <div className={`real_btn ${errors.role?.message !== undefined ? `addError` : ''}`}/>
                            </div>
                            <label htmlFor="admin">Admin</label>
                            <span className="error_line error_role">{errors.role?.message}</span>
                        </div>
                        <div className="radio_btn">
                            <div className="radio_wrap">
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    id="user"
                                    defaultChecked={role === "user" ? true : false}
                                    {...register('role', {
                                        required : '권한을 선택해주세요'
                                    })}
                                />
                                <div className={`real_btn ${errors.role?.message !== undefined ? `addError` : ''}`}/>
                            </div>
                            <label htmlFor="user" className={errors.role?.message !== undefined ? `addError` : ''}>User</label>
                        </div>
                    </div>
                    <div className="input_line">
                        <label htmlFor="">이메일</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="이메일을 입력하세요"
                            defaultValue={email}
                            className={errors.email?.message !== undefined ? `addError` : ''}
                            {...register('email', {
                                required : '이메일을 입력해주세요',
                                pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, message: '이메일 형식을 입력해주세요.' },
                            })}
                        />
                        <span className="error_line">{errors.email?.message}</span>
                    </div>
                    <div className="input_line">
                        <label htmlFor="">경보메일 수신</label>
                        <div className="radio_btn">
                            <div className="radio_wrap">
                                <input
                                    type="radio"
                                    name="alarm"
                                    value="true"
                                    id="true"
                                    defaultChecked={alarm === "true" ? true : false}
                                    {...register('alarm')}
                                />
                                <div className="real_btn"></div>
                            </div>
                            <label htmlFor="alarm">수신</label>
                        </div>
                        <div className="radio_btn">
                            <div className="radio_wrap">
                                <input
                                    type="radio"
                                    name="alarm"
                                    value="false"
                                    id="false"
                                    defaultChecked={alarm === "false" ? true : false}
                                    {...register('alarm')}
                                />
                                <div className="real_btn"></div>
                            </div>
                            <label htmlFor="not_alarm">수신 안함</label>
                        </div>
                    </div>
                    <div className="input_line align_reset">
                        <label htmlFor="">설명</label>
                        <textarea
                            placeholder="설명을 200자 이하로 입력"
                            defaultValue={desc}
                            {...register('desc', {
                                maxLength: {
                                    message: "200글자 이상 입력할 수 없습니다",
                                    value: 200,
                                },
                            })}
                        />
                    </div>
                    <div className="button_wrap">
                        <button type="submit" className="save_btn">저장</button>
                        <button onClick={() => isShow(false)} className="cancel_btn">취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
}