import { app } from "firebaseApp";
import "./App.css";
import Router from "./components/Router";
import { Layout } from "components/Layout";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useContext } from "react";

import { RecoilRoot } from "recoil";

import ThemeContext from "context/ThemeContext";
import Loading from "components/loading/Loading";

import { HelmetProvider } from "react-helmet-async";

import SEO from "components/SEO";

function App() {
  const auth = getAuth(app);
  const [init, setInit] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );
  const context = useContext(ThemeContext);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);

  return (
    <HelmetProvider>
      <SEO title="Puddy Puddy" description="반려동물 SNS" />
      <div className={context.theme === "light" ? "light" : "dark"}>
        <RecoilRoot>
          <Layout>
            {init ? <Router isAuthenticated={isAuthenticated} /> : <Loading />}
          </Layout>
        </RecoilRoot>
      </div>
    </HelmetProvider>
  );
}

export default App;
