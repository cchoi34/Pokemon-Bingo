import './App.css';
import Home from './Components/Home';
import Rules from './Components/Rules';
import React from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import NotFound from './Components/NotFound';
import Board from './Components/Board';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/rules' component={Rules} />
          <Route path='/board/:id' component={Board} />
          <Route exact path='/board' component={Board} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
