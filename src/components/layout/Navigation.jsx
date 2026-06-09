import { React, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { TopNav } from './TopNav';
import { biImage, dashboardIcon, dashboardOn, tagIcon, tagIconOn, eventIcon, eventIconOn, modelIcon, modelIconOn, btnArrow, emblem, settingOnIcon } from "@assets/img";
import "@assets/scss/navigation.scss";
import { setNavigationWidth, SetStore, GetStore } from "@services";
import { useDispatch } from 'react-redux';

const leftNaviList = [
    // {
    //     title: "Dashboard",
    //     imgSrc: dashboardIcon,
    //     imgOn: dashboardOn,
    //     path: "dashboard",
    // },
    {
        title: "Tag",
        imgSrc: tagIcon,
        imgOn: tagIconOn,
        path: "tags",
    },
    {
        title: "Events",
        imgSrc: eventIcon,
        imgOn: eventIconOn,
        path: "events",
    },
    {
        title: "Models",
        imgSrc: modelIcon,
        imgOn: modelIconOn,
        path: "models",
    },
];

const setStr = [
    {
        menu: "시스템 정보",
        path: "systemInfo",
    },
    {
        menu: "모델 업데이트",
        path: "modelUpdate",
    },
    {
        menu: "계정 설정",
        path: "account",
    },
    {
        menu: "메일 서버 설정",
        path: "mailserver",
    },
    {
        menu: "로그 전송 설정",
        path: "log",
    },
    {
        menu: "저장소 관리",
        path: "storage",
    },
];

export const Navigation = () => {
    const dispatch = useDispatch();
    // navigation width resizing
    const curNaviWidth = GetStore("user", "naviStatus");

    useEffect(() => {
        // 동적 여백 조정
        const routeItem = document.querySelector(".routes_wrap");
        routeItem.style.marginLeft = curNaviWidth ? "80px" : "220px";

    }, [curNaviWidth]);

    return (
        <nav>
            <div className={`left_navi ${curNaviWidth ? "active" : ""}`}>
                <a href={"/cleverOps"} className="logo"><img src={curNaviWidth ? emblem : biImage} alt="logo" /></a>
                <ul className='main_navi'>
                    <li>
                        <a href={"/cleverOps"} id={"dashboard"}>dashboard</a>
                    </li>
                    {leftNaviList && leftNaviList.map((item, index) => {
                        return (
                            <li key={item.title} className=''>
                                <NavLink to={item.path} className={({ isActive }) => (isActive ? 'active' : '')} >{item.title}</NavLink>
                            </li>
                        )
                    })}
                </ul>
                <div className="setting_wrap">
                    <div className="set_header">
                        <p>Settings</p>
                    </div>
                    <ul>
                        {setStr && setStr.map((item, index) => {
                            return (
                                <li key={item.menu}>
                                    <NavLink to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>{item.menu}</NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <button className='change_navi' onClick={() => { dispatch(SetStore(setNavigationWidth, !curNaviWidth)); }}>
                    <img src={btnArrow} alt="change_navigation" />
                </button>
            </div>
            <TopNav />
        </nav>
    );
}
