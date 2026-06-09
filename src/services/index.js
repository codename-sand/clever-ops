import { api, useAsync, useApiGet, apiPromiseGet, ApiGet, ApiPost, ApiPut, ApiDelete } from "./UseApi/UseApi"
import { useInterval } from "./UseInterval/UseInterval"

import { Provider, useDispatch, useSelector } from 'react-redux';
import { Store, persistor } from "./Store/Config"
import { setUser, setUseFavorite, togleUseFavorite, setLoginTime, setAlarmDatas, spliceAlarmData, setLastAlarm, setCurrentTabId, setNavigationWidth, setDefaultTime } from "./Store/UserSlice"

export { api, useAsync, useApiGet, apiPromiseGet, ApiGet, ApiPost, ApiPut, ApiDelete }
export { Provider, Store, persistor }
export { setUser, setUseFavorite, togleUseFavorite, setLoginTime, useInterval, setAlarmDatas, spliceAlarmData, setLastAlarm, setCurrentTabId, setNavigationWidth, setDefaultTime }

export const SetStore = (setter, value) => setter(value);
export const GetStore = (slice, key) => useSelector(store => store[slice][key]);
