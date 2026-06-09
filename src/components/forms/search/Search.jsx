import React from 'react'
import { useState } from 'react';

export const Search = ({inputValue, handleInput, handleColume, handleFlag, handlePage}) => {

    const searchClick = ()=> {
        handlePage(1);
        handleColume(inputValue);
        handleFlag(true);
    };

    const handleKeyDown =(e) => {
        if (e.key==="Enter") {
            e.preventDefault();
            handlePage(1);
            handleColume(inputValue);
            handleFlag(true);
        }
    }

    return (
        <div className="search_type">
            <input type="search" 
                value={inputValue === undefined ? '' : inputValue}
                onChange={event => {
                    handleInput(event.target.value);
                }}
                placeholder="설명" onKeyPress={(e)=> {
                    handleKeyDown(e);
            }}/>
            <button onClick={searchClick}></button>
        </div>
    );
}