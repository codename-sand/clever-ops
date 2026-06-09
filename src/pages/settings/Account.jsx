/* eslint-disable react-hooks/exhaustive-deps */
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@assets/scss/setting.scss";
import { deleteIcon, editIcon, mailO, mailX } from "@assets/img";
import { AccountModal, Pagination, GlobalPopup } from "@components";
import { ApiGet, ApiDelete } from "@services";
import { useEffect } from "react";

//data
import userListData from "../../_apiDatas/settings/userList.json"

export const Account = () => {
    // pagination & userList (공통)
    const [pageSize, setPageSize] = useState(10); // 페이지당 10개씩 노출
    const [currentPage, setCurrentPage] = useState(1); // 현재페이지
    const [totalCount, setTotalCount] = useState(0); // 전체 유저정보 개수
    const [userList, setUserList] = useState([]); // 페이지마다 그려줄 유저리스트
    // 공통
    const navigate = useNavigate();
    // modal 관련
    const [modals, showModal] = useState(false); // 모달 show-hide
    const setModalStatus = (childVal) => showModal(childVal); // 모달 내부 버튼값 show-hide
    // popup 관련
    const [popups, showPopup] = useState(false); // 팝업 show-hide
    const setPopupStatus = (childVal) => showPopup(childVal); // 팝업 내부 show-hide 상태
    const [btns, setBtnVal] = useState(false); // 팝업 버튼값
    const btnValue = (popVal) => setBtnVal(popVal); // 팝업 내부 버튼값
    const [delUser, delUserId] = useState(); // 유저 삭제 id
    // 유저정보
    const [userData, getUserData] = useState([]);
    // 폼(모달) 버튼 선택
    const [btnType , getBtnType] = useState();
    // 유저리스트
    const getUserList = async () => {
        let offValue = pageSize * (currentPage - 1);

        // let userList = await ApiGet(`/api_v1/system/register/users?limit=${pageSize}&offset=${offValue}`, navigate); // 한 페이지당 유저리스트
        // let totalList = await ApiGet(`/api_v1/system/register/users?`, navigate); // 전체 유저리스트

        let userList = userListData;
        let totalList = {
            "userList": 2,
            "code": 200
        }

        setUserList(userList.userList);
        setTotalCount(totalList.userList);
    }

    // 유저정보 삭제
    const deleteUser = async () => {
        // let res = await ApiDelete(`/api_v1/system/register/users?id=${delUser}`, navigate);
        let res =  {"code": 200};

        if (res.code === 200) {
            alert('삭제 되었습니다')
            getUserList();
            setBtnVal(false);
        }
        else alert('오류가 발생했습니다.')
    }

    const deleteUserInfo = (userId) => {
        showPopup(!popups); // 팝업 띄우기
        delUserId(userId); // 선택한 유저id 저장
    }

    useEffect(() => {
        getUserList(); //유저정보 가져오기
        if (btns) deleteUser(); //팝업 - 삭제버튼 누름
    }, [pageSize, currentPage, btns, delUser]);

    return (
        <div className="setting_page">
            {modals && <AccountModal isShow={setModalStatus} title={"관리자 계정"} evtType={btnType} innerData={userData} tableUpdate={getUserList}/>}
            {popups && <GlobalPopup innerText={'사용자 정보를 정말로 삭제하시겠습니까?'} btnType={"all"} isShow={setPopupStatus} isResult={btnValue} />}

            <p className="setting_title">계정 설정</p>
            <div className="ac_top_container">
                <button
                    onClick={() => {
                        showModal(!modals);
                        getUserData([]);
                        getBtnType('add');
                    }}
                    className="add_user">
                </button>
                <p>전체 개수 : {totalCount} 개</p>
            </div>
            <ul className="system_table ac_table">
                <li className="system_header">
                    <p><img src={editIcon} alt="edit_icon" /></p>
                    <p><img src={deleteIcon} alt="del_icon" /></p>
                    <p>이름</p>
                    <p>아이디</p>
                    <p>권한</p>
                    <p>이메일</p>
                    <p>경보메일수신</p>
                    <p>설명</p>
                </li>

                {userList && userList.map(item => {
                    const mailIcon = item.alarm === "true" ? mailO : mailX;
                    return (
                        <li key={item.id}>
                            <p>
                                <button 
                                    className="edit_btn" 
                                    onClick={() => {
                                        getUserData(item);
                                        showModal(!modals);
                                        getBtnType('update');
                                }}/>
                            </p>
                            <p>
                                <button className="del_btn" onClick={() => deleteUserInfo(item.idname)}></button>
                            </p>
                            <p>{item.name}</p>
                            <p>{item.idname}</p>
                            <p>{item.role}</p>
                            <p>{item.email}</p>
                            <p><img src={mailIcon} alt="mail_icon" /></p>
                            <p>{item.desc}</p>
                        </li>
                    );
                })}
            </ul>
            <Pagination
                total={totalCount}
                current={currentPage}
                setCurrent={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                onChange={setCurrentPage}
                useSelect={false}
            />
        </div>
    )
}