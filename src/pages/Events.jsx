/* eslint-disable react-hooks/exhaustive-deps */
import { React, useState, useEffect } from "react";
import { ApiGet, GetStore } from "@services";
import { useNavigate } from "react-router-dom";
import "@assets/scss/events.scss";
import moment from "moment";
import { Pagination, ModalEvent, SelectBox, CalendarView, Search, Reset } from "@components";


//data
import eventListData from '../_apiDatas/events/eventList.json';
import eventSelectListData from "../_apiDatas/events/eventSelectList.json"

export const Events = () => {
    const today_date = new Date();
    const start_date = new Date();
    start_date.setDate(today_date.getDate() - 2)
    const getStore = GetStore("user", "usefavorite");

    // Modal On-Off
    const navigate = useNavigate();
    const [modalStatus, showModals] = useState(false);
    const changeModal = (val) => showModals(val);

    const [flag, setFlag] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalData, setTotalData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [resetIs, setResetIs] = useState(false);

    // Event List
    const [like, setLike] = useState(getStore ? String(getStore) : '');
    const [startOccurDate, setStartOccurDate] = useState(moment(start_date).format('YYYY-MM-DD'));
    const [endOccurDate, setEndOccurDate] = useState(moment(today_date).format('YYYY-MM-DD') + " 23:59:59")
    const [tagName, setTagName] = useState('');
    const [modelValue, setModelName] = useState('');
    const [modelType, setModelType] = useState('');
    const [content, setContent] = useState('');

    // Description
    const [value, setValue] = useState();

    // Event Select List
    const [tagList, setTagList] = useState([]);
    const [modelList, setModelList] = useState([]);
    const typeList = ['nadia', 'rule'];
    // Modal 
    const [modalName, setModalName] = useState('');
    const [modalId, setModalId] = useState('');
    const [modalDate, setDate] = useState('');

    // Page
    const [pageSize, setPageSize] = useState(10);
    
    const chunk = (data = [], size = 1) => { //paging 
        const arr = [];
                  
        for (let i = 0; i < data.length; i += size) {
            arr.push(data.slice(i, i + size));
        }
        
        return arr;
    };

    const getEventData = async () => {
        // let resTotalCount = await ApiGet(`api_v1/service/events/listCount?tagName=${tagName}&modelName=${modelValue}&startOccurDate=${startOccurDate}&endOccurDate=${endOccurDate}&content=${content}&like=${like}&modelType=${modelType}`, navigate);
        // resTotalCount.code === 200 ? setTotalCount(resTotalCount.eventTotal) : console.log("err >>", resTotalCount);
        let resTotalCount = {
            "eventTotal": 300,
            // "eventTotal": 9920030,
            "code": 200
        };
        resTotalCount.code === 200 ? setTotalCount(resTotalCount.eventTotal) : console.log("err >>", resTotalCount);

        // let offValue = pageSize * (currentPage - 1);
        // let response = await ApiGet(`api_v1/service/events/listInfo?limit=${300}&offset=${offValue}&tagName=${tagName}&modelName=${modelValue}&startOccurDate=${startOccurDate}&endOccurDate=${endOccurDate}&content=${content}&like=${like}&modelType=${modelType}`, navigate);
        
        let response = eventListData;
        // response.code === 200 ? setTotalData(response.eventList) : console.log("err >>", response);
        const slicePage = chunk(response.eventList, pageSize - 1); //기본 10페이지씩
        const searchModelType = response.eventList.filter(list => list['type'].includes(modelType));
        const totalDatas = modelType !== '' ? chunk(searchModelType, pageSize - 1)[currentPage] : slicePage[currentPage];

        setTotalData(totalDatas);
    }

    useEffect(() => {
        getEventData();
    }, [pageSize, currentPage, flag]);

    useEffect(() => {
        getStore ? setLike("true") : setLike('');
        setFlag(true);
        setResetIs(false);
    }, [getStore]);


    const getSelectData = async () => {
        // let response = await ApiGet(`api_v1/service/events/selectList?tagName=${tagName}&modelName=${modelValue}&startOccurDate=${startOccurDate}&endOccurDate=${endOccurDate}&like=${like}&modelType=${modelType}&content=${content}`, navigate);
        let response = eventSelectListData;

        if (response.code === 200) {
            setTagList(response.tagname);
            setModelList(response.modelname);
            setFlag(false);
            setResetIs(false);
        } else console.log("err >>", response);
    }

    useEffect(() => {
        if (flag) getSelectData()
    }, [flag]);

    const onReset = () => {
        setStartOccurDate(moment(start_date).format('YYYY-MM-DD'));
        setEndOccurDate(moment(today_date).format('YYYY-MM-DD') + " 23:59:59");
        setTagName('');
        setModelType('');
        setModelName('');
        setContent('');
        setFlag(true);
        setValue('');
        setResetIs(true);
    }

    return (
        <div className="sub_tables">
            {modalStatus && <ModalEvent changeModal={changeModal} selectModel={modalName} occurDate={modalDate} modelId={modalId} tableUpdate={getEventData}/>}
            <div className="filter_wrap">
                <Reset onClickMethod={onReset} />
                <CalendarView startDate={startOccurDate} endDate={endOccurDate} handleStartDate={setStartOccurDate} handleEndDate={setEndOccurDate} handleFlag={setFlag} handlePage={setCurrentPage} />
                <SelectBox label="모델 타입" innerList={typeList} handleColume={setModelType} handleFlag={setFlag} handlePage={setCurrentPage} noneIs={true} reset={resetIs}/>
                <SelectBox label="연관모델" innerList={modelList} handleColume={setModelName} handleFlag={setFlag} handlePage={setCurrentPage} noneIs={true} reset={resetIs}/>
                <SelectBox label="태그명" innerList={tagList} handleColume={setTagName} handleFlag={setFlag} handlePage={setCurrentPage} noneIs={true} reset={resetIs}/>
                <Search inputValue={value} handleInput={setValue} handleColume={setContent} handleFlag={setFlag} handlePage={setCurrentPage} />
            </div>
            <ul className="evt_table sub_table">
                <li className="table_head">
                    <p>발생일시</p>
                    <p>모델타입</p>
                    <p>이벤트 발생 모델명</p>
                    <p>코멘트</p>
                </li>
                {totalData && totalData.map((item, index) => {
                    return (
                        <li key={index}>
                            <p>{item.occur_date}</p>
                            <p>{item.type}</p>
                            <p  className="clk_tag" 
                                onClick={() => {
                                    showModals(!modalStatus);
                                    setModalName(item.modelname);
                                    setDate(item.occur_date);
                                    setModalId(item.id);
                            }}>{item.modelname}</p>
                            <p>{item.content}</p>
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