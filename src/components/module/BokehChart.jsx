/* eslint-disable react-hooks/exhaustive-deps */
import { useInterval, ApiGet, apiPromiseGet } from "@services";
import { embedHtml, getBokehElements, updateCDS, strftimeNow } from "@utils"
import { useNavigate } from "react-router-dom";
import { Loading } from "@components";
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server"

//data
import graphData0 from "../../_apiDatas/dashboard/tabGraph/graph0.json";
import mainData from "../../_apiDatas/dashboard/newDatas.json";
import tagModalGraph from "../../_apiDatas/tags/tagModalGraph.json";
import modelModalGraph from "../../_apiDatas/models/modelModalGraph.json";
import eventModalGraph from "../../_apiDatas/events/eventModalGraph.json";
import eventModalSubGraph from "../../_apiDatas/events/eventModalSubGraph.json";
import eventModalFavGraph from "../../_apiDatas/events/eventFavGraph.json";

// 필요한 인자)
// 정적 차트 : uid, graphURN
// 동적 차트 : uid, chartName, graphURN, dataURN, startTime, delayTime, cmpKey
export const BokehChart = ({ uid, chartName, graphURN, dataURN, startTime, delayTime, cmpKey, index, type }) => {
  const divId = uid.replaceAll('#', '').replaceAll(' ', '_').replaceAll('.', '_');
  const [flag, setFlag] = useState(0);
  const [cds, setCDS] = useState([]);
  const navigate = useNavigate();
  let last_time = strftimeNow();

  const loading = renderToStaticMarkup(<Loading isFull={false} width={"100%"} height={"234px"} bg={false} />)

  // 차트 그리기
  const drawBokehChart = (data) => {
    // embedHtml(divId, data);
    let innerData;

    if(type === 'tagModal'){
      innerData = tagModalGraph['graph'];
    }else if (type === 'modelModal'){
      innerData = modelModalGraph['graph'];
    }else if (type === 'eventModal'){
      innerData = eventModalGraph['graph'];
    }else if (type === 'eventModalsub'){
      innerData = eventModalSubGraph['graph'][index];
    }else if (type === 'eventModalsub2'){
      innerData = eventModalFavGraph['graph'][index];
    }else{
      innerData = graphData0['data'][index];
    }

    embedHtml(divId, innerData);
    setFlag(prev => prev + 1);
  };

  // 차트 CDS 얻기(찾기)
  const getCDS = () => {
    let tmp = getBokehElements(chartName);
    if (tmp.length !== 0)
      setCDS(tmp);
    else
      setFlag(prev => prev + 1);
  };

  // API를 통해 데이터를 가져와 CDS 세팅
  const updateData = async (time) => {
    // const url = `${dataURN}&time=${time}`;
    // let new_data = await ApiGet(url, navigate);
    // updateCDS(cds[cds.length-1], new_data, cmpKey);

    /**
     * time 
     * [0] 2023-07-19 14:19:28
     * [1] 2023-07-19 13:19:28
     * [2] 2023-07-19 13:19:28
     */
    
    /***
     * url
     * [0] /api_v1/service/dashboard/aiData?interval=1&time=2023-07-19 14:19:28
     * [1]/api_v1/service/dashboard/tagReceptionData?&time=2023-07-19 13:20:20
     * [2]/api_v1/service/dashboard/eventOccuranceData?&time=2023-07-19 13:20:20
     */

    let new_data = mainData['newData'][index];

    updateCDS(cds[cds.length-1], new_data, cmpKey);
  };

  const initCDS = (target) => {
    for (let key in target.data) {
      target.data[key] = [];
    }
  };

  // 차트 초기 데이터 세팅(차트 데이터 초기화)
  const initData = async () => {
    initCDS(cds[cds.length - 1]);
    updateData(startTime);
    last_time = strftimeNow();
    if (flag >= 0)
      setFlag(prev => prev * -1);
  };

  // 순서) 1. drawBokehChart > 2-1. 정적 차트인지 확인 > 2-2. getCDS  > 3. initData > 4. polling&update
  // 1
  useEffect(() => {
    embedHtml(divId, loading);
    drawBokehChart();
    // apiPromiseGet(graphURN, drawBokehChart, navigate);
  }, [graphURN]);

  useEffect(() => {
    if (flag > 0 && dataURN !== undefined)   // 2-1 정적 차트는 다음 단계 동작 안함
      getCDS();   // 2-2
  }, [flag]);

  // 3
  useEffect(() => {
    if (cds.length > 0) {
      initData();
    }
  }, [cds, startTime]);

  // 4. 데이터 polling 하여 차트 데이터 갱신

  // useInterval(async () => {
  //   if (cds.length > 0 && flag < 0) {
  //     updateData(last_time);
  //     last_time = strftimeNow();
  //   }
  // }, delayTime);


  return (
    <div id={divId}>
      <Loading isFull={false} width={"100%"} height={"234px"} bg={false} />
    </div>
  )
}
