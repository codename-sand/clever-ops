import { React, useState, useEffect } from "react";
import { ApiGet } from "@services";
import "@assets/scss/modal.scss";
import { ChangeInput, BokehChart } from "@components";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

//data
import tagListData from "../../_apiDatas/tags/tagList.json"

export const ModalTag = ({ changeModal, tagName, tableUpdate }) => {
    const navigate = useNavigate();
    const divId = 'detail_tag';
    // graph
    const tagWidth = 1334;
    const tagHeight = 220;
    const time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'); //현재시간
    const [before, setBefore] = useState(60);       //분단위
    const [after, setAfter] = useState(60);        //분단위

    const [like, setLike] = useState('');
    const [system, setSystem] = useState('');
    const [equipment, setEquipment] = useState('');
    const [modelList, setModelList] = useState([]);
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    // 우측상단 시간 선택버튼
    const changeBtns = (e) => {
        let clkItem = document.querySelectorAll(".btn_wrap button");
        for (let i = 0; i < clkItem.length; i++) clkItem[i].classList.remove("active"); //초기화
        e.currentTarget.classList.add("active"); //현재버튼 active 적용
    };

    const getModalData = async () => {
        // let modalData = await ApiGet(`api_v1/service/tags/detail?&tagName=${tagName}`, navigate);
        let modalData = tagListData.tagList.filter(list => tagName === list['name']);

        // if (modalData.code === 200) {
            let datas = modalData[0];
            setLike(() => datas.like === "true" ? 'active' : null);
            setSystem(datas.system);
            setEquipment(datas.equipment);
            setModelList(datas.model_name);
            setDescription(datas.description);
        // } else console.log("err >>", modalData);
    };

    useEffect(() => {
        getModalData()
    }, []);

    const makeModel = () => {
        let result = [];
        for (let i = 0; i < modelList.length; i++) {
            result.push(<span className="model_result" key={i}>{modelList[i]}</span>);
        }
        return result;
    };

    return (

        <div className="modal_container" style={{ display: changeModal ? "flex" : "none" }}>
            <div className="modal">
                <div className="modal_header">
                    <p>Tag 상세보기</p>
                    <button onClick={() => {
                        changeModal(false);
                        if (tableUpdate) tableUpdate();
                    }
                    }/>
                </div>
                <div className="modal_contents">
                    <div className="modal_title">
                        <div className="left_wrap">
                            <div className={`setFav ${like}`}></div>
                            <p>{tagName}</p>
                        </div>
                        <div className="btn_wrap">
                            <button className="active" onClick={(e) => {
                                changeBtns(e);
                                setBefore(60);
                                setAfter(10);
                            }}>1시간</button>
                            <button onClick={(e) => {
                                changeBtns(e);
                                setBefore(360);
                                setAfter(60);
                            }}>6시간</button>
                            <button onClick={(e) => {
                                changeBtns(e);
                                setBefore(1440);
                                setAfter(180);
                            }}>24시간</button>
                            <button onClick={(e) => {
                                changeBtns(e);
                                setBefore(10080);
                                setAfter(1680);
                            }}>1주일</button>
                        </div>
                    </div>
                    <div className="modal_graph">
                        <BokehChart 
							uid={'tag_'+divId}
							graphURN={`api_v1/service/tags/graph?width=${tagWidth}&height=${tagHeight}&tagName=${tagName}&time=${time}&before=${before}&after=${after}`}
                            type={'tagModal'}
                        />
                    </div>
                    <ul className="modal_list">
                        <li>
                            <p className="title">설비명</p>
                            <p className="result">{equipment}</p>
                        </li>
                        <li>
                            <p className="title">계통명</p>
                            <p className="result">{system}</p>
                        </li>
                        <li>
                            <p className="title">연관 모델</p>
                            <p className="result">
                                {makeModel()}
                            </p>
                        </li>
                        <li>
                            <p className="title">설명</p>
                            <ChangeInput 
                                defaultVal={description} 
                                updateUrl={`api_v1/service/tags/detail?tagName=${tagName}&description=${content}`}
                                content={content}
                                setContent={setContent}
                            />
                        </li>
                    </ul>
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