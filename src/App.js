import { useLocation, Route, Routes } from "react-router-dom";
import { Navigation } from "@components";
import { Dashboard, Tags, Events, Models } from "@pages"
import { SystemInfo, ModelUpdate, Account, MailServer, Log, Storage } from "@pages/settings";
import { Login, RequireLogin } from "@pages/login";
import "@assets/scss/common.scss";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const pagename = location.pathname;
  const navCondition = pagename.includes('login') ? false : true;
  // const main = pagename.includes('dashboard') ? true : false;

  // useEffect(() => {
  //   console.log(main);
  //   // if(main) window.location.reload();
  // },[main]);


  return (
    <div className="wrap_container">
      <div className="routes_wrap">
        {navCondition && <Navigation />}
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/events" element={<Events />} />
          <Route path="/models" element={<Models />} />
          <Route path="/systemInfo" element={<SystemInfo />} />
          <Route path="/modelUpdate" element={<ModelUpdate />} />
          <Route path="/account" element={<Account />} />
          <Route path="/mailserver" element={<MailServer />} />
          <Route path="/log" element={<Log />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;