/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ApiGet, ApiPost, ApiDelete, GetStore } from "@services";
import { useNavigate } from "react-router-dom";
import "@assets/scss/tags.scss";
import { Pagination, ModalTag, ModalModel, SelectBox, Search, Reset } from "@components";

//data
import tagListData from "../_apiDatas/tags/tagList.json"
import tagSelectList from "../_apiDatas/tags/tagSelectList.json"

export const Tags = () => {
    const navigate = useNavigate();
    const getStore = GetStore("user", "usefavorite");
    const getActive = GetStore("user", "useactive");

    // Modal On-Off
    const [modalTagStatus, OnTagModals] = useState(false);
    const [modalModelStatus, OnModelModals] = useState(false);
    const changeTagModal = (val) => OnTagModals(val);
    const changeModelModal = (val) => OnModelModals(val);

    const [modalName, setModalName] = useState('');
    const [modalId, setModalId] = useState('');
    const [modalModelName, setModalModelName] = useState('');

    const [totalData, setTotalData] = useState([]);
    const [resetIs, setResetIs] = useState(false);

    // Page
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [like, setLike] = useState('');
    const [star, setStar] = useState('');

    // search contents (sorting)
    const [tagName, setTagName] = useState('');
    const [systems, setSystem] = useState('');
    const [equipment, setEquipment] = useState('');
    const [modelValue, setModelName] = useState('');
    const [description, setDescription] = useState('');

    // Tag Select List
    const [tagList, setTagList] = useState([]);
    const [systemList, setSystemList] = useState([]);
    const [equipList, setEquipList] = useState([]);
    const [modelList, setModelList] = useState([]);
    const [value, setValue] = useState();    // Description

    const [flag, setFlag] = useState(true);

    const chunk = (data = [], size = 1) => { //paging 
        const arr = [];
                  
        for (let i = 0; i < data.length; i += size) {
            arr.push(data.slice(i, i + size));
        }
        
        return arr;
    };

    const getTblData = async () => {
        // let offValue = pageSize * (currentPage - 1);

        // let totalCount = await ApiGet(`api_v1/service/tags/listCount?like=${like}&tagName=${tagName}&equipment=${equipment}&system=${systems}&modelName=${modelValue}&description=${description}`, navigate);
        let totalCount = {
            "tagList": 300,
            "code": 200
        };

        totalCount.code === 200 ? setTotalCount(totalCount.tagList): console.log("err >>", totalCount);

        // let response = await ApiGet(`api_v1/service/tags/listInfo?limit=${pageSize}&offset=${offValue}&like=${like}&tagName=${tagName}&equipment=${equipment}&system=${systems}&modelName=${modelValue}&description=${description}`, navigate);
        
        let response = tagListData;
        // if (response.code === 200) {
            const slicePage = chunk(response.tagList, pageSize - 1);
            const searchTagName = response.tagList.filter(list => tagName === list['name']);
            const totalDatas = tagName !== '' ? searchTagName : slicePage[currentPage];

            // for (let i = 0; i < response.tagList.length; i++) response.tagList[i].like === "true" ? response.tagList[i].like = 'active' : response.tagList[i].like = null;

            setTotalData(totalDatas);
        // } else console.log("err >>", response);
    }

    useEffect(() => {
        getTblData()
    }, [pageSize, currentPage, flag]);

    useEffect(() => {
        if (getStore) {
            setLike("true");
            setStar("active");
        } else {
            setLike('');
            setStar('');
        }
        setFlag(true);
    }, [getActive])

    const getSelectData = async () => {
        // let url = `api_v1/service/tags/selectList?like=${like}&tagName=${tagName}&equipment=${equipment}&system=${systems}&modelName=${modelValue}&description=${description}`
        // let response = await ApiGet(`api_v1/service/tags/selectList?like=${like}&tagName=${tagName}&equipment=${equipment}&system=${systems}&modelName=${modelValue}&description=${description}`, navigate);

        let response = tagSelectList;

        if (response.code === 200) {
            setTagList(response.tags.tagname);
            setSystemList(response.tags.system);
            setEquipList(response.tags.equipment);
            setModelList(response.tags.modelname);
            setFlag(false);
            setResetIs(false);

        } else console.log("err >>", response);
    }

    useEffect(() => {
        if (flag) getSelectData();
    }, [flag]);

    const onReset = () => {
        setTagName('');
        setSystem('');
        setEquipment('');
        setModelName('');
        setValue('');
        setDescription('');
        setFlag(true);
        setResetIs(true);
    };

    const handleChange = (event) => {
        if (!like) {
            setLike("true")
            setStar("active")
            setCurrentPage(1)
        }
        else {
            setLike('')
            setStar('')
            setCurrentPage(1)
        }
        setFlag(true)
    };

    const handelLikeOn = async (params, e) => {
        // const res = await ApiPost(`api_v1/service/tags/like?tagName=${params}`);
        const res = {"code": 200};
        res.code === 200 ? e.target.className = "all_fav active" : alert("오류 발생");
    }

    const handelLikeOff = async (params, e) => {
        // const res = await ApiDelete(`api_v1/service/tags/like?tagName=${params}`);
        const res = {"code": 200};
        res.code === 200 ? e.target.className = "all_fav null" : alert("오류 발생");
    }

    return (
        <div className="sub_tables">
            {modalTagStatus && <ModalTag changeModal={changeTagModal} tagName={modalName} tableUpdate={getTblData} />}
            {modalModelStatus && <ModalModel changeModal={changeModelModal} modelId={modalId} modelName={modalModelName}/>}
            <div className="filter_wrap">
                <Reset onClickMethod={onReset} />
                <SelectBox label='태그명' innerList={tagList} handleColume={setTagName} handleFlag={setFlag} handlePage={setCurrentPage} addWidth={true} noneIs={true} reset={resetIs} />
                <SelectBox label="설비명" innerList={equipList} handleColume={setEquipment} handleFlag={setFlag} handlePage={setCurrentPage} noneIs={true} reset={resetIs} />
                <SelectBox label="계통명" innerList={systemList} handleColume={setSystem} handleFlag={setFlag} handlePage={setCurrentPage} noneIs={true} reset={resetIs} />
                <SelectBox label="연관 모델" innerList={modelList} handleColume={setModelName} handleFlag={setFlag} handlePage={setCurrentPage} addWidth={true} noneIs={true} reset={resetIs}/>
                <Search inputValue={value} handleInput={setValue} handleColume={setDescription} handleFlag={setFlag} handlePage={setCurrentPage} />
            </div>

            <ul className="tag_table sub_table">
                <li className="table_head">
                    <button className={`all_fav ${star}`} onClick={handleChange}></button>
                    <p>태그명</p>
                    <p>설비명</p>
                    <p>계통명</p>
                    <p>연관 모델</p>
                    <p>설명</p>
                </li>

                {totalData && totalData.map((item, index) => {
                    // 연관모델 리스트 2개 이상이면 more로 표기해야함(class 추가)
                    const addMore = item.model_name.length > 2 ? "more" : "";
                    return (
                        <li key={item.id}>
                            <button 
                                className={`all_fav ${item.like === 'true' ? 'active' : ''}`} 
                                onClick={(e) => e.target.className === "all_fav active" ? handelLikeOff(item.name, e) : handelLikeOn(item.name, e)} />
                            <p className="clk_tag" 
                                onClick={() => {
                                    OnTagModals(!modalTagStatus);
                                    setModalName(item.name);
                                }}
                            >
                                {item.name}
                            </p>
                            <p>{item.equipment}</p>
                            <p>{item.system}</p>
                            <div className={`model_list ${addMore}`}>
                                {item.model_name.map((modelItem, index) => {
                                    return <span 
                                                key={index} 
                                                className="clk_model" 
                                                // onClick={async () => {
                                                //     const modelInfo = await ApiGet(`api_v1/service/models/listInfo?modelName=${modelItem}`, navigate);
                                                //     OnModelModals(!modalModelStatus);
                                                //     setModalId(modelInfo.modelList[0].id);
                                                //     setModalModelName(modelItem)
                                                // }}
                                                onClick={() => {
                                                    // const modelInfo = await ApiGet(`api_v1/service/models/listInfo?modelName=${modelItem}`, navigate);
                                                    OnModelModals(!modalModelStatus);
                                                    // setModalId(modelInfo.modelList[0].id);
                                                    setModalModelName(modelItem)
                                                }}
                                            >{modelItem}</span>;
                                })}
                            </div>
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
};