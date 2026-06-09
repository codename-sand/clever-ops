/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import "@assets/scss/models.scss";
import { useNavigate } from "react-router-dom";
import { ApiGet, GetStore } from "@services";
import { Pagination, ModalModel, SelectBox, Switch, Search, Reset } from "@components";

//datas
import modelSelectListData from "../_apiDatas/models/modelSelectList.json";
import modelListData from "../_apiDatas/models/modelListData.json"

export const Models = () => {
    const navigate = useNavigate();
    const getStore = GetStore("user", "usefavorite");

    // Modal On-Off
    const [modalStatus, onModals] = useState(false);
    const changeModal = (val) => onModals(val);

    const [flag, setFlag] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalData, setTotalData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    // Page
    const [pageSize, setPageSize] = useState(10);

    // Event value
    const [like, setLike] = useState('');
    const [modelName, setModelName] = useState('');
    const [modelType, setModelType] = useState('');
    const [modelStatus, setModelStatus] = useState('');
    const [tagName, setTagName] = useState('');
    const [description, setDescription] = useState('');

    // Select List
    const [modelList, setModelList] = useState([]);
    const statusList = [{ name: 'On', value: true }, { name: 'Off', value: false }];
    const [typeList, setTypeList] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [modalId, setModalId] = useState('');
    const [modalName, setModalName] = useState('');

    // Description
    const [value, setValue] = useState();
    const [resetIs, setResetIs] = useState(false);

    const chunk = (data = [], size = 1) => { //paging 
        const arr = [];
                  
        for (let i = 0; i < data.length; i += size) {
            arr.push(data.slice(i, i + size));
        }
        
        return arr;
    };

    const getTblData = async () => {
        // let offValue = pageSize * (currentPage - 1);

        // let totalCount = await ApiGet(`api_v1/service/models/listCount?modelName=${modelName}&modelStatus=${modelStatus}&modelType=${modelType}&tagName=${tagName}&description=${description}&like=${like}`, navigate);
        let totalCount = {
            // "modelTotal": 1390,
            "modelTotal": 300,
            "code": 200
        };
        totalCount.code === 200 ? setTotalCount(totalCount.modelTotal) : console.log("err >>", totalCount);

        // let response = await ApiGet(`api_v1/service/models/listInfo?modelName=${modelName}&modelStatus=${modelStatus}&modelType=${modelType}&tagName=${tagName}&description=${description}&like=${like}&offset=${offValue}&limit=${pageSize}`, navigate);
        let response = modelListData;
        const slicePage = chunk(response.modelList, pageSize - 1); //기본 10페이지씩
        const searchModelName = response.modelList.filter(list => list['modelname'] === modelName);
        const totalDatas = modelName !== '' ? searchModelName : slicePage[currentPage];
        
        setTotalData(totalDatas);
        // response.code === 200 ? setTotalData(response.modelList) : console.log("err >>", response);
    }

    useEffect(() => {
        getTblData();
    }, [pageSize, currentPage, flag]);

    useEffect(() => {
        getStore ? setLike("true") : setLike('');
        setFlag(true);
        setResetIs(false);
    }, [getStore]);

    const getSelectData = async () => {
        // let response = await ApiGet(`api_v1/service/models/selectList?modelName=${modelName}&modelstatus=${modelStatus}&modelType=${modelType}&tagName=${tagName}&description=${description}&like=${like}`, navigate);
        let response = modelSelectListData;

        if (response.code === 200) {
            setModelList(response.modelname);
            setTagList(response.tagname);
            setTypeList(response.type);
            setFlag(false);
            setResetIs(false);
        } else console.log("err >>", response);
    };

    const onReset = () => {
        setModelName('');
        setModelType('');
        setModelStatus('');
        setTagName('');
        setDescription('');
        setResetIs(true);
        setFlag(true);
    };

    useEffect(() => {
        if (flag) getSelectData();
    }, [flag]);

    return (
        <div className="sub_tables">
            {modalStatus && <ModalModel changeModal={changeModal} modelId={modalId} modelName={modalName} tableUpdate={getTblData} />}
            <div className="filter_wrap">
                <Reset onClickMethod={onReset} />
                <SelectBox label="모델명" innerList={modelList} handleColume={setModelName} handleFlag={setFlag} handlePage={setCurrentPage} addWidth={true} noneIs={true} reset={resetIs} />
                <SelectBox label="모델 타입" innerList={typeList} handleColume={setModelType} handleFlag={setFlag} handlePage={setCurrentPage} noneIs={true} reset={resetIs} />
                <SelectBox label="모델 동작" innerList={statusList} handleColume={setModelStatus} handleFlag={setFlag} handlePage={setCurrentPage} noneIs={true} reset={resetIs} />
                <SelectBox label="태그명" innerList={tagList} handleColume={setTagName} handleFlag={setFlag} handlePage={setCurrentPage} addWidth={true} noneIs={true} reset={resetIs} />
                <Search inputValue={value} handleInput={setValue} handleColume={setDescription} handleFlag={setFlag} handlePage={setCurrentPage} />
            </div>
            <ul className="model_table sub_table">
                <li className="table_head">
                    <p>모델명</p>
                    <p>모델타입</p>
                    <p>모델동작</p>
                    <p>Threshold</p>
                    <p>이상 탐지</p>
                    <p>관련 태그</p>
                    <p>설명</p>
                </li>
                {totalData && totalData.map((item) => {
                    return (
                        <li key={item.id}>
                            <p  className="clk_tag" 
                                onClick={() => {
                                    onModals(!modalStatus);
                                    setModalId(item.id);
                                    setModalName(item.modelname);
                            }}>{item.modelname}</p>
                            <p>{item.type}</p>
                            <p className="switch_wrap"><Switch status={item.modelstatus} selectModel={item.id} /></p>
                            <p>{item.threshold}</p>
                            <p>{item.anomal_cnt}</p>
                            <p>{item.tagcnt}</p>
                            <p>{item.description}</p>
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
            />
        </div>
    );
}