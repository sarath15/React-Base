import React from 'react';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import {BrowserRouter,Switch} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import PublicRoute from './components/router/PublicRoute';
import PrivateRoute from './components/router/PrivateRoute';
import reducer from './reducers';
import 'jquery';
import App from './components/App';

const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

ReactDOM.render( <App />, document.getElementById('root'));
registerServiceWorker();
