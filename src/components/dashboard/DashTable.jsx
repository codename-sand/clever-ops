import { useState, useEffect } from "react";
import { useInterval } from "@services";
import { NoneData } from "@components";
import { updateAPIData, strftimeNow } from '@utils';
import { ModalEvent } from "@components";
import "@assets/scss/dashboard.scss";


export const DashTable = ({ dataURN, dataKey, delayTime , datas }) => {
    // Modal
    const [modalStatus , showModals] = useState(false);
    const changeModal = (val) => showModals(val);
    const [modalData, setModalData] = useState({});

    // Data
    const [data, setData] = useState(datas); 
    const [lastTime, setLastTime] = useState(strftimeNow());

    const tableList = data.map((item, index) => {
        return (
            <li className='table_insert' key={index}>
                <p>{item.date}</p>
                <p onClick={() => {
                    showModals(!modalStatus);
                    setModalData((prev) => {
                        return {
                            ...prev,
                            occurDate: item.date,
                            modelId: item.modelId,
                            modelName: item.modelName,
                        }
                    });
                }}>{item.modelName}</p>
                <p>{item.tagName}</p>
                <p>{item.comment}</p>
            </li>
        );
    });

    // init data
    // useEffect(() => {
    //     const url = `${dataURN}&time=${lastTime}`
        // updateAPIData(url, data, dataKey, setData);
        // setLastTime(strftimeNow());
    // }, [dataURN]);
    
    // polling data
    // useInterval(async () => {
        // const url = `${dataURN}&time=${lastTime}`
        // updateAPIData(url, data, dataKey, setData);
        // setLastTime(strftimeNow());
    // }, delayTime);

    return (
        <div className='dash_wrap dash_table'>
            {modalStatus && <ModalEvent changeModal={changeModal} selectModel={modalData.modelName} occurDate={modalData.occurDate} modelId={modalData.modelId} />}
            <div className='title_wrap'>
                <p className='title'>최근 이벤트</p>
            </div>
            <ul className='main_table'>
                <li className='table_header'>
                    <p>Date</p>
                    <p>ModelName</p>
                    <p>TagName</p>
                    <p>코멘트</p>
                </li>
                {
                    data.length > 0
                    ? tableList
                    : <NoneData isFull={false} width={"925px"} height={"200px"}/>
                }
            </ul>
        </div>
    )
}
