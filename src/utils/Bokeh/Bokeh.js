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

export const clearBokehDocumentsByName = (names) => {
    if (!window.Bokeh || !Array.isArray(window.Bokeh.documents)) return;

    const targetNames = Array.isArray(names) ? names.filter(Boolean) : [names].filter(Boolean);
    if (targetNames.length === 0) return;

    for (const doc of window.Bokeh.documents) {
        let hasTargetModel = false;

        try {
            for (let [, element] of doc._all_models) {
                if (targetNames.includes(element.name)) {
                    hasTargetModel = true;
                    break;
                }
            }

            if (hasTargetModel) {
                if (typeof doc.clear === 'function') doc.clear();
                if (typeof doc.destroy === 'function') doc.destroy();
            }
        } catch (e) {
            continue;
        }
    }
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