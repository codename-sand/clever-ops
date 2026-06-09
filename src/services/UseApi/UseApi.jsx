import { useReducer, useEffect } from 'react';
import Axios from 'axios';
import { encodeURL } from '@utils';

//data
import graphData from "../../_apiDatas/dashboard/tabGraph/graph1.json";

Axios.defaults.withCredentials = true;
export const api = Axios.create({
  timeout: 1800000, // 600000,
  // baseURL: 'https://10.2.13.76/',
  // baseURL: 'https://kwpapi.kwp.lab/', 
  // baseURL: 'https://kwpapi.de.lab/', 
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

api.interceptors.response.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {loading: true, data: null, error: null};
    case 'SUCCESS':
      return {loading: false, data: action.data, error: null};
    case 'ERROR':
      return {loading: false, data: null, error: action.error};
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function useAsync(callback, deps = []) {
  const [state, dispatch] = useReducer(reducer, {loading: false, data: null, error: false});

  const fetchData = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const data = await callback();
      dispatch({ type: 'SUCCESS', data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return [state, fetchData];
}

export function useApiGet(url, deps= []) {
  const [state, refresh] = useAsync(async () => {
    const response = await api.get(url, {withCredentials: true});
    return response.data;
  }, deps);
  
  return [state, refresh];
}

export const apiPromiseGet = (url, getDataFunc, getErrorFunc = null, index) => {
  // console.log('apiPromiseGet')
  // console.log(url)
  const promise = new Promise((resolve, reject) => {
    const encodedURL = encodeURL(url);
    // console.log(encodeURL);
    api.get(encodedURL, { withCredentials: true })
      .then((res) => {
        // if (res.data.code === 401) {
        //   getErrorFunc('/login');
        // }
        try {
          // getDataFunc(res.data); 
          getDataFunc(res.data[index]); 
        } catch(e) {
          // getDataFunc(res.data);
          getDataFunc(res.data[index]);
        }
        // resolve(res.data);
        resolve(res.data);
      })
      .catch((e) => {
        if (getErrorFunc === null) {
          // console.log("err >>", e);
          // useNavigate('/login');
        } else {
          // console.log("err >>", e);
        }
      });
  })
  return promise;
};

export const ApiGet = async (url, getErrorFunc = null) => {
  try{
    const encodedURL = encodeURL(url);
    const res = await api.get(encodedURL, { withCredentials: true });
    if (res.data.code === 401) {
      getErrorFunc('/login');
    }
    return res.data
  } catch(e) {
    if (getErrorFunc === null) {
      // console.log("err >>", e);
    } else {
      // console.log("err >>", e);
    }
  }
  return null;
}

export const ApiPost = async (url, data={}, header={}, getErrorFunc = null) => {
  try{
    const encodedURL = encodeURL(url);
    const res = await api.post(encodedURL, data, header, { withCredentials: true });
    return res.data
  } catch(e) {
    if (getErrorFunc === null) {
      // console.log("err >>", e);
    } else {
      getErrorFunc(e)
    }
  }
  return 400
}

export const ApiPut = async (url, data={}, getErrorFunc = null) => {
  try{
    const encodedURL = encodeURL(url);
    const res = await api.put(encodedURL, data, { withCredentials: true });
    if (res.data.code === 200) {
      return res.data
    }
  } catch(e) {
    if (getErrorFunc === null) {
      // console.log("err >>", e);
    } else {
      getErrorFunc(e)
    }
  }
  alert("업데이트 실패");
  return {"code":400}
}

export const ApiDelete = async (url, data={}, getErrorFunc = null) => {
  try{
    const res = await api.delete(url, data, { withCredentials: true });
    return res.data
  } catch(e) {
    if (getErrorFunc === null) {
      // console.log("err >>", e);
    } else {
      getErrorFunc(e)
    }
  }
  return 400
}