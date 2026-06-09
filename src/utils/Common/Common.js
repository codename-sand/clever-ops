import { ApiGet } from "@services";
import $ from 'jquery';
import moment from 'moment';

export const embedHtml = ( uid, html ) => {
    $('#' + uid).replaceWith("<div id='" + uid + "'>" + html + "</div>");
};

export const embedDisabled = (uid, flag) => {
    $('#'+uid).attr("disabled", flag);
};

// API를 통해 데이터를 가져와 Data 세팅(덮어 쓰기)
export const updateAPIData = async ( url, origin_data, data_key, setData ) => {
    let new_data = await ApiGet(url);
    if (new_data === null || !(data_key in new_data)) {
        if (origin_data.length > 0){
            // console.log('origin_data.length >>>> ');
            setData([]);
        }
    }
    else {
        new_data = new_data[data_key];
        if (JSON.stringify(origin_data) !== JSON.stringify(new_data))
            setData(new_data);
    }
};

export const strftime = (time, format='YYYY-MM-DD HH:mm:ss') => {
    return moment(time).format(format);
};

export const strftimeNow = (format='YYYY-MM-DD HH:mm:ss') => {
    return moment(Date.now()).format(format);
};

export const encodeURL = (url) => {
    let tmp = url.split('?');
    const path = tmp.shift();
    if (tmp.length === 0)        // query params 없는 경우
        return url
    const query_param = tmp.join('?');

    const urlParams = new URLSearchParams(query_param);
    for (let entry of urlParams.entries()){
        urlParams.set(entry[0], entry[1])
    }
    const encodedURL = path + '?' + urlParams
    return encodedURL;
};
