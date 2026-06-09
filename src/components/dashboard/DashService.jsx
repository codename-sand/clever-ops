import React, { useState, useEffect } from "react";
import { useInterval } from "@services";
import { updateAPIData } from '@utils';
import { StatusStart, StatusStop } from "@assets/img";

// starTime(for reloading)
export const DashService = ({ title, dataURN, dataKey, startTime, delayTime, datas }) => {
    const [data, setData] = useState(datas);

    const tableList = data.map((item, index) => {
        const dotIcons = item.value === "Started" ? <StatusStart/> : <StatusStop/>;
        
        return (
            <li className='table_insert' key={item.key}>
                <p>{item.key}</p>
                <p className={item.value}>
                    {dotIcons}
                    {item.value}
                </p>
            </li>
        );
    });

    // init data
    // useEffect(() => {
        // updateAPIData(dataURN, data, dataKey, setData);
    //   }, [startTime]);
    
    // polling data
    // useInterval(async () => {
        // updateAPIData(dataURN, data, dataKey, setData);
    // }, delayTime);

    return (
        <>
            <p className="dash_middle_title">{title}</p>
            <ul className='main_table service_table'>
                <li className='table_header'>
                    <p>Name</p>
                    <p>Status</p>
                </li>
                {tableList}
            </ul>
        </>
    );
}