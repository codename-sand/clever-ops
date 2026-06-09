/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import "@assets/scss/dashboard.scss";
import { SelectBox, DefaultDashboard, CustomDashboard, DashboardTab, Loading } from '@components';
import { updateCDS, strftimeNow, strftime } from "@utils"
import { WidgetModal } from "@components";
import { useDispatch } from 'react-redux';
import { ApiGet, GetStore, setDefaultTime, SetStore } from "@services";
import { useNavigate, useLocation } from "react-router-dom";

//datas
import tabListData from "../_apiDatas/dashboard/tabList.json" //탭 리스트
import tagSelectList from "../_apiDatas/dashboard/tagSelectList.json" 
import modelSelectList from "../_apiDatas/dashboard/modelSelectList.json" 
import widgetListData from "../_apiDatas/dashboard/widgetList.json" // 전체위젯리스트

import tabTagData1 from "../_apiDatas/dashboard/tabTagData.json" // 탭1번 태그데이터
import tabTagData2 from "../_apiDatas/dashboard/tabTagData2.json" // 탭2번 태그데이터
import tabTagData3 from "../_apiDatas/dashboard/tabTagData3.json" // 탭3번 태그데이터

import tabModelData1 from "../_apiDatas/dashboard/tabModelData.json" // 탭1번 모델데이터
import tabModelData2 from "../_apiDatas/dashboard/tabModelData2.json" // 탭2번 모델데이터
import tabModelData3 from "../_apiDatas/dashboard/tabModelData3.json" // 탭3번 모델데이터

import tabTagDataEvt1 from "../_apiDatas/dashboard/tabTagDataEvt.json" // 탭 1번 태그이벤트데이터
import tabTagDataEvt2 from "../_apiDatas/dashboard/tabTagDataEvt2.json" // 탭 2번 태그이벤트데이터
import tabTagDataEvt3 from "../_apiDatas/dashboard/tabTagDataEvt3.json" // 탭 3번 태그이벤트데이터

import tabModelDataEvt1 from "../_apiDatas/dashboard/tabModelDataEvt.json" // 탭 1번 모델이벤트데이터
import tabModelDataEvt2 from "../_apiDatas/dashboard/tabModelDataEvt2.json" // 탭2번 모델이벤트데이터
import tabModelDataEvt3 from "../_apiDatas/dashboard/tabModelDataEvt3.json" // 탭3번 모델이벤트데이터


const recentTime = [
	{ name: "최근1시간", value: "1" },
	{ name: "최근2시간", value: "2" },
	{ name: "최근3시간", value: "3" },
];

const HOUR = 1000 * 60 * 60;
const delayTime = 30000; // msec

