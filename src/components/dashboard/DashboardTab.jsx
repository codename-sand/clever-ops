import { useEffect, useState, useRef } from "react";
import { CustomInput } from "@components";
import { setCurrentTabId, SetStore, GetStore } from "@services";
import { useDispatch } from 'react-redux';

export const DashboardTab = (props) => {
	const dispatch = useDispatch();

	const curTabid = GetStore("user", "currentTabId");
	const activeIs = curTabid === '' ? 'active' : '';

	const initTabstyle = () => { // tab style initialize (스타일 초기화)
		let clkContents = document.querySelectorAll(".dash_tab_btn");
		for (let i = 0; i < clkContents.length; i++) clkContents[i].classList.remove("active");
	}

	// tab버튼 선택값
	const [showAddBtn, setAddBtns] = useState(false);
	const afterAdd = (ch) => setAddBtns(ch);

	const changeTab = (clickItem) => { //탭 클릭
		window.location.reload(true);
		initTabstyle();
		const item = clickItem.currentTarget;
		const btnId = item.tabIndex;
		item.classList.add("active");
		
		const btnIs = btnId === -1 ? true : false;
		setAddBtns(btnIs);

		dispatch(SetStore(setCurrentTabId, btnId)); //리덕스:::마지막 탭id저장(새로고침시 유지위함)
	};

	const checkHover = (e, types) => {
		let hoverItem = document.querySelectorAll('.dash_tab_btn');
		for (let i = 0; i < hoverItem.length; i++) {
			if (hoverItem[i]['tabIndex'] === e.currentTarget.tabIndex && types === 'on') hoverItem[i].classList.add('on');
			else hoverItem[i].classList.remove('on');
		}
	};

	useEffect(() => {//tab 새로고침 유지
		let clkContents = document.querySelectorAll(".dash_tab_btn");
		for (let i = 0; i < clkContents.length; i++)
			if (clkContents[i].tabIndex === curTabid) clkContents[i].classList.add("active");
	}, [curTabid, props.tabNames]);

	return (
		<>
			<div className='left'>
				<div className={`dash_tab_btn ${activeIs}`} onClick={changeTab} tabIndex={0} style={{cursor:"pointer"}}>Default Dashboard</div>
				
				{props.tabNames.map((item, index) => {//이미 생성된 커스텀보드
					const addActive = item.id === curTabid ? 'active' : '';
					return (
							<div className={`btn_wrap ${addActive}`} key={index} >
								<div className="click_btn" tabIndex={item.id} onClick={changeTab} onMouseOver={(e) => checkHover(e,'on')} onMouseOut={(e) => checkHover(e,'off')}/>
								<CustomInput
									type={'edit'} //추가 or 수정여부
									tabName={item.tab_name}
									tabIndex={item.id}
									activeIs={addActive}//현재 탭 active여부
								/>
							</div>
					);
				})}

				{showAddBtn ? //새로운 커스텀 보드 생성페이지
					<div className='custom_title'>
						<CustomInput type={'new'} completeAdd={afterAdd} />
					</div>
					: <button className="add_customs"
						tabIndex={-1}
						onClick={(e) => {
							if (props.tabNames.length >= 4) return alert('더이상 탭을 추가할 수 없습니다');
							changeTab(e);
						}} />
				}
			</div>
		</>
	);
}