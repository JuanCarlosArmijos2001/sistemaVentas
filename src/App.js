import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PaginaInicio from './components/paginaInicio';

function App() {
  return (
    <Router>
      <div>
        <PaginaInicio />
      </div>
    </Router>
  );
}

export default App;