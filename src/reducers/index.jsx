import { combineReducers } from 'redux';
import {LOGIN_IS_COMPLETED,LOGIN_IS_PROGRESS,LOGIN_IS_FAILURE} from '../actions/Login';

const loginReducers = (state = {isRequestInProgress : false}, action) => {
  switch (action.type) {
    case LOGIN_IS_COMPLETED:
    case LOGIN_IS_FAILURE:  
    case LOGIN_IS_PROGRESS:  
      return Object.assign({},action);
    default:
      return state
  }
}

export default combineReducers({loginReducers})
