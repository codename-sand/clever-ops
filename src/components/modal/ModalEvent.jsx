/* eslint-disable jsx-a11y/anchor-is-valid */
import { React, useState, useEffect } from "react";
import "@assets/scss/modal.scss";
import { Link, useNavigate } from "react-router-dom";
import { ApiGet, ApiPost, ApiDelete } from "@services";
import { BokehChart, EditInput, NoneData, ModalModel } from "@components";

//data
import eventModalSubGraphData from "../../_apiDatas/events/eventModalSubGraphData.json";
import evtModalComments from "../../_apiDatas/events/modalComments.json";
import eventFavGraphData from "../../_apiDatas/events/eventFavGraphData.json"

export const ModalEvent = (props) => {
    // Modal On-Off
    const [modalStatus, OnModals] = useState(false);
    const [modalId, setModalId] = useState('');
    const [modalName, setModalName] = useState('');
    const changeModelModal = (val) => OnModals(val);

    const navigate = useNavigate();
    // graph
    const modelWidth = 1334;
    const modelHeight = 220
    const tagWidth = 1125
    const tagHeight = 90
    const [before, setBefore] = useState(60);       //분단위
    const [after, setAfter] = useState(60);        //분단위

    const [popStauts, Onpop] = useState(false);

    const [tagTop3List, setTagTop3List] = useState([]);
    const [anomalyTop3List, setAnomalyTop3List] = useState([]);

    const [tagLikeList, setTagLikeList] = useState([]);
    const [anomalyLikeList, setAnomalyLikeList] = useState([]);

    const [comment, setComment] = useState([]);
    const [contentReg, setContentReg] = useState('');

    // 우측상단 시간 선택버튼
    const changeBtns = (e) => {
        let clkItem = document.querySelectorAll(".btn_wrap button");
        for (let i = 0; i < clkItem.length; i++) clkItem[i].classList.remove("active"); //초기화
        e.currentTarget.classList.add("active"); //현재버튼 active 적용
    };

    // tab 변경
    const changeTab = (e, contentId) => {
        // tab btn css
        let clkItem = document.querySelectorAll(".tab_btn_evts li");
        for (let i = 0; i < clkItem.length; i++) clkItem[i].classList.remove("active");
        e.currentTarget.classList.add("active");

        // tab contents css
        let clkContents = document.querySelectorAll(".tab_contents_evts");
        for (let i = 0; i < clkContents.length; i++) clkContents[i].classList.remove("active");

        const cmtContents = document.getElementById("comment");
        const grWrap = document.querySelector(".graph_wrap");

        const grContents = document.getElementById("graph");
        const favContents = document.getElementById("fav_graph");

        
        if (contentId === "comment") { // 코멘트 탭
            cmtContents.classList.add("active");
            grWrap.style.display = "none";
        } else { // 그래프 탭
            cmtContents.classList.remove("active");
            grWrap.style.display = "block";

            if(contentId === "graph") {
                favContents.classList.add("sp_type");
                grContents.style.display = "flex";
            }else {
                favContents.classList.remove("sp_type");
                grContents.style.display = "none";
            }
        }
    };

    const getTop3Info = async () => {
        // let datas = await ApiGet(`api_v1/service/events/detail?occurDate=${props.occurDate}&modelName=${props.selectModel}`, navigate)
        let datas = eventModalSubGraphData;

        // if (datas.code === 200) {
        let temps_tag = [];
        let temps_anomaly = [];

        for (let i = 0; i < datas.eventTagList.length; i++) {
            let temp_anomal = Math.round(datas.eventTagList[i].anomaly * 100) / 100;

            temps_tag.push(datas.eventTagList[i].tagname);
            temps_anomaly.push(temp_anomal);
        }

        setTagTop3List(temps_tag);
        setAnomalyTop3List(temps_anomaly);
        // } else console.log("err >>", datas);
    };

    const getLikeInfo = async () => {
        // let datas = await ApiGet(`api_v1/service/events/detail/likes?occurDate=${props.occurDate}&modelName=${props.selectModel}`, navigate)
        let datas = eventFavGraphData;

        // if (datas.code === 200) {
        let temps_tag = [];
        let temps_anomaly = [];

        for (let i = 0; i < datas.eventTagList.length; i++) {
            let temp_anomal = Math.round(datas.eventTagList[i].anomaly * 100) / 100;

            temps_tag.push(datas.eventTagList[i].tagname);
            temps_anomaly.push(temp_anomal);
        }

        setTagLikeList(temps_tag);
        setAnomalyLikeList(temps_anomaly);
        
        // } else console.log("err >>", datas);
    };

    const getCommentInfo = () => {
        let temps = [];
        let response = evtModalComments;
        // let response = await ApiGet(`api_v1/service/events/comment?modelId=${props.modelId}&occurDate=${props.occurDate}`, navigate);
        // if (response.code === 200) {
        for (let i = 0; i < response.eventCommentList.length; i++) {
            temps.push(response.eventCommentList[i]);
        }
        // } else console.log("err >>", response);
        setComment(temps);
    };

    const postComment = (modelId, postOccurDate, postContent) => {
        const data = {
            "modelId": modelId,
            "occurDate": postOccurDate,
            "comment": postContent
        };
        alert('코멘트 등록이 완료되었습니다');
        // await ApiPost('api_v1/service/events/comment', data);
        // getCommentInfo();
    };

    const deleteComment = (modelId, deleteOccurDate, deleteRegday) => {
        const data = {
            data: {
                "modelId": modelId,
                "occurDate": deleteOccurDate,
                "regday": deleteRegday
            }
        };
        alert('코멘트가 삭제되었습니다');

        // await ApiDelete('api_v1/service/events/comment', data);
        // getCommentInfo();
    };

    useEffect(() => {
        getTop3Info();
        getLikeInfo();
        getCommentInfo();
    }, []);

    const getGraphInTabTag = (tagLst, type) => {
        const result = [];
        for (let i = 0; i < tagLst.length; i++) {
            result.push(
                <li key={i}>
                    <div className="small_graph">
                        <BokehChart
                            uid={`event_${type}_${i}`}
                            graphURN={`api_v1/service/tags/graph?width=${tagWidth}&height=${tagHeight}&tagName=${tagLst[i]}&time=${props.occurDate}&before=${before}&after=${after}&num=${i}`}
                            type={'eventModalsub'}
                            index={i}
                        />
                    </div>
                </li>
            );
        }
        return result;
    }

    const getGraphInTabLike = (lst, type) => {
        const result = [];
        for (let i = 0; i < lst.length; i++) {
            result.push(
                <li key={i}>
                    <div className="small_graph">
                        <BokehChart
                            uid={`event_${type}_${i}`}
                            graphURN={`api_v1/service/tags/graph?width=${tagWidth}&height=${tagHeight}&tagName=${lst[i]}&time=${props.occurDate}&before=${before}&after=${after}&num=${i}`}
                            type={'eventModalsub2'}
                            index={i}
                        />
                    </div>
                </li>
            );
        }
        return result;
    }

    const getGraphInfoTab = (tagLst, anomalyLst) => {
        const result = [];
        for (let i = 0; i < tagLst.length; i++) {

            result.push(
                <li key={i}>
                    <div className="left_content">
                        <p className="title">{tagLst[i]}</p>
                        <div className="sub_data">
                            <span>Anomoly Score</span>
                            <span className="dot">{anomalyLst[i]}</span>
                        </div>
                    </div>
                </li>
            );
        }
        return result;
    }

    const getCommentInTab = (commentLst) => {
        // console.log(commentLst);

        let result = [];

        for (let i = 0; i < commentLst.length; i++) {
            if (commentLst[i].userCheck === true) {
                result.push(
                    <li key={i}>
                        <div className="user_line">
                            <span className="date">{commentLst[i].regday}</span>
                            <span className="user">{commentLst[i].name}</span>
                        </div>
                        <div className="com_wrap">
                            <EditInput
                                defaultVal={commentLst[i].content}
                                updateUrl={'api_v1/service/events/comment'}
                                data={{
                                    "modelId": props.modelId,
                                    "occurDate": props.occurDate,
                                    "regday": commentLst[i].regday
                                }}
                            />
                            <button className="del" onClick={() => {
                                Onpop(!popStauts)
                                deleteComment(props.modelId, props.occurDate, commentLst[i].regday);
                            }
                            } />
                        </div>
                    </li>
                );
            } else {
                result.push(
                    <li>
                        <div className="user_line">
                            <span className="date">{commentLst[i].regday}</span>
                            <span className="user">{commentLst[i].name}</span>
                        </div>
                        <div className="com_wrap">
                            <p>{commentLst[i].content}</p>
                        </div>
                    </li>
                );
            }
        }
        return result;
    }

    return (
        <div className="modal_container" style={{ display: props.changeModal ? "flex" : "none" }}>
            {modalStatus && <ModalModel changeModal={changeModelModal} modelId={modalId} modelName={props.selectModel} />}
            <div className="modal">
                <div className="modal_header">
                    <p>Event 상세보기</p>
                    <button onClick={() => {
                        props.changeModal(false);
                        if (props.tableUpdate) props.tableUpdate();
                    }}></button>
                </div>
                <div className="modal_contents">
                    <div className="modal_title">
                        <div className="left_wrap">
                            <p>{props.selectModel}</p>
                            <a onClick={() => {
                                changeModelModal(true);
                                setModalId(props.modelId);
                                setModalName(props.selectModel);
                            }}>모델 관리로 이동</a>
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
                        <div className="graph_subsc">
                            <p><span className="th"></span>threshold</p>
                            <p><span className="li"></span>이상탐지</p>
                        </div>
                        <BokehChart
                            uid={'event_' + props.selectModel}
                            graphURN={`api_v1/service/events/graph?width=${modelWidth}&height=${modelHeight}&time=${props.occurDate}&before=${before}&after=${after}&modelName=${props.selectModel}`}
                            type={'eventModal'}
                        />
                    </div>

                    <div className="modal_tab">
                        <ul className="tab_btn_evts">
                            <li className="active" onClick={e => changeTab(e, "graph")}>Top3</li>
                            <li onClick={e => changeTab(e, "fav_graph")}>즐겨찾기</li>
                            <li onClick={e => changeTab(e, "comment")}>코멘트</li>
                        </ul>

                        <div className="modal_tab_contents">
                            <div className="tab_contents_evts graph_wrap active">
                                {/* TOP3 그래프 */}
                                <div id="graph" className="graph__">
                                    {getGraphInfoTab(tagTop3List, anomalyTop3List) !== ''
                                        ? <>
                                            <ul className="str_list">
                                                {getGraphInfoTab(tagTop3List, anomalyTop3List)}
                                            </ul>
                                            <ul className="left_name_list">
                                                {getGraphInTabTag(tagTop3List, 'top')}
                                            </ul>
                                        </>
                                        : <NoneData isFull={false} width={"100%"} height={"270px"} />
                                    }
                                </div>
                                {/* 즐겨찾기 그래프 */}
                                <div id="fav_graph" className="graph__ sp_type">
                                    {getGraphInfoTab(tagLikeList, anomalyLikeList) !== ''
                                        ? <>
                                            <ul className="str_list favorite_list">
                                                {getGraphInfoTab(tagLikeList, anomalyLikeList)}
                                            </ul>
                                            <ul className="left_name_list" id="fav_graph">
                                                {getGraphInTabLike(tagLikeList, 'like')}
                                            </ul>
                                        </>
                                        : <NoneData isFull={false} width={"100%"} height={"270px"} />
                                    }
                                </div>
                            </div>

                            <div className="comment tab_contents_evts" id="comment">
                                <div className="tab_inner_comment">
                                    <div className="input_wrap">
                                        <input type="text" defaultValue={contentReg} placeholder="코멘트 입력"
                                            onChange={(e) => setContentReg(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    postComment(props.modelId, props.occurDate, contentReg);
                                                    setContentReg('');
                                                }
                                            }} />
                                        <button onClick={() => {
                                            postComment(props.modelId, props.occurDate, contentReg);
                                            setContentReg('');
                                        }}>코멘트 작성</button>
                                    </div>
                                    <ul className="comment_list">
                                        {getCommentInTab(comment)}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="button_wrap">
                    <button onClick={() => {
                        props.changeModal(false);
                        if (props.tableUpdate) props.tableUpdate();
                    }
                    } className="save_btn">닫기</button>
                </div>
            </div>
        </div>
    );
}