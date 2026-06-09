import React from "react";
import { Link } from "react-router-dom";
import { SelectBox } from "@components";

const handelPageLst = [
    { name: "10개씩보기", value: 10 },
    { name: "30개씩보기", value: 30 },
    { name: "50개씩보기", value: 50 },
];


export const Pagination = (props) => {
    let pageCount = 0;
    let pageStart = 0;
    let pageEnd = 0;

    const handelPage = () => {
        pageCount = Math.ceil(props.total / props.pageSize);
        pageEnd = Math.ceil(props.current / 10) * 10;
        pageStart = pageEnd - 9;
        
        if (pageEnd > pageCount) pageEnd = pageCount;
        let pagePush = [];
        for (let i = pageStart; i <= pageEnd; i++) {
            if (i === props.current) {
                pagePush.push(<li key={i} className="active" onClick={() => props.onChange(i)}><Link to="">{i}</Link></li>);

            } else {
                pagePush.push(<li key={i} onClick={() => props.onChange(i)} ><Link to="">{i}</Link></li>);
            }
        }
        return pagePush;
    }

    return (
        <div className="pagination">
            <ul className="pagination_list">
                <li className="first" onClick={() => props.setCurrent(1)}></li>
                <li className="prev" onClick={() => { props.current > 10 ? props.setCurrent(props.current - 10) : props.setCurrent(1); }}></li>
                {handelPage()}
                <li className="next" onClick={() => { props.current < pageCount - 9 ? props.setCurrent(props.current + 10) : props.setCurrent(pageCount); }}></li>
                <li className="last" onClick={() => props.setCurrent(pageCount)}></li>
            </ul>
            <SelectBox innerList={handelPageLst} handleValue={props.setPageSize} handlePage={props.setCurrent} label={handelPageLst[0]['name']} />
        </div>
    );
}