/* eslint-disable react-hooks/exhaustive-deps */
import { apiPromiseGet } from "@services";
import { embedHtml, getBokehElements, updateCDS, strftimeNow } from "@utils"
import { useNavigate } from "react-router-dom";
import { Loading } from "@components";
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { data } from "jquery";

//data
import graphData1 from "../../_apiDatas/dashboard/tabGraph/graph1.json";
import graphData2 from "../../_apiDatas/dashboard/tabGraph/graph2.json";
import graphData3 from "../../_apiDatas/dashboard/tabGraph/graph3.json";


// 필요한 인자)
// 정적 차트 : uid, graphURN
// 동적 차트 : uid, chartName, graphURN, dataURN, startTime, delayTime, cmpKey
export const TabChart = ({ uid, chartName, eventName, graphURN, newData, newEventData, startTime, delayTime, cmpKey, widgetIndex, tabId }) => {
  const divId = uid.replaceAll('#', '').replaceAll(' ', '_').replaceAll('.', '_');
  const [flag, setFlag] = useState(0);
  const [chartCDS, setChartCDS] = useState([]);
  const [eventCDS, setEventCDS] = useState([]);
  const navigate = useNavigate();

  let last_time;

  const loading = renderToStaticMarkup(<Loading isFull={false} width={"100%"} height={"234px"} bg={false} />);

  // 차트 그리기
  const drawBokehChart = (data) => {
    // embedHtml(divId, data);
    // const graphItem = tabId === 1 ? graphData1 : graphData2;

    let graphItem;
    if (tabId === 1) graphItem = graphData1;
    else if (tabId === 2) graphItem = graphData2;
    else graphItem = graphData3;

    const innerData = graphItem['data'][widgetIndex];
    embedHtml(divId, innerData);
    setFlag(prev => prev + 1);
  };

  // 차트 CDS 얻기(찾기)
  const getCDS = () => {
    let tmp = getBokehElements(chartName);
    let tmp2;
    if (eventName !== undefined) tmp2 = getBokehElements(eventName);

    if (eventName !== undefined && tmp.length !== 0 && tmp2.length !== 0) {
      setChartCDS(tmp);
      setEventCDS(tmp2);
    } else if (eventName === undefined && tmp.length !== 0) {
      setChartCDS(tmp);
    } else
      setFlag(prev => prev + 1);
  };

  // API를 통해 데이터를 가져와 CDS 세팅
  const updateData = () => {
    updateCDS(chartCDS[chartCDS.length - 1], newData, cmpKey);
    // if (eventName !== undefined) updateCDS(eventCDS[eventCDS.length - 1], newEventData, cmpKey);
  };

  const initCDS = (target) => {
    for (let key in target.data) {
      target.data[key] = [];
    }
  };

  // 차트 초기 데이터 세팅(차트 데이터 초기화)
  const initData = async () => {
    initCDS(chartCDS[chartCDS.length - 1]);
    if (eventName !== undefined) initCDS(eventCDS[eventCDS.length - 1]);
    updateData(startTime);
    last_time = strftimeNow();

    if (flag >= 0)
      setFlag(prev => prev * -1);
  };

  // 순서) 1. drawBokehChart > 2-1. 정적 차트인지 확인 > 2-2. getCDS  > 3. initData > 4. polling&update
  // 1
  useEffect(() => {
    embedHtml(divId, loading);
    drawBokehChart(); //bokeh dom 생성
    // apiPromiseGet(graphURN, drawBokehChart, navigate, widget_index);
  }, [graphURN]);

  useEffect(() => {
    if (flag > 0 && newData !== undefined)   // 2-1 정적 차트는 다음 단계 동작 안함
      getCDS();   // 2-2
  }, [flag]);

  // 3
  useEffect(() => {
    if ((eventName !== undefined && chartCDS.length > 0 && eventCDS.length > 0) || (eventName === undefined && chartCDS.length > 0)) initData();
  }, [chartCDS, eventCDS, startTime]);

  return (
    <div id={divId}>
      <Loading isFull={false} width={"100%"} height={"234px"} bg={false} />
    </div>
  );
}