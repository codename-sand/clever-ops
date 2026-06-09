/* eslint-disable react-hooks/exhaustive-deps */
import '@assets/scss/modal.scss';
import { useForm } from "react-hook-form";
import React, { useState } from 'react';
import { SelectBox } from '@components';
import { useRef } from 'react';
import { ApiPost, ApiPut } from "@services";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

export const WidgetModal = (props) => {
    const navigate = useNavigate();

    const inputs = {
        name: props.innerData === undefined ? '' : props.innerData.title,
        dataType: props.innerData === undefined ? '' : props.innerData.type,
        chartType: props.innerData === undefined ? '' : props.innerData.chart_kind,
        select: props.innerData === undefined ? '' : props.innerData.filter,
        tabId: props.innerData === undefined ? '' : props.innerData.tab_id,
        col: props.innerData === undefined ? '' : props.innerData.col,
        row: props.innerData === undefined ? '' : props.innerData.row,
        span: props.innerData === undefined ? '' : props.innerData.span,
        widgetId: props.innerData === undefined ? '' : props.innerData.id,
        tagList: props.tagList,
        modelList: props.modelList
    };

    const { name, dataType, select, widgetId, col, row, span, tagList, modelList } = inputs;
    const lists = dataType.length !== 0 ? (dataType === 'tag' ? tagList : modelList) : [];
    const [selectCont, setSelect] = useState(lists); //데이터필터
    const [selectVal, setSelectVal] = useState(select); //데이터필터 라벨정보

    // use form 
    const { register, handleSubmit, watch, reset, setError, setValue, formState: { errors } } = useForm({ mode: 'onClick' });

    const watchDataType = watch('dataType');

    const [selectInput, setSelectInput] = useState(''); //selectBox 입력값 에러캐치
    const childInputValues = (ch) => setSelectInput(ch);
    // custom-selectbox
    const ref = useRef(null);

    const widgetTypes = [
        { type: 'tag', str: '태그', selectBox: tagList },
        // { type: 'event', str: '이벤트', },
        { type: 'model', str: '모델', selectBox: modelList }
    ];

    const saveModals = async (data) => {
        const row = props.widgetList.length + 1;
        // const res = await ApiPost(`/api_v1/service/dashboard/widget?tabId=${props.tabId}&row=${row}&col=${1}&span=${1}&title=${data.name}&widget_type=${data.dataType}&widget_filter=${data.select}&chart_kind=${'line'}`, navigate);
        
        const res = {"code": 200};

        if (res.code === 200) {
            props.isShow(false); //modal closed
            alert('위젯이 등록되었습니다');
            // window.location.reload(true);
        }
    };

    const updateModals = async (data) => {
        // const res = await ApiPut(`/api_v1/service/dashboard/widget?widgetId=${widgetId}&row=${row}&col=${col}&span=${span}&title=${data.name}&widget_type=${data.dataType}&widget_filter=${data.select === '' ? select : data.select}&chart_kind=${'line'}`, navigate);
        
        const res = {"code": 200};

        if (res.code === 200) {
            props.isShow(false); //modal closed
            alert('위젯이 수정되었습니다');
        }
    };

    useEffect(() => { //selectbox reset
        if (watchDataType !== (null || undefined)) {
            const userSelectType = watchDataType === 'tag' ? tagList : modelList;
            setSelect(userSelectType);
            setSelectVal('');
        }

    }, [watchDataType]);

    useEffect(() => {
        if(selectInput !== '') {
            setSelectVal(selectInput);
            setError(
                'select',
                { message: '' }, 
            );
        }
    },[selectInput]);

    const onValidation = (data) => {
        if (data.select !== selectVal || selectVal === '' || selectVal.length === 0) {
            setError(
                'select',
                { message: '데이터 필터를 선택해주세요' }, 
            );
        } else {
            props.types === 'edit' ? updateModals(data) : saveModals(data)
        }
    };

    return (
        <div className="modal_wrap">
            <div className="custom_modal">
                <div className="modal_header">
                    <p>위젯{props.types === 'edit' ? '수정' : '추가'}</p>
                    <button onClick={() => {
                        props.isShow(false);
                    }} />
                </div>
                <form
                    onSubmit={handleSubmit((data) => {
                        // console.log('onSubmit')
                        try {
                            onValidation(data);
                        } catch (e) {
                            console.log("err >>", e);
                        }
                    })}>
                    <div className="input_line">
                        <label htmlFor="">위젯 이름</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="위젯 이름을 입력하세요"
                            defaultValue={name}
                            className={errors.name?.message !== undefined ? `addError` : ''}
                            {...register('name', {
                                required: '생성할 위젯 이름을 입력해주세요'
                            })}
                        />
                        <span className="error_line" style={{ margin: '60px 0 0 100px' }}>{errors.name?.message}</span>
                    </div>
                    <div className="input_line">
                        <label htmlFor="">데이터 종류</label>
                        {widgetTypes.map((item) =>
                            <div className="radio_btn" key={item.type}>
                                <div className="radio_wrap">
                                    <input
                                        type="radio"
                                        name="dataType"
                                        value={item.type}
                                        defaultChecked={dataType === item.type ? true : false}
                                        {...register('dataType', {
                                            required: '생성할 데이터 타입을 선택하세요'
                                        })}
                                    />
                                    <div className={`real_btn ${errors.dataType?.message !== undefined ? `addError` : ''}`} />
                                </div>
                                <label htmlFor={item.type}>{item.str}</label>
                            </div>
                        )}
                        <span className="error_line error_data_type" style={{ margin: '40px 0 0 100px' }}>{errors.dataType?.message}</span>
                    </div>

                    <div className="input_line" style={{ alignItems: 'baseline' }}>
                        <label htmlFor="">데이터 필터</label>
                        <SelectBox
                            innerList={selectCont}
                            ref={ref}
                            label={selectVal !== '' ? selectVal : '::데이터 필터 선택::'}
                            changeType={watchDataType}
                            noneIs={false}
                            selectInputValue={childInputValues}
                            addWidth={true}
                            {...register('select', { required: '데이터 필터를 선택해주세요' })}
                        />
                        <span className="error_line" style={{ margin: '45px 0 0 100px' }}>{errors.select?.message}</span>
                    </div>

                    <div className="button_wrap">
                        <button type="submit" className="save_btn">저장</button>
                        <button
                            className="cancel_btn"
                            onClick={() => {
                                props.isShow(false);
                            }}>취소</button>
                    </div>
                </form>
            </div>
        </div>

    );
}