import { combineReducers } from 'redux';
import {
  REMEMBER_ME,
  CHANGE_THEME,
  USER_LOADED,
  FAIL_TO_LOAD_USER,
} from './constants';
import modelMap from './modelMap';

const {
  sessionReducer,
  userReducer,
  userSettingReducer,
  recoveryTokenReducer,

  challengeRecoveryTokenReducer,
  resetPasswordRequestReducer,
  memoReducer,
} = modelMap.reducers;

const persistence = (state = { rememberUser: false }, action) => {
  switch (action.type) {
  case REMEMBER_ME:
    return {
      ...state,
      rememberUser: action.rememberUser,
    };

  case CHANGE_THEME: {
    if (action.uiTheme && state.uiTheme
      && action.uiTheme.direction === state.uiTheme.direction
      && action.uiTheme.paletteType === state.uiTheme.paletteType
    ) {
      break;
    }
    return {
      ...state,
      uiTheme: action.uiTheme,
    };
  }

  default:
    break;
  }
  return state;
};

const appTempState = (state = {}, action) => {
  switch (action.type) {
  case USER_LOADED:
    return {
      ...state,
      userLoaded: true,
    };

  case FAIL_TO_LOAD_USER:
    return {
      ...state,
      loadUserError: action.error,
    };

  default:
    break;
  }
  return state;
};

export default combineReducers({
  sessions: sessionReducer,
  users: userReducer,
  userSettings: userSettingReducer,
  recoveryTokens: recoveryTokenReducer,
  challengeRecoveryTokens: challengeRecoveryTokenReducer,
  resetPasswordRequests: resetPasswordRequestReducer,
  memos: memoReducer,
  persistence,
  appTempState,
});
