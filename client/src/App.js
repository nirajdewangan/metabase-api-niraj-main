import Container from 'react-bootstrap/Container';
import { Routes , Route } from 'react-router-dom';
import Header from './components/shared/header/Header';
import Dashboard1 from './components/dashboards/section1/Dashboard1';
import IssueMessage from './components/dashboards/section1/issuemessage/IssueMessage';
function App() {
  return (
    
        <>
        <div className="container">
          <Header />
          <Routes >
            <Route exact path='/' element={<Dashboard1/>} />
            <Route exact path='/IssueMessage' element={<IssueMessage/>} />
          </Routes >
          </div>
          </>
    
  );
}

export default App;
