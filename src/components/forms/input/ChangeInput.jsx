import React, { useState, useEffect } from "react";
import { ApiPut } from "@services";

export const ChangeInput = ({ defaultVal, updateUrl }) => {
    const [wrapSwitch, SwitchInput] = useState("edit");
    const editOn = wrapSwitch === "input" ? "flex" : "none";
    const inputOn = wrapSwitch === "edit" ? "flex" : "none";
    const [content, setContent] = useState(defaultVal);
    

    useEffect(() => {
        setContent(defaultVal);
    }, [defaultVal])



    return (
        <div className="change_input">
            <div className="input_data" style={{ display: inputOn }}>
                <p className={`result ${content !== null ? 'flexible' : ''}`} >{content}</p>
                <button className="edit" onClick={() => SwitchInput("input")}></button>
            </div>
            <div className="edit_data" style={{ display: editOn }}>
                <input type="text" defaultValue={content} onChange={(e) => setContent(e.target.value)} />
                <button className="save" 
                    // onClick={async (e) => {
                    onClick={(e) => {
                        SwitchInput("edit");
                        // let res = await ApiPut(`${updateUrl}${content}`);
                        // if (res.code !== 200) {
                        setContent(content);
                        // }
                    }
                }></button>
            </div>
        </div>
    );
}