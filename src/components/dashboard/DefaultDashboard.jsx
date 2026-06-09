import { DashTable, DashEvents, DashService, BokehChart, TabChart } from '@components';
import { React, useState, useEffect } from "react";

//data
import dashService from "../../_apiDatas/dashboard/dashService.json"
import dashTable from "../../_apiDatas/dashboard/dashTable.json"

export const DefaultDashboard = (props) => {
    return (
        <>
            <div className='left_contents'>
                <DashEvents title={"이벤트발생량"}>
                    <BokehChart
                        uid={"chart_event_occurance"} chartName={"eventOccurance"}
                        graphURN={"/api_v1/service/dashboard/eventOccuranceGraph?width=910&height=270"}
                        dataURN={"/api_v1/service/dashboard/eventOccuranceData?"}
                        startTime={props.setTimes.start}
                        delayTime={props.setTimes.delay}
                        cmpKey={"dayTimes"}
                        index={0}
                    />
                </DashEvents>
                <DashTable
                    dataURN={`/api_v1/service/dashboard/recent?limit=${6}&interval=${props.setTimes.defaultT}`}
                    dataKey={"recentEvents"}
                    delayTime={props.setTimes.delay}
                    datas={dashTable['tableData']}
                />
                <DashEvents title={"분당 태그 수신량"}>
                    <BokehChart
                        uid={"chart_tag_reception"} chartName={"tagReception"}
                        graphURN={"/api_v1/service/dashboard/tagReceptionGraph?width=910&height=270"}
                        dataURN={"/api_v1/service/dashboard/tagReceptionData?"}
                        startTime={props.setTimes.start}
                        delayTime={props.setTimes.delay}
                        cmpKey={"dayTimes"}
                        index={1}
                    />
                </DashEvents>
            </div>
            <div className='right_contents'>
                <div className="dash_wrap service">
                    <div className='title_wrap'>
                        <p className='title'>서비스(모듈) 상태</p>
                    </div>
                    <DashService
                        title={'Machine learning'}
                        dataURN={`/api_v1/service/dashboard/statusML`}
                        dataKey={"MLStatus"}
                        startTime={props.setTimes.nowT}		// 현재 시각
                        delayTime={props.setTimes.delay}
                        datas={dashService['Machine learning']}
                    />
                    <DashService
                        title={'Status of Service'}
                        dataURN={`/api_v1/service/dashboard/statusService`}
                        dataKey={"serviceStatus"}
                        startTime={props.setTimes.nowT}		// 현재 시각
                        delayTime={props.setTimes.delay}
                        datas={dashService['Status of Service']}
                    />
                </div>
                <DashEvents title={"AI모델 현황"}>
                    <BokehChart
                        uid={"chart_ai_model"} chartName={"models"}
                        graphURN={"/api_v1/service/dashboard/aiGraph?width=300&height=240"}
                        dataURN={`/api_v1/service/dashboard/aiData?interval=${props.setTimes.defaultT}`}
                        startTime={props.setTimes.nowT}		// 현재 시각
                        delayTime={props.setTimes.delay}
                        cmpKey={"dayTimes"}
                        index={2}
                    />
                </DashEvents>
            </div>
        </>
    );
}