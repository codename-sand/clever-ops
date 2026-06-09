import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SelectBox } from "@components";
import { Loading } from "@components";
import { ApiGet, ApiPost, ApiDelete } from "@services";

//data
import diskInfoData from "../../_apiDatas/settings/diskInfo.json"

const host = 'https://kwpapi.kwp.lab/'   //'http://localhost:8000/'
const diskCleanList = [
    {
        name: "6개월 경과",
        value: "6"
    },
    {
        name: "1년 경과",
        value: "12"
    },
    {
        name: "2년 경과",
        value: "24"
    },
];

const downloadList = [
    {
        name: "1년 경과",
        value: "12"
    },
    {
        name: "2년 경과",
        value: "24"
    },
    {
        name: "3년 경과",
        value: "36"
    },
];

const findValueIndex = (list, value) => {
    let result = null;
    list.map((item, index) => 
        item.value === value ? result = index : null
    )
    return result;
}


export const Storage = () => {
    const navigate = useNavigate();
    const [delProgress, setDelProgress] = useState(false);
    const [dwnProgress, setDwnProgress] = useState(false);
    const [deleteValue, setDeleteValue] = useState(``);             // 디스크정리
    const [downValue,setDownvalue] = useState(``);      //운영데이터 추출
    const [diskInfo, setDiskInfo] = useState({
        'dbTotal': '',
        'dbUsage': '',
        'dbRate': '',
        'systemTotal': '',
        'systemUsage': '',
        'systemRate': '',
    });

    const getDiskInfo = async () => {
        // let res = await ApiGet(`api_v1/system/settings/diskInfo`, navigate);

        let res = diskInfoData;
        if (res.code === 200) {
            res.diskStatus.map((item, index) => {
                setDiskInfo((prev) => {
                    return {
                        ...prev,
                        [item.diskname]: item.value
                    }
                });
            });
        };
    };

    const deleteDisk = async () => {
        if (deleteValue !== '') {
            setDelProgress(true);
            const res = {code : 200};
            // const res = await ApiDelete(`api_v1/system/settings/deleteDisk?period=${deleteValue}`, navigate);
            if (res.code === 200) {
                getDiskInfo();
                alert("디스크 정리 완료")
            }
            setDelProgress(false);
        } else {
            alert("디스크 정리 기간을 선택해주세요.")
        }
    };

    const downloadCsv = async () => {
        if (downValue !== '') {
            setDwnProgress(true);
            alert("다운로드 되었습니다.")
            // const res = await ApiPost(`api_v1/system/settings/savecsv?period=${downValue}`, navigate);
            // if (res.code === 200) window.open(host+'api_v1/system/settings/download/tagCsv')
            // window.open(host+'api_v1/system/settings/download/tagCsv')
            setDwnProgress(false);
        } else {
            alert("운영 데이터 추출 기간을 선택해주세요.")
        }
    }
    useEffect(() => {
        getDiskInfo();
    }, []);

    return (
        <div className="setting_page">
            <p className="setting_title">저장소 관리</p>
            <div className="info_line">
                <p className="sub_title">DB 가용량</p>
                <p className="result"><span className="bold">{diskInfo.dbRate}</span> ({diskInfo.dbUsage} / {diskInfo.dbTotal} 사용 중)</p>
            </div>
            <div className="info_line">
                <p className="sub_title">시스템 가용량</p>
                <p className="result"><span className="bold">{diskInfo.systemRate}</span> ({diskInfo.systemUsage} / {diskInfo.systemTotal} 사용 중)</p>
            </div>
            <div className="info_line">
                <p className="sub_title" style={{ lineHeight: "40px" }}>디스크 정리</p>
                {delProgress && <Loading isFull={true} width={"100%"} height={"100%"} bg={false}/>}
                <div className="result">
                    <SelectBox innerList={diskCleanList} handleValue={setDeleteValue} defaultIndex={findValueIndex(diskCleanList, '')} label={'기간 선택'}/>
                    <button className="action_btn del_btn" onClick={deleteDisk}>삭제</button>
                </div>
            </div>
            <p className="notice">※ 디스크 정리 기간을 선택한 후 삭제버튼을 눌러주세요.</p>
            <div className="line"/>
            <p className="setting_title">데이터 추출</p>
            <div className="info_line">
                <p className="sub_title" style={{ lineHeight: "40px" }}>운영 데이터 추출</p>
                {dwnProgress && <Loading isFull={true} width={"100%"} height={"100%"} bg={false}/>}
                <div className="result">
                    <SelectBox innerList={downloadList} handleValue={setDownvalue} defaultIndex={findValueIndex(downloadList, '')} label={'기간 선택'}/>
                    <button className="action_btn save_btn" onClick={downloadCsv}>다운로드</button>
                </div>
            </div>
            
        </div>
    )
}