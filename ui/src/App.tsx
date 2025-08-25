import React, { Suspense } from "react";
import Layout from "./layout";
import { useQueryParams } from "./hooks/use-query";
import { MainLoader } from "./components/main-loader";

const HomePage = React.lazy(() => import("./pages/home"));
const LogPage = React.lazy(() => import("./pages/log"));

function App() {
  const query = useQueryParams();

  let PageComponent;
  switch (query.page) {
    case "home":
      PageComponent = HomePage;
      break;
    case "log":
      PageComponent = LogPage;
      break;
    default:
      PageComponent = HomePage;
  }

  return (
    <Layout>
      <Suspense fallback={<MainLoader />}>
        <PageComponent />
      </Suspense>
    </Layout>
  );
}

export default App;
