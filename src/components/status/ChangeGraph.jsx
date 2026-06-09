import React from "react";
import "@assets/scss/common.scss";
import { CustomGraph2 } from "@assets/img";

/*
 * [ ChangedGraph 컴포넌트 props 안내 ]
 *** isFull : [true] 전체 화면(디바이스 사이즈 정가운데 정렬) or [false] 특정영역 내부 소속
 *** width : 원하는 너비 전달 , 전체 화면일 경우 100%
 *** height : 원하는 높이 전달 , 전체 화면일 경우 100%
 *** beforeIndex : 사용자가 수정하기 전 index (변경 사항 알리기 위함)
 *** nowIndex : 현재 순서가 변경된 위젯의 index
 *** sizeIs : 위젯 사이즈 변경 여부
 */

export const ChangedGraph = ({ isFull, width, height, beforeIndex, nowIndex, sizeIs }) => {
    const changeMsg = [
        `순서가 <span>${beforeIndex+1} → ${nowIndex+1}로 변경된</span>`,
        `사이즈가 변경된`,
        `<span>${beforeIndex+1} 번째</span>`,
        `사이즈 변경 & 순서가 <span>${beforeIndex+1} → ${nowIndex+1}로 변경된</span>`
    ];

    let innerMsg;

    if(beforeIndex !== nowIndex) innerMsg = sizeIs ? changeMsg[3] : changeMsg[0];
    else                         innerMsg = sizeIs ? changeMsg[1] : changeMsg[2];

    return (
        <div className="status_container" style={{ width: width, height: height, position: isFull ? "fixed" : "inherit" }}>
            <div className="change_graph_item">
                <CustomGraph2/>
                <h2>Graph Changed ...</h2>
                <p>이 위젯은<span className='innerMsg' dangerouslySetInnerHTML={{ __html: innerMsg }}></span>
                위젯입니다.<br/>변경된 내용을 적용하려면 상단의 <span>&#91; 수정사항 저장 &#93;</span> 버튼을 눌러주세요.
                </p>
            </div>
        </div>
    );
}