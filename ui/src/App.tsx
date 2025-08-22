import './App.css';
import Layout from './layout';
import { useQueryParams } from './hooks/use-query';

import { HomePage } from './pages/home';
import { LogPage } from './pages/log';

function App() {
  const query = useQueryParams();
  let PageComponent;

  switch (query.page) {
    case 'home':
      PageComponent = HomePage;
      break;
    case 'log':
      PageComponent = LogPage;
      break;
    default:
      PageComponent = HomePage;
  }

  return (
    <Layout>
      <PageComponent />
    </Layout>
  )
}

export default App;
