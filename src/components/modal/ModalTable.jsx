import {React} from "react";
import { Link } from "react-router-dom";
import { ChangeInput } from "../forms/input/ChangeInput";

export const ModalTable = ({showType, system, equipment, modelList, description}) => {

    const makeModel = () => {
        let result = [];
        for (let i=0; i<modelList.length; i++) {
            result.push(<Link className="model_result" to="">{modelList[i]}</Link>);
        }
        return result;
    }
    const tableType = showType === "tag" ? "block" :"none";
    return (


        <ul className="modal_list" style={{display:tableType}}>
            {showType}
            <li>
                <p className="title">설비명</p>
                <p className="result">{equipment}</p>
            </li>
            <li>
                <p className="title">계통명</p>
                <p className="result">{system}</p>
            </li>
            <li>
                <p className="title">연관 모델</p>
                <p className="result">
                    {makeModel()}
                </p>
            </li>
            <li>
                <p className="title">설명</p>
                <ChangeInput defaultVal={description}/>
            </li>
        </ul>
    );
}