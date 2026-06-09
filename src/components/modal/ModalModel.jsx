import { React, useState, useEffect } from "react";
import "@assets/scss/modal.scss";
import { ChangeInput, Switch, BokehChart, ModalTag } from "@components";
import { updateAPIData, strftimeNow } from "@utils";

//data
import modelModalInfo from "../../_apiDatas/models/modelModalInfo.json"
import modelModalHistory from "../../_apiDatas/models/modelModalHistory.json"

export const ModalModel = ({ changeModal, modelId, modelName, tableUpdate }) => {
    // Modal On-Off
    const [modalStatus , OnModals] = useState(false);
    const [modalName, setModalName] = useState('');
    const changeTagModal = (val) => OnModals(val);

    // 우측상단 시간 선택버튼
    const changeBtns = (e) => {
        let clkItem = document.querySelectorAll(".btn_wrap button");
        for (let i = 0; i < clkItem.length; i++) clkItem[i].classList.remove("active"); //초기화
        e.currentTarget.classList.add("active"); //현재버튼 active 적용
        // Change bokeh chart time interval
        let new_before = e.target.value * 60;      // target.value(hour), before(min)
        setBefore(new_before);
    };

    // tab 변경
    const changeTab = (e, contentId) => {
        let clkItem = document.querySelectorAll(".tab_btn_models li");
        for (let i = 0; i < clkItem.length; i++) clkItem[i].classList.remove("active");
        e.currentTarget.classList.add("active");

        let clkContents = document.querySelectorAll(".tab_contents_models");
        for (let i = 0; i < clkContents.length; i++) clkContents[i].classList.remove("active");
        document.querySelector("#" + contentId).classList.add("active");
    };

    // Bokeh Chart
    const time = strftimeNow() // 현재 시각
    const [before, setBefore] = useState(60); // min

    // 모델 상세 Table
    const updatePath = `api_v1/service/models/update?modelId=${modelId}`;
    const [modelInfo, setModelInfo] = useState([{
        modelName: '',
        threshold: null,
        description: '',
        modelStatus: true,
        tagCnt: 0,
        tags: []
    }]);
    
    const info = modelModalInfo['details'][0];
    // const info = modelInfo[0];
    // const getModelInfo = async () => {
    //     const url = `api_v1/service/models/detail?modelId=${modelId}`;
    //     updateAPIData(url, modelInfo, 'details', setModelInfo);

    // };

    // History
    const history = modelModalHistory['histories'];

    // const [history, setHistory] = useState([]);
    // const getHistory = async () => {
    //     const url = `api_v1/service/models/history?modelId=${modelId}`;
    //     // updateAPIData(url, history, 'histories', setHistory);
    // };

    // useEffect(() => {
    //     getModelInfo();
    //     getHistory();
    // }, []);

    return (
        <div className="modal_container">
            {modalStatus && <ModalTag modalType={"tag"} changeModal={changeTagModal} tagName={modalName}/>}
            <div className="modal">
                <div className="modal_header">
                    <p>Model 상세보기</p>
                    <button onClick={() => {
                        changeModal(false);
                        if (tableUpdate) tableUpdate();
                    }}></button>
                </div>
                <div className="modal_contents">
                    <div className="modal_title">
                        <div className="left_wrap">
                            <p>{modelName}</p>
                        </div>
                        <div className="btn_wrap">
                            <button value="1" className="active" onClick={e => changeBtns(e)}>1시간</button>
                            <button value="6" onClick={e => changeBtns(e)}>6시간</button>
                            <button value="24" onClick={e => changeBtns(e)}>24시간</button>
                            <button value="168" onClick={e => changeBtns(e)}>1주일</button>
                        </div>
                    </div>

                    <div className="modal_graph">
                        <div className="graph_subsc">
                            <p><span className="th"></span>threshold</p>
                            <p><span className="li"></span>이상탐지</p>
                        </div>
                        <BokehChart 
							uid={"detail_model"}
							graphURN={`/api_v1/service/events/graph?width=${1334}&height=${220}&modelId=${modelId}&modelName=${modelName}&time=${time}&before=${before}`}
                            type={'modelModal'}
						/>
                    </div>

                    <div className="modal_tab">
                        <ul className="tab_btn_models">
                            <li className="active" onClick={e => changeTab(e, "model")}>모델 상세</li>
                            <li onClick={e => changeTab(e, "history")}>History</li>
                        </ul>

                        <div className="modal_tab_contents">
                            <div className={`modelDetail tab_contents_models active`} id="model">
                                <ul className="tab_inner_models">
                                    <li>
                                        <p className="title">모델명</p>
                                        <ChangeInput defaultVal={modelName} 
                                            updateUrl={`${updatePath}&column=name&value=`}
                                        />
                                    </li>
                                    <li>
                                        <p className="title">Threshold</p>
                                        <ChangeInput defaultVal={info.threshold} 
                                            updateUrl={`${updatePath}&column=threshold&value=`}
                                        />
                                    </li>
                                    <li>
                                        <p className="title">설명</p>
                                        <ChangeInput defaultVal={info.description} 
                                            updateUrl={`${updatePath}&column=description&value=`}
                                        />
                                    </li>
                                    <li>
                                        <p className="title">사용 설정</p>
                                        <Switch status={info.modelStatus} selectModel={modelId}/>
                                    </li>
                                    <li>
                                        <p className="title">관련 태그</p>
                                        <div className="right_item">
                                            <p className="total">{info.tagCnt}</p>
                                            <ul className="tag_list">
                                                {info.tags.map((item, index) => {
                                                    return <li key={index} onClick={() => {
                                                        OnModals(!modalStatus);
                                                        setModalName(item);
                                                    }}>{item}</li>
                                                })}
                                            </ul>
                                        </div>

                                    </li>
                                </ul>
                            </div>
                            <div className="history tab_contents_models" id="history">
                                <div className="history_list">
                                    <div className="history_header">
                                        <p>일시</p>
                                        <p>변경 내용</p>
                                        <p>담당자</p>
                                    </div>
                                    <ul className="history_contents">
                                        {history.map((item) => {
                                            return (
                                                <li key={item.id} className="contents_line">
                                                    <p>{item.daytime}</p>
                                                    <p>{item.content}</p>
                                                    <p>{item.manager}</p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="button_wrap">
                    <button onClick={() => {
                        changeModal(false)
                        if (tableUpdate) tableUpdate();
                        }} className="save_btn">닫기</button>
                </div>
            </div>
        </div>
    );
}