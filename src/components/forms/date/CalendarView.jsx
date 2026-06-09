import { React, useState } from "react";
import Calendar from 'react-calendar';
import moment from "moment"; // 캘린더 세부 세팅 설정 가능한 패키지
import 'react-calendar/dist/Calendar.css';
import 'react-date-range/dist/styles.css';

export const CalendarView = (props) => {
    // 오늘날짜 설정(기본값)
    const value = new Date();
    const date = value.getDate() < 10 ? "0" + value.getDate() : value.getDate();
    const today = value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + date;
    // 날짜선택 - 시작 날짜
    const [startDate, setStartDate] = useState();
    // 날짜선택 - 마지막 날짜
    const [endDate, setEndDate] = useState();
    // 입력날짜
    const innerDate = props.startDate === '' ? " ~ " + today : props.startDate.slice(0, 10) + " ~ " + props.endDate.slice(0, 10);
    // 달력 show & hide
    const [showCalendar, setShowCalendar] = useState(false);

    const changeDate = e => {
        const startDateFormat = moment(e[0]).format("YYYY-MM-DD");
        const endDateFormat = moment(e[1]).format("YYYY-MM-DD");
        props.handleStartDate(startDateFormat + " 00:00:00");
        props.handleEndDate(endDateFormat + " 23:59:59");
        setShowCalendar(false);
        props.handlePage(1);
        props.handleFlag(true);
    };

    return (
        <div className="date_type">
            <p className="date">{innerDate}</p>
            <button onClick={() => setShowCalendar(!showCalendar)} className="open_calendar"></button>

            <Calendar
                onChange={changeDate} // 날짜 사용자 선택 값
                calendarType="gregory" // 요일을 일요일부터 시작하도록 설정
                formatDay={(locale, date) => moment(date).format("D")} // '일' 제외하고 숫자만 보이도록 설정
                selectRange={true} // range(날짜선택 사용 여부)
                className={showCalendar ? "" : "hide"} // 캘린더 show-hide 여부 class로 제어
            // maxDate={new Date()} // 마지막 날짜 기준점
            // minDate={new Date(2015 ,6, 1)} // 시작 날짜 기준점
            />
        </div>
    );
}