/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useState, useEffect } from 'react';
import { forwardRef } from 'react';

export const SelectBox = forwardRef((props, ref) => {
	// selectBox show-hide
	const [selectSet, SelectOn] = useState(false);
	const selectStatus = selectSet ? "open" : "";
	const wideWidth = props.addWidth ? 'wide' : '';
	// option value change
	const [changeVal, changeValue] = useState(props.label);
	// disabled option
	const [disabled,setDisabled] = useState();

	// useEffect(() => {
	// 	changeValue('');
	// }, [props.changeType]);

	useEffect(()=>{
		if(props.reset) changeValue(props.label);
	},[props.reset]);

	useEffect(() => {
		const disabledIs = !props.disabledIs && props.disabledIs !== undefined? 'hide' : 'show';
		setDisabled(disabledIs);
	},[props.disabledIs]);

	// selectBox options
	const optionList = props.innerList.map((option, index) => {
		const listOptions = option.value === undefined ? option : option.value;
		const listNames = option.name === undefined ? option : option.name;

		return (
			<li key={index}
				onMouseDown={() => {
					if (props.handlePage !== undefined || '') props.handlePage(1);
					if (props.handleColume !== undefined || '') props.handleColume(listOptions);
					if (props.handleFlag !== undefined || '') props.handleFlag(true);
					if (props.handleValue !== undefined || '') props.handleValue(listOptions); 
					
					SelectOn(!selectSet);
					changeValue(listNames);

					if(props.selectInputValue !== undefined)	props.selectInputValue(listNames);
			}}>
				{listNames}
			</li>
		);
	});

	return (
		<div className={`selectBox ${wideWidth} ${disabled}`} onBlur={() => SelectOn(false)} onClick={() => SelectOn(!selectSet)}>
			<input
				placeholder={props.label}
				value={changeVal}
				ref={ref}
				name={props.name}
				className={`button ${selectStatus}`}
				onBlur={props.onBlur}
				disabled={props.disabled}
				readOnly 
			/>
			<ul className={`option_list ${selectStatus}`} style={{ overflowY: !props.noneIs ? 'auto' : 'scroll' }}>
				{props.noneIs &&
					<li onMouseDown={() => {
						changeValue('');
						props.handleColume('');
						props.handleFlag(true);
					}}>None</li>}
				{optionList}
			</ul>
		</div>
	);
});