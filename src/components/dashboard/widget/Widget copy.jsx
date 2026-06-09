import { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { Loading, ChangedGraph } from '@components';
import Slider from 'rc-slider';
import { useDrag } from 'react-dnd';
import { forwardRef } from 'react';
import 'rc-slider/assets/index.css';

export const Widget = forwardRef(({ ...viewProps }, ref) => {
    const [changeW, setWidth] = useState();
    const viewRef = useRef(null);
    const dragItem = { index: viewProps.index , id : viewProps.id };

    const [{ }, drag, dragPreview] = useDrag(() => ({
        type: 'widget',
        item: dragItem,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [dragItem]);

    useImperativeHandle(ref, () => ({
        getNode: () => viewRef.current,
    }));

    drag(viewRef);
    dragPreview(viewRef);

    useEffect(() => { //탭 클릭 시 위젯생성
        if (viewProps.getData.span === 1) setWidth(435);
        else if (viewProps.getData.span === 2) setWidth(883);
        else setWidth(1335);
    }, [viewProps.getData.span]);


    const updateSpanData = (curWidth) => { //부모에 전달할 현재 변경된 span 너비
        let parentW;
        if (curWidth <= 435 && curWidth < 883) {
            setWidth(435);
            parentW = 1;
        }
        else if (curWidth <= 883 && curWidth < 1335) {
            setWidth(883);
            parentW = 2;
        }
        else if (curWidth >= 1335) {
            setWidth(1335);
            parentW = 3;
        }
        else {
            parentW = viewProps.getData.span;
            setWidth(parentW);
        }

        // 현재 widget 정보 부모로 전달
        const getDatas = {
            ...viewProps.getData,
            span: parentW,
        };

        viewProps.getResizeInfo(getDatas); //부모에 업데이트 내용 알려주기
    };

    return (
        <div className="customItem"
            ref={viewRef}
            style={{ width: changeW + 'px', border: viewProps.overStyle ? '2px dashed #4673D2' : '', opacity: viewProps.overStyle ? 0.4 : 1 }}>
            <div className="inner_contents">
                <div className='top_bar'>
                    <h5 className='title'>{viewProps.getData.title}</h5>
                    <div className='btns'>
                        <Slider min={435} max={1335} value={changeW} marks={{ 435: 'S', 883: 'M', 1335: 'L' }} step={null}
                            className='range_slider'
                            onChange={(e) => updateSpanData(e)} />
                        <button className='edit'
                            onClick={() => {
                                viewProps.modalEvt(true);
                                viewProps.reOrderData(viewProps.getData);
                            }} />
                        <button className='del'
                            onClick={() => {
                                viewProps.popupEvt(true);
                                viewProps.getWidgetId(viewProps.getData.id);
                            }} />
                    </div>
                </div>
                <div className='graph_area'>
                    <div>{viewProps.graph}</div>                
                </div>
            </div>
        </div>
    );
});