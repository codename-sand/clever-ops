import { reEditIcon, saveIcon } from '@assets/img';
import { useEffect, useState, useRef } from 'react';
import styled from "styled-components";
import { GlobalPopup } from '@components';
import { ApiPost, setCurrentTabId, SetStore, ApiDelete, ApiPut } from "@services";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

//datas
import tabList from "../../../_apiDatas/dashboard/tabList.json";

// insert button component
const InputBtn = styled.button`
    background : transparent url(${(props) => props.btnbg}) no-repeat center center`;

export const CustomInput = (props) => {
    const navigate = useNavigate();
	const dispatch = useDispatch();

    const container = useRef(); //컨테이너 dom찾기
    const [iconBtns, changeIcons] = useState(reEditIcon); //input value 맞춰 아이콘 변경
    const [btnIs, setBtnIs] = useState(false); //버튼 노출여부
    const [changeInput, setInputStatus] = useState(false); //input 노출여부
    //팝업 노출 여부
    const [popupStatus, setPopups] = useState(false);
    const setPopupStatus = (childVal) => setPopups(childVal);
    //팝업 버튼값 
    const [popBtnVal, setPopBtn] = useState(false); 
    const setPopBtns = (child) => setPopBtn(child);
    // 현재 수정 진행중인 위젯정보
    const curtabId = props.tabIndex;
    const [inputVal, changeVal] = useState(props.tabName);


    const saveTitle = () => { // 데이터 및 제목 저장
        if (iconBtns === saveIcon) {
            props.type === 'new' ? addTab() : updateTab();
        }
        else {
            alert('변경된 내용 혹은 입력한 내용이 없습니다');
            setInputStatus(false);//팝업닫기
        }
    };

    const insertText = (e) => { // input 입력값 받는 이벤트
        const values = e.currentTarget.value;
        changeVal(values);
        values.length > 0 && values !== props.tabName ? changeIcons(saveIcon) : changeIcons(reEditIcon);
    };

    const updateTab = async () => {
        // const update = await ApiPut(`/api_v1/service/dashboard/tab?tabId=${curtabId}&tabName=${inputVal}`, navigate);

        // if (update.code === 200) {
            alert('저장되었습니다');
            setInputStatus(false);//팝업닫기
            changeIcons(reEditIcon);//아이콘변경
            dispatch(SetStore(setCurrentTabId, curtabId)); 
        // }
    };

    const addTab = async () => {
        // const add = await ApiPost(`/api_v1/service/dashboard/tab?tabName=${inputVal}`, navigate);
        const add = {"code": 200};

        if (add.code === 200) {
            alert('새로운 탭이 생성되었습니다');
            props.completeAdd(false); //탭추가 아이콘 변경
            dispatch(SetStore(setCurrentTabId, 0));
            //새로 추가한 대시보드 띄우기
        }
    };

    const deleteTab = async () => {
        // const del = await ApiDelete(`/api_v1/service/dashboard/tab?tabId=${curtabId}`, navigate);
        const del = {"code": 200};

        if (del.code === 200) {
            alert('삭제되었습니다');
            dispatch(SetStore(setCurrentTabId, 0)); 
            //디폴트 대시보드 띄우기
        }
    };

    useEffect(() => { //tab btn click (init) 초기화 함수
        if (props.activeIs === 'active') setBtnIs(true);
        else {
            setBtnIs(false);
            setInputStatus(false);
        }
        changeIcons(reEditIcon);
    }, [props.activeIs]);

    useEffect(() => { //커스텀 대시보드 새로 생성 시
        if (props.type === 'new') {
            setInputStatus(true);
            setBtnIs(true);
        }
    }, [props.type]);

    useEffect(() => {//팝업 삭제 누르면 delete 진행
        if (popBtnVal) deleteTab();
    }, [popBtnVal]);

    return (
        <>
            {popupStatus && <GlobalPopup isShow={setPopupStatus} innerText={'정말로 삭제하시겠습니까?'} btnType={'all'} isResult={setPopBtns} />}
            
            <div ref={container} className={`dash_tab_btn ${props.activeIs}`} tabIndex={props.type === 'new' ? -1 : props.tabIndex} name={inputVal}>
                {changeInput ?
                    <input type="text" defaultValue={inputVal} placeholder='대시보드 이름 입력' className="dashbd_name" onChange={insertText} 
                    onKeyUp={(e) => {if (e.key === "Enter") !changeInput ? setInputStatus(!changeInput) : saveTitle()
                    }}/>
                    : <p>{inputVal}</p>
                }
                {btnIs &&
                    <>
                        <InputBtn onClick={() => !changeInput ? setInputStatus(!changeInput) : saveTitle()} btnbg={iconBtns} />
                        {props.tabIndex !== -1 && <button className='del_btn' onClick={setPopupStatus} />}
                    </>}
            </div>
        </>
    );
}