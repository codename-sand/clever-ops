import { useState, useCallback } from "react";
import { WidgetModal, GlobalPopup, TabChart, WidgetContainer, ChangedGraph, GlobalToast } from '@components';
import { strftimeNow } from "@utils"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const CustomDashboard = (props) => {
    //popup&modal
    const [btns, setBtnVal] = useState(false); // 팝업 버튼값
    const btnValue = (popVal) => setBtnVal(popVal); // 팝업 내부 버튼값
    const [modalStatus, setModals] = useState(false);
    const setModalStatus = (modals) => setModals(modals);
    const [popupStatus, setPopups] = useState(false);
    const setPopupStatus = (popups) => setPopups(popups);
    const [toastStatus , setToast] = useState(false);
    const setToastStatus = (toastMsg) => setToast(toastMsg);

    //현재 사용자가 보고있는 위젯 id값
    const [widgetId, setWidgetId] = useState();
    const getWidgetId = (id) => setWidgetId(id);

    //변경된 widget 데이터 저장
    const [updateItem, setUpdateItem] = useState([]);
    const tempWidgetData = (changeData) => setUpdateItem(changeData);
    //변하지않은 맨처음 위젯정보
    const defaultWidgetList = props.widgetList; 

    //레이아웃 변경
    const [changePageIs, setChangePage] = useState(false); //탭 내 변경여부 체크
    const [widgetShowIs, setWidgetShow] = useState(false); //위젯 화면에 그리기전 데이터 먼저 체크
    const [cdsFlag, setCDSFlag] = useState(false);

    //데이터 변경여부
    const [data, setData] = useState([]);
    const changeData = (ch) => setData(ch);
    //drag&drop
    let updateArr = []; // 최종 업데이트 데이터
    const [widgetLists, setWidgetLists] = useState(props.widgetList); //drag&drop 적용 state

    // graph setting
    const [tempItem, setTempItem] = useState(null);

    //위젯삭제
    const delWidget = async () => {
        // const delRes = await ApiDelete(`/api_v1/service/dashboard/widget?widgetId=${widgetId}`, navigate);
        const delRes = {"code": 200};

        if (delRes.code === 200) {
            alert('위젯이 삭제되었습니다');
            // window.location.reload(true);
        }
    };

    //위젯수정
    const updateWidgets = async (updateList) => {
        for (let i = 0; i < updateList.length; i++) {
            // const res = await ApiPut(`/api_v1/service/dashboard/widget?widgetId=${updateList[i]['id']}&row=${updateList[i]['row']}&col=${updateList[i]['col']}&span=${updateList[i]['span']}&title=${updateList[i]['title']}&widget_type=${updateList[i]['type']}&widget_filter=${updateList[i]['filter']}&chart_kind=${updateList[i]['chart_kind']}`, navigate);
            // if (res.code === 200 && updateList.length - 1 === i) {
            if (updateList.length - 1 === i) {
                alert('수정된 위젯이 등록되었습니다');
                // window.location.reload(true);
                setChangePage(false);
            }
        }
    };

    //위젯 내 그래프 너비설정
    const graphWidth = (spanValue) => {
        const widthSize = spanValue === 1 ? 435 : spanValue === 2 ? 900 : 1350;
        return widthSize;
    };

    //위젯별로 그래프 데이터 넣어주기
    const resetChartData = (typeList, filter) => {
        let datas;
        const setKeyList = Object.keys(typeList);
        for (const key in setKeyList)
            if (setKeyList[key] === filter) datas = setKeyList[key];
        return datas;
    };

    //그래프 그리기
    const setBokehGraph = (allData, index, datas) => {
        const uidNum = allData.id;
        const uidTab = allData.tab_id;
        const width = graphWidth(allData.span) - 45;
        const height = 240;

        const keydata = allData.type === 'tag' ? datas['tagData'] : datas['modelData'];
        const keyEvtData = allData.type === 'tag' ? datas['eventTagData'] : datas['eventModelData'];
        const keyName = resetChartData(keydata, allData.filter);
        const graphUrn = allData.type === 'tag' ?
            `/api_v1/service/dashboard/tabTagGraph?width=${width}&height=${height}&tag_name=${keyName}&index=${index}` :
            `/api_v1/service/dashboard/tabModelGraph?width=${width}&height=${height}&model_name=${keyName}&index=${index}`;

            
        return <TabChart
            uid={`custom_graph_tab${uidTab}_${uidNum}`}
            chartName={`${allData.type}Value${index}`}
            eventName={`${allData.type}Event${index}`} // ["TagOperation", "TagEvent", "TagPredict"]
            startTime={props.setTimes.start}
            delayTime={props.setTimes.delay}
            cmpKey={"dayTimes"}
            graphURN={graphUrn}
            newData={keydata[keyName]}
            newEventData={keyEvtData[keyName]}
            widgetIndex={index}
            tabId={props.curId}
        />
    };

    const updateTab = () => { //수정적용 버튼클릭
        if (!changePageIs) alert('수정할 내용이 없습니다');
        else updateWidgets(widgetLists);
    };

    useEffect(() => {
        // 위젯에서 수정된 내용 받아 체크
        if (updateItem.length !== 0) changeWidgetLists('resize',updateItem);
    }, [updateItem]);

    useEffect(() => {
        if (btns) {//팝업 - 삭제버튼 누름
            delWidget();
            props.reloadTab();
        }
    }, [btns]);

    const changeWidgetLists = (type, changedInfo) => {
        const updateSpan = (itemsCopy) => {
            for (const item of itemsCopy) {
                if (item.id === changedInfo.id) {
                    item.span = changedInfo.span;
                    item.col = 0; //사이즈 변경체크(ChangedGraph 넘겨주는값)
                }
            }
        };
    
        const updateOrder = (itemsCopy) => {
            const [fromItem] = itemsCopy.splice(changedInfo.dragIndex, 1);
            itemsCopy.splice(changedInfo.hoverIndex, 0, fromItem);

            for (let i = 0; i < itemsCopy.length; i++) itemsCopy[i]['row'] = i + 1;
        };
    
        setWidgetLists((widgetLists) => {
            const itemsCopy = [...widgetLists];
    
            if (type === 'resize') updateSpan(itemsCopy);
            else                   updateOrder(itemsCopy);

            return itemsCopy;
        });
        setChangePage(true);
    }

    useEffect(() => { // 데이터 모두 받고 그래프 그리기위함
        const propsData = props.widgetDatas;
        if (propsData['tagKeys'] !== undefined && propsData['eventModelData'] !== undefined && propsData['eventTagData'] !== undefined &&
            propsData['modelData'] !== undefined && propsData['modelKeys'] !== undefined && propsData['tagData'] !== undefined) {
            setWidgetShow(true);
        }
    }, [props.widgetDatas]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleItemsDragAndDrop = useCallback((params) => {
        // params custom setting : widgetContainer.jsx
        if (params.type === 'drop') {
            if(params.conditionIs) changeWidgetLists('drag',params);
            else setToast(true);
            setTempItem(null);

        } else if (params.type === 'hover') {
            if (params.dragIndex === params.hoverIndex || tempItem?.index === params.hoverIndex) return;
            setTempItem({ index: params.hoverIndex });
        }
    });



    const handleItemsReorder = useCallback((params) => {
        handleItemsDragAndDrop({ ...params, type: 'drop' });
    }, [handleItemsDragAndDrop]);



    const handleHover = useCallback((params) => {
        handleItemsDragAndDrop({ ...params, type: 'hover' });
    }, [handleItemsDragAndDrop]);



    return (
        <>
            {modalStatus &&
                <WidgetModal
                    isShow={setModalStatus}
                    types={'edit'}
                    innerData={data}
                    tagList={props.tagList}
                    modelList={props.modelList}
                    reloadTab={props.reloadTab} 
                />
            }

            {popupStatus && <GlobalPopup isShow={setPopupStatus} innerText={'정말로 삭제하시겠습니까?'} btnType={'all'} isResult={btnValue} />}
            {toastStatus && <GlobalToast innerText={'위젯 이동은 위쪽으로만 가능합니다.'} sec={2} status={setToastStatus}/>}

            {changePageIs &&
                <div className="top_pop_wrap">
                    <button type="submit" className="save_btn pop_btn" onClick={updateTab}>수정사항 저장</button>
                </div>
            }

            <DndProvider backend={HTML5Backend}>
                {widgetShowIs && widgetLists.map((item, index) => {
                    const condition = (element) => element.title === item.title;
                    const indexInfo = defaultWidgetList.findIndex(condition);
                    const sizeIs = item.col === 0 ? true : false;
                    const changedGraph = <ChangedGraph isFull={false} width={"100%"} height={"234px"} beforeIndex={indexInfo} nowIndex={index} sizeIs={sizeIs}/>;

                    return (
                        (changePageIs) ?
                            <WidgetContainer
                                graph={changedGraph}
                                key={index}
                                index={index}
                                onDrop={handleItemsReorder}
                                onHover={handleHover}
                                modalEvt={setModalStatus}
                                popupEvt={setPopupStatus}
                                getWidgetId={getWidgetId}
                                reOrderData={changeData}
                                getData={item}
                                id={item.id}
                                getResizeInfo={tempWidgetData}
                            />
                            :
                            <WidgetContainer
                                graph={setBokehGraph(item, index, props.widgetDatas)}
                                key={item.id}
                                index={index}
                                onDrop={handleItemsReorder}
                                onHover={handleHover}
                                modalEvt={setModalStatus}
                                popupEvt={setPopupStatus}
                                getWidgetId={getWidgetId}
                                reOrderData={changeData}
                                getData={item}
                                id={item.id}
                                getResizeInfo={tempWidgetData}
                            />
                    );
                })}
            </DndProvider>
        </>
    );
}