export const Dashboard = () => {
	const getDefaultStore = GetStore("user", "defaultTime");
	const [defaultTime, chgDefaultTime] = useState(getDefaultStore); // hour
	const [startTime, setStartTime] = useState(strftime(Date.now() - (HOUR * defaultTime)));
	const [nowTime, setNowTime] = useState(strftimeNow());
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	const [showSelectBox, setSelectBoxShow] = useState(false);

	let changeItemArr = []; //탭 리스트 업데이트 임시배열

	const times = {
		start: startTime,
		delay: delayTime,
		nowT: nowTime,
		defaultT: defaultTime
	};

	// widget_modal 관련
	const [modals, showModal] = useState(false); // 모달 show-hide
	const setModalStatus = (childVal) => showModal(childVal);
	
	// widget_modal (selectbox 리스트)
	const [tagList, setTagList] = useState([]); //데이터필터 (tag)
	const [modelList, setModelList] = useState([]); //데이터필터 (model)

	// widget_데이터필터(tagList)
	const getTagSelBox = async () => {
		// const response = await ApiGet(`api_v1/service/tags/selectList`, navigate);

		const response = tagSelectList['tagSelectList'];
		if (response.code === 200) setTagList(response.tags.tagname);
		else console.log("err >>", response);	
	};

	// widget_데이터필터(modelList)
	const getModelSelBox = async () => {
		// const res = await ApiGet(`/api_v1/service/models/selectList`, navigate);

		const res = modelSelectList['modelSelectList'];
		if (res.code === 200) setModelList(res.modelname);
		else console.log("err >>", res);
	};

	// 전체 탭 리스트
	const [tabList, setTabList] = useState([]); //전체탭리스트
	const getTabList = async () => {
		// let tabLists = await ApiGet(`/api_v1/service/dashboard/tab/tabList`, navigate);
		// setTabList(tabLists['tabList']);

		setTabList(tabListData['tabList']);
	};

	// widget_그래프컨텐츠
	const [currentWidgets, setCurWidgetLists] = useState([]); //현재 클릭탭 위젯 데이터 
	const [showLoading, setShowLoading] = useState(false);

	// 탭 정보 (현재 선택 tabId)
	const tabId = GetStore("user", "currentTabId");
	
	// 그래프 데이터 유무 체크
	const [graphDataIs, setGraphDatas] = useState(false);

	const getThisTab = async () => {
		// let res = await ApiGet(`/api_v1/service/dashboard/tab/detail?tabId=${tabId}`);
		// setCurWidgetLists(res['tabDetail']);

		// if (res['tabDetail'].length === 0) setShowLoading(false);
		// else if (res['tabDetail'].length > 0 && tabId !== -1) setShowLoading(true);


		let datas = widgetListData['widgetList']; // 전체데이터
		// let res = [];
		// // 전체 데이터 중 해당 탭 데이터만 가져오기
		// for (let i = 0; i < datas['tabDetail'].length; i++) {
		// 	if(datas['tabDetail'][i]['tab_id'] === tabId){
		// 		res.push(datas['tabDetail'][i])
		// 	}
		// }

		const res = datas['tabDetail'].filter(datas => datas['tab_id'] === tabId);
		setCurWidgetLists(res);


		if (res.length === 0) setShowLoading(false);
		else if (res.length > 0 && tabId !== -1) setShowLoading(true);
	};

	useEffect(() => {
		if (location.pathname.includes('login')) return;

		//탭 클릭때마다 위젯 전체 리스트, 탭 전체리스트 재호출
		all_reload();
		setGraphDatas(false);
		getThisTab();
		setShowLoading(false);

		if (tabId > 0) updateData(tabId, strftime(Date.now() - (HOUR * defaultTime)));
		else if (tabId === -1) setShowLoading(false);

		tabId === 0 ? setSelectBoxShow(true) : setSelectBoxShow(false);

	}, [tabId]);

	useEffect(() => { //시간변경(조회)
		setStartTime(strftime(Date.now() - (HOUR * defaultTime)));
		setNowTime(strftimeNow());
	}, [defaultTime]);

	const all_reload = () => {
		getTabList(); //전체 탭리스트
		getModelSelBox(); //widgetModal로 넘길 modelList
		getTagSelBox(); //widgetModal로 넘길 tagList
		getThisTab();
	};

	const [chartData, setChartData] = useState({
		tagKeys: [],
		tagData: [],
		eventTagData: [],
		modelKeys: [],
		modelData: [],
		eventModelData: []
	});

	const { tagKeys, tagData, eventTagData, modelKeys, modelData, eventModelData } = chartData;

	const getKeyAndData = async (tabId, type, time) => {
		// const res = await ApiGet(`/api_v1/service/dashboard/tab${type}Data?tabId=${tabId}&time=${time}`, navigate);
		// const eventRes = await ApiGet(`/api_v1/service/dashboard/tab${type}Data?tabId=${tabId}&time=${time}&typeof=event`, navigate);
		let res;
		let eventRes;

		if(type === 'Tag'){
			// res = tabId === 1 ? tabTagData1 : tabTagData2;
			// eventRes = tabId === 1 ? tabTagDataEvt1 : tabTagDataEvt2;

			if(tabId === 1) {
				res = tabTagData1;
				eventRes = tabTagDataEvt1;
			}
			else if (tabId === 2) {
				res = tabTagData2;
				eventRes = tabTagDataEvt2;
			}
			else {
				res = tabTagData3;
				eventRes = tabTagDataEvt3;
			}

		}else {
			// res = tabId === 1 ? tabModelData1 : tabModelData2;
			// eventRes = tabId === 1 ? tabModelDataEvt1 : tabModelDataEvt2;

			if(tabId === 1) {
				res = tabModelData1;
				eventRes = tabModelDataEvt1;
			}
			else if (tabId === 2) {
				res = tabModelData2;
				eventRes = tabModelDataEvt2;
			}
			else {
				res = tabModelData3;
				eventRes = tabModelDataEvt3;
			}
		}
		const key = Object.keys(res);

		return [key, res, eventRes];
	};

	const updateData = async (tabId, time) => {
		let tagKeyRes, tagRes, eventTagRes, modelKeyRes, modelRes, eventModelRes;
		[tagKeyRes, tagRes, eventTagRes] = await getKeyAndData(tabId, "Tag", time);
		[modelKeyRes, modelRes, eventModelRes] = await getKeyAndData(tabId, "Model", time);

		setChartData({
			...chartData,
			tagKeys: tagKeyRes,
			tagData: tagRes,
			eventTagData: eventTagRes,
			modelKeys: modelKeyRes,
			modelData: modelRes,
			eventModelData: eventModelRes
		});
	};

	useEffect(() => {
		if (tabId > 0) updateData(tabId, strftime(Date.now() - (HOUR * defaultTime))); // 초기실행(그래프데이터 전체 가져오기)
	}, []);

	const checkWidgetsTypes = (widgetList) => {
		let tmp1 = [];
		let tmp2 = [];
		let types;

		for (let i = 0; i < widgetList.length; i++) {
			if (widgetList[i].type === 'tag') tmp1.push(widgetList[i]);
			else tmp2.push(widgetList[i]);
		}

		if (tmp1.length !== 0 && tmp2.length !== 0) types = 'all';
		else if (tmp1.length !== 0 && tmp2.length === 0) types = 'tag';
		else if (tmp2.length !== 0 && tmp1.length === 0) types = 'model';

		return types;
	};

	useEffect(() => {
		const checkType = checkWidgetsTypes(currentWidgets);
		const tagCheck = tagKeys.length !== 0 && Object.keys(tagData).length !== 0 && Object.keys(eventTagData).length !== 0;
		const modelCheck = modelKeys.length !== 0 && Object.keys(modelData).length !== 0 && Object.keys(eventModelData).length !== 0;

		if (tabId > 0 && checkType !== undefined) {
			if (checkType === 'all') return (tagCheck && modelCheck) ? setGraphDatas(true) : setGraphDatas(false);
			else if (checkType === 'tag') return tagCheck ? setGraphDatas(true) : setGraphDatas(false);
			else if (checkType === 'model') return modelCheck ? setGraphDatas(true) : setGraphDatas(false);
		}
		else {
			setGraphDatas(false);
			setShowLoading(false);
		}

	}, [tagKeys, tagData, eventTagData, modelKeys, modelData, eventModelData]);

	const updateBokehChart = (item, chartCDS, eventCDS) => {
		if (item.type === 'tag') {
			let newTagData = tagData[item.filter];
			let newEventTagData = eventTagData[item.filter];
			updateCDS(chartCDS[chartCDS.length - 1], newTagData, "dayTimes");
			updateCDS(eventCDS[eventCDS.length - 1], newEventTagData, "dayTimes");
		} else {
			let newModelData = modelData[item.filter];
			let newEventModelData = eventModelData[item.filter];
			updateCDS(chartCDS[chartCDS.length - 1], newModelData, "dayTimes");
			updateCDS(eventCDS[eventCDS.length - 1], newEventModelData, "dayTimes");
		}
	};

	
	const handleDefaultTime = (props) => {
		chgDefaultTime(props);
		dispatch(SetStore(setDefaultTime, props));
	};


	return (
		<>
			{modals &&
				<WidgetModal
					isShow={setModalStatus}
					types={'add'}
					tabId={tabId}
					tagList={tagList}
					modelList={modelList}
					reloadTab={all_reload}
					widgetList={currentWidgets}
				/>
			}
			<div className="dash_container">
				<div className='custom_tab_btns'>
					<DashboardTab tabNames={tabList}/>
					{showSelectBox &&
						<SelectBox
							width={"150"}
							innerList={recentTime}
							handleValue={handleDefaultTime}
							label={recentTime[getDefaultStore - 1]['name']} />
					}
				</div>
				<div className='tab_contents' style={{ flexWrap: tabId === 0 ? '' : 'wrap' }}>
					{tabId === 0 ?
						<DefaultDashboard setTimes={times} /> :
						<div className="custom_new" tabid={tabId}>
							{graphDataIs ?
								<CustomDashboard
									widgetList={currentWidgets}
									setTimes={times}
									tagList={tagList}
									modelList={modelList}
									curId={tabId}
									reloadTab={all_reload}
									widgetDatas={chartData}
									changeArr={changeItemArr}
									updateData={updateData}
									updateBokehChart={updateBokehChart}
								/>
								: showLoading && <Loading isFull={true} width={"90%"} height={"90%"} custom={true} bg={true} />
							}
							<button
								className='addCustom'
								style={{ pointerEvents: tabList.length === 0 ? 'none' : 'auto', opacity: tabList.length === 0 ? 0.5 : 1 }}
								onClick={() => {
									if (currentWidgets.length >= 12) alert('위젯을 더이상 등록할 수 없습니다');
									else showModal(!modals);
								}}
							/>
						</div>
					}
				</div>
			</div>
		</>
	)
}