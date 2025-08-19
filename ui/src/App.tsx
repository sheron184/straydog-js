import './App.css';
import Layout from './layout';
import { useQueryParams } from './hooks/use-query';

import { HomePage } from './pages/home';
import { LogPage } from './pages/log';

function App() {
  const query = useQueryParams();

  const PageComponent = () => {
    switch (query.page) {
      case 'home':
        return <HomePage />;
      case 'log':
        return <LogPage />;
      default:
        return <HomePage />;
    }
  }

  return (
    <Layout>
      <PageComponent />
    </Layout>
  )
}

export default App;
