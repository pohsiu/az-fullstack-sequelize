import modelMap from '../modelMap';
import handleSessionEpics from './handleSessionEpics';
import handleUserSettingsEpics from './handleUserSettingsEpics';

const {
  postSessionsEpic,
  getSessionsEpic,
  getUserEpic,
  postUsersEpic,
  patchUserEpic,
  postRecoveryTokensEpic,

  getUserSettingsEpic,
  patchUserSettingEpic,

  postChallengeRecoveryTokensEpic,
  postResetPasswordRequestsEpic,

  getMemosEpic,
  postMemosEpic,
  patchMemoEpic,
} = modelMap.epics;


export default [
  ...handleSessionEpics,
  ...handleUserSettingsEpics,

  postSessionsEpic,
  getSessionsEpic,
  getUserEpic,
  postUsersEpic,
  patchUserEpic,

  getUserSettingsEpic,
  patchUserSettingEpic,

  postRecoveryTokensEpic,

  postChallengeRecoveryTokensEpic,
  postResetPasswordRequestsEpic,

  getMemosEpic,
  postMemosEpic,
  patchMemoEpic,
];
