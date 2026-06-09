import React from "react";
import "@assets/scss/common.scss";

/*
 * [ Loading 컴포넌트 props 안내 ]
 *** isFull : [true] 전체 화면(디바이스 사이즈 정가운데 정렬) or [false] 특정영역 내부 소속
 *** width : 원하는 너비 전달 , 전체 화면일 경우 100%
 *** height : 원하는 높이 전달 , 전체 화면일 경우 100%
 *** bg : [true] 디자인 시안대로 불투명한 흰배경 or [false] 투명배경
 */

export const Loading = ({ isFull, width, height, bg,custom, graphIs }) => {
    return (
        <div className="status_container" style={{ width: width, height: height, background: bg ? "transparent" : `rgba(255, 255, 255, 0.5)`, position: isFull ? "fixed" : "inherit", top: custom ? '130px' : 0, left: custom ? '200px' : 0 }}>
            <div className="loading_item"></div>
        </div>
    );
}