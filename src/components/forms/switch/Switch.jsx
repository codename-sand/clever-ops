import { React , useState, useEffect } from "react";
import { switchOff, switchOn } from "@/assets/img";
import { ApiPut } from "@services";
import { embedDisabled } from "@utils";

export const Switch = ({status, selectModel}) => {
    const [switchStatus, setSwitch] = useState('');
    const [active, setActive] = useState(false);
    const [progress, setProgress] = useState(false);
    const switchSrc = switchStatus ? switchOn : switchOff;

    useEffect(() => setSwitch(status), [status]);

    const handleSwitch = async () => {
        // const res = await ApiPut(`api_v1/service/models/update?column=is_run&value=${!switchStatus}&modelId=${selectModel}`, {}, setActive(false))
        // if (res.code === 200) {
            status = !status;
            setSwitch(!switchStatus);
            embedDisabled('switch'+selectModel, false);
        // }
        setProgress(false);
        
    }
    
    return(
        <button id={'switch_'+selectModel}
            style={{cursor:"pointer", backgroundImage:`url(${switchSrc})`}}
            onClick={(e) => {
                if (!progress && e.detail === 1) {
                        setProgress(true);
                        embedDisabled('switch'+selectModel, true);
                        handleSwitch()                    
                }
                // if(e.detail === 1) {
                    //     embedDisabled('switch'+selectModel, true);
                    //     handleSwitch()
                    // }
                }
            }
            className="switchBtn"></button>
    );
}
