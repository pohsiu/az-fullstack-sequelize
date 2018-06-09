import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SendRecovryCode from './SendRecovryCode';
import EnterRecovryCode from './EnterRecovryCode';
import ResetCompleted from './ResetCompleted';
import ResetPassword from './ResetPassword';
import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';

import {
  clearSensitiveData,
} from '~/containers/App/actions';

import modelMap from '~/containers/App/modelMap';

const {
  postChallengeRecoveryTokens,
  postResetPasswordRequests,
} = modelMap.waitableActions;

let styles = theme => ({
});

class RecoveryForm extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    username: PropTypes.object,
    recoveringUsername: PropTypes.string,
    recoveringCode: PropTypes.string,
  };

  static getDerivedStateFromProps(props, prevState) {
    let retval = null;
    if(props.recoveringUsername !== undefined){
      retval = retval || {};
      retval.recoveringUsername = props.recoveringUsername;
    }

    if(props.recoveringCode !== undefined){
      retval = retval || {};
      retval.recoveringCode = props.recoveringCode;
    }

    // No state update necessary
    return retval;
  }

  constructor(props){
    super(props);
    this.state = {
      recoveringUsername: this.props.recoveringUsername,
      recoveringCode: this.props.recoveringCode,
    };
  }

  handleCodeSent = ({
    recoveringUsername,
    remainingTime,
  }) => {
    this.setState({
      recoveringUsername,
      lastUpdatedTime: new Date().getTime(),
      remainingTime,
      lastSentUsername: recoveringUsername,
    });
  }

  handleBackToEnterTheCode = ({
    recoveringUsername,
  }) => {
    this.setState({
      recoveringUsername,
    });
  }

  handleResend = () => {
    this.setState({
      recoveringUsername: null,
      recoveringCode: null,
    });
  }

  handleChallenge = ({ username, code }) => {
    const { postChallengeRecoveryTokens, intl } = this.props;
    postChallengeRecoveryTokens({ username, token: code })
    .then(({ data }) => {
      if(data.passed){
        this.setState({
          recoveringCode: code,
          recoveryCodeError: null,
        });
      }else{
        const translated = translateMessages(intl, messages, [
          'worngCode',
        ]);
        this.setState({
          recoveringCode: null,
          recoveryCodeError: translated.worngCode,
        });
      }
    });
  }

  handleResetPassword = ({ username, code, newPassword }) => {
    const { postResetPasswordRequests, intl } = this.props;
    postResetPasswordRequests({
      username,
      token: code,
      newPassword,
    })
    .then(({ data }) => {
      // console.log('data :', data);
      if(data.passed){
        this.setState({
          resetCompleted: data.passed,
        });
      }else{
        const translated = translateMessages(intl, messages, [
          'worngCodeFromUrl',
        ]);
        this.setState({
          recoveryCodeError: translated.worngCodeFromUrl,
        });
      }
    });
  }

  backToLoginPage = () => {
    const {
      clearSensitiveData,
      push,
      onBackToLogin = () => {},
    } = this.props;

    clearSensitiveData();
    push('/login');
    onBackToLogin();
  }

  render(){
    const {
      postChallengeRecoveryTokens,
      onUsernameChange,
      username,
      usernameError,
      intl,
      ...rest
    } = this.props;
    const {
      recoveringUsername,
      recoveringCode,
      lastSentUsername,
      lastUpdatedTime = 0,
      remainingTime = 0,
      recoveryCodeError,
      resetCompleted,
    } = this.state;

    let child = null;
    if(resetCompleted){
      child = (
        <ResetCompleted
          onBackToLogin={this.backToLoginPage}
        />
      );
    }else if(recoveringUsername && recoveringCode){
      child = (
        <ResetPassword
          recoveringUsername={recoveringUsername}
          recoveringCode={recoveringCode}
          recoveryCodeError={recoveryCodeError}
          onResetPassword={this.handleResetPassword}
        />
      );
    }else if(recoveringUsername){
      child = (
        <EnterRecovryCode
          recoveringUsername={recoveringUsername}
          onResend={this.handleResend}
          onChallenge={this.handleChallenge}
          recoveryCodeError={recoveryCodeError}
        />
      );
    }else{
      child = (
        <SendRecovryCode
          onUsernameChange={onUsernameChange}
          username={username}
          usernameError={usernameError}
          lastSentUsername={lastSentUsername}
          lastUpdatedTime={lastUpdatedTime}
          remainingTime={remainingTime}
          onCodeSent={this.handleCodeSent}
          onBackToEnterTheCode={this.handleBackToEnterTheCode}
        />
      );
    }
    return (
      <React.Fragment>
        {child}
      </React.Fragment>
    );
  }
}


export default compose(
  connect(null, {
    postChallengeRecoveryTokens,
    postResetPasswordRequests,
    push,
    clearSensitiveData,
  }),
  injectIntl,
  withStyles(styles),
)(RecoveryForm);
