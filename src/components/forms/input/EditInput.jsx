import React, { useState, useEffect } from "react";
import { ApiPut } from "@services";

export const EditInput = (props) => {
    const [editItem, changeInput] = useState(false);
    const [content, setContent] = useState(props.defaultVal);

    useEffect(() => {
        setContent(props.defaultVal);
    }, [props])

    return (
        <>
            <p style={{ display: editItem ? "none" : "block" }}>{content}</p>
            <input style={{ display: !editItem ? "none" : "block" }} defaultValue={content} type="text" onChange={(e) => setContent(e.target.value)}/>
            <button className={`re_edit ${editItem ? "active" : ""}`} 
                onClick={async (e) => {
                    props.data["comment"] = content;
                    changeInput(!editItem);
                    // alert('코멘트가 수정되었습니다')
                    // let res = await ApiPut(props.updateUrl, props.data);
                    // if (res.code !== 200)  setContent(props.defaultVal);
            }}/>
        </>
    );
}