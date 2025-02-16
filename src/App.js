import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import CharacterList from './components/CharacterList'
import CharacterDetails from './components/CharacterDetails';

function App() {
  return (
    <div className='ui segment inverted'>
      <Router>
        <Routes>
          <Route path='/' element={<CharacterList/>}/>
          <Route path='/character/:id' element={<CharacterDetails/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
