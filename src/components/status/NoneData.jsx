import React from "react";
import "@assets/scss/common.scss";
import { NoticeIcon } from "@assets/img";

/*
 * [ NoneData 컴포넌트 props 안내 ]
 *** isFull : [true] 전체 화면(디바이스 사이즈 정가운데 정렬) or [false] 특정영역 내부 소속
 *** width : 원하는 너비 전달 , 전체 화면일 경우 100%
 *** height : 원하는 높이 전달 , 전체 화면일 경우 100%
 */

export const NoneData = ({ isFull, width, height }) => {
    return (
        <div className="status_container" style={{ width: width, height: height, position: isFull ? "fixed" : "inherit" }}>
            <div className="nonedata_item">
                <NoticeIcon fill="#999999" />
                <h2>현재 데이터가 없습니다</h2>
            </div>
        </div>
    );
}

