import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@assets/scss/setting.scss";
import { GlobalPopup, FileUpload, Loading, SelectBox } from "@components";
import { ApiGet, ApiPost, ApiPut } from "@services";
import { StatusStart, StatusStop } from "@assets/img";

//data
import modelpackInfo from "../../_apiDatas/settings/modelpackInfo.json";
import selectThresholdInfo from "../../_apiDatas/settings/selectThresholdInfo.json";

export const ModelUpdate = () => {
    // popup On-Off
    const [popups, showPopup] = useState(false);
    // globalPopup에서 전달받은 값
    const setPopupStatus = (childVal) => showPopup(childVal);
    // 클릭된 모델명 저장
    const [modelName, setModelName] = useState(null);
    // 팝업 내용
    const [checkModel, setCheckModel] = useState(``); 
    // 오토튜닝 시간세팅
    const [period, setPeriod] = useState(0);
    const autoTuneLists = [
        {
            name: "1시간",
            value: 1
        },
        {
            name: "6시간",
            value: 6
        },
        {
            name: "24시간",
            value: 24
        },
    ];

    const [autoTuneTime, setAutoTime] = useState(); //res['thresholdUpdate'][0]['value']
    const [startTime, setStartTime] = useState(); //res['thresholdUpdate'][0]['reg_day']
    const [endTime, setEndTime] = useState(); //res['thresholdUpdate'][0]['end_day']
    const [autoBtnStatus, setAutoBtns] = useState(); //버튼,시작-종료시간 노출 여부
    const [selectLabel, setLabel] = useState('시간 선택'); //label값

    useEffect(() => {
        getModelInfo();
        getAutoTuneData();
    }, []);

    // popup 전달용 모델명
    const changeModel = (curName) => {
        setModelName(curName)
        // 팝업 내용 지정 & 띄우기
        setCheckModel(curName + " 모델로 교체하시겠습니까?");
        showPopup(!popups);
    };

    // 모델 파일 업데이트
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(false);
    const uploadModel = async (e) => {
        e.preventDefault();
        const header = {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        };

        if (file) {
            setProgress(true);
            const formData = new FormData();
            formData.append("file", file);

            console.log(formData , header)
            
            // let res = await ApiPost('api_v1/system/settings/uploadFile', formData, header);
            // if (res.code === 200) getModelInfo();
            // else if(res.code === 201 || res.code === 400)   window.alert(res.msg);
            // else   console.log('err >> MODEL UPDATE');
            setProgress(false);
        }
    };

    // 업데이트 이력
    const navigate = useNavigate();
    const [modelInfo, setModelInfo] = useState([]);
    const [curVersion, setCurVersion] = useState(null);

    const getModelInfo = async () => {
        // let res = await ApiGet(`api_v1/system/settings/modelPack`, navigate);
        let res = modelpackInfo;
        if (res.code === 200) {
            setModelInfo(res.modelStatus);
            res.modelStatus.map((item, index) => {
                if(item.is_current) setCurVersion(item.version);
            });
        }
        setModelName(null);
    };

    const changeCurModel = async () => {
        setProgress(true);
        // const response = await ApiPut(`api_v1/system/settings/modelPack?version=${modelName}`, navigate);
        const response = {"code": 200};
        if (response.code === 200) getModelInfo();
        setProgress(false);
    };

    const setAutoTune = async (stopIs) => { //오토튜닝 시간 설정 
        if(stopIs !== (null || undefined)) setPeriod(0);

        // const res = await ApiPut(`api_v1/system/settings/thresholdPeriod?period=${period}`, navigate);
        const res = {"code": 200};

        if (res.code === 200 && period !== 0) {
            getAutoTuneData(); //getApi 재호출
            setAutoBtns('stop'); //상태변경
            setAutoTime(period);
            alert('오토튜닝 시간이 설정되었습니다');
        }else if(res.code === 200 && period === 0){
            setAutoBtns('start');//상태변경
            setAutoTime('0');//오토튜닝중지
            alert('오토튜닝이 정지되었습니다');
        }
        else console.log(res);
    };

    useEffect(() => {
        const status = autoTuneTime === '0' ? 'start' : 'stop';
        setAutoBtns(status);
        setLabel(autoTuneTime !== '0' && autoTuneTime !== undefined ? autoTuneTime +'시간' : '시간 선택');
    },[autoTuneTime]);

    const getAutoTuneData = async () => {
        // const res = await ApiGet(`api_v1/system/settings/selectThresholdInfo`, navigate);
        const res = selectThresholdInfo;
        setAutoTime(res['thresholdUpdate'][0]['value']);
        setStartTime(res['thresholdUpdate'][0]['reg_day']);
        setEndTime(res['thresholdUpdate'][0]['end_day']);
    }

    return (
        <>
            {popups && <GlobalPopup innerText={checkModel} btnType={"all"} isShow={setPopupStatus} isConfirmResult={changeCurModel} />}
            <div className="setting_page">
                <p className="setting_title">모델 업데이트</p>
                <div className="info_line">
                    <p className="sub_title">현재 버전</p>
                    <p className="result">{curVersion}</p>
                </div>
                <div className="info_line">
                    <p className="sub_title">모델 업데이트</p>
                    {progress && <Loading isFull={true} width={"100%"} height={"100%"} bg={false}/> }
                    <div className="result">
                        <form style={{display:'flex',alignItems:'end'}}>
                            <FileUpload setFile={setFile} />
                            <button className="update" onClick={uploadModel}>모델 업데이트</button>
                        </form>
                    </div>
                </div>
                <div className="info_line">
                    <p className="sub_title">오토 튜닝</p>
                    <div className="result">
                        <SelectBox innerList={autoTuneLists} handleValue={setPeriod} label={selectLabel} disabledIs={autoBtnStatus === 'start' ? true : false}/>
                        <button className="action_btn start_btn" onClick={setAutoTune} disabled={autoBtnStatus === 'start' ? false : true}>시작</button>
                        <button className="action_btn end_btn" onClick={() => setAutoTune('0')} disabled={autoBtnStatus === 'stop' ? false : true}>정지</button>
                    </div>
                </div>
                <p className="status_desc" style={{marginLeft:'110px',marginTop:'-15px'}}>
                    ※ 오토튜닝 상태 :ㅤ{autoBtnStatus === 'stop' ? 
                                    <>
                                        <StatusStart /> 동작중 &#40;Started&#41;ㅤ</> : <><StatusStop /> 정지 &#40;Stopped&#41; 
                                    </>}
                    {autoBtnStatus === 'stop' && <><span>&#40;ㅤ시작 : {startTime}</span>ㅤ~ㅤ<span>종료 : {endTime}ㅤ&#41;</span></>}
                </p>

                <div className="line"></div>
                <div className="info_line">
                    <p className="sub_title">업데이트 이력</p>
                    <div className="result">
                        <ul className="system_table update_table">
                            <li className="system_header">
                                <p>업데이트 시간</p>
                                <p>모델팩</p>
                                <p>모델교체</p>
                            </li>
                            {modelInfo && modelInfo.map((item, index) => {
                                // current model 추가
                                const addCls = item.is_current ? "active" : "";

                                return (
                                    <li key={index} className="result_list">
                                        <p>{item.reg_day}</p>
                                        <p className={addCls}>{item.version}</p>
                                        <p>
                                            <button
                                                className={addCls}
                                                onClick={() => changeModel(item.version)}>모델교체</button>
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                        <p className="notice_text">모델이 교체되면 이전에 실행 및 탐지 중인 모델은 중지됩니다.</p>
                    </div>

                </div>
            </div>
        </>
    )
}