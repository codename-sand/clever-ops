import { type } from "jquery";

export const getBokehElements = (name) => {
    let elementList = [];

    for (let i = 0; i < window.Bokeh.documents.length; i++) {

        let obj = window.Bokeh.documents[i]._all_models;

        for (let [id, element] of obj) {
            if (element.name === name) {
                elementList.push(element);
            };
        };
    };
    return elementList;
};

export const updateCDS = (target, new_data, cmpKey) => {
    if (cmpKey in target.data) {
        // console.log('cmpKey in target.data ========> ')

        let last_idx = target.data[cmpKey].length - 1;
        if (last_idx < 0)   // 최초 CDS 값 설정
            target.data = new_data;
        else {    // CDS 값 추가하기
            let new_data_len = new_data[cmpKey].length;
            if (target.data[cmpKey][last_idx] === new_data[cmpKey][0]) {
                for (let key in target.data) {
                    target.data[key].pop();
                }
                new_data_len = new_data_len - 1;  // pop한 1개 제외
            };
            // rollover
            for (let key in target.data)
                target.data[key].splice(0, new_data_len);
            target.stream(new_data);
        }
    }
    else  // CDS 덮어쓰고 싶을 시, 존재하지 않는 cmpKey 제공
        target.data = new_data;
};