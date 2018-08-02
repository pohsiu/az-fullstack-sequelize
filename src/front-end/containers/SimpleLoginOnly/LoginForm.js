import React from 'react';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
  FormTextInput,
  FormPasswordInput,
  FormCheckbox,
} from '~/components/SignInSignUp';

import FormInputLinker, {
  FromTextInputGetProps,
  FromPasswordVisibilityGetProps,
  assert,
} from '~/utils/FormInputLinker';

import createCommonStyles from '~/styles/common';
import createFormPaperStyle from '~/styles/FormPaper';

const styles = theme => ({
  ...createFormPaperStyle(theme),
  ...createCommonStyles(theme, 'flex'),
});

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.fil = new FormInputLinker(this, {
      namespace: 'login',
    });
    this.fil.add({
      name: 'username',
      exposed: {
        onChange: 'onUsernameChange',
        value: 'username',
        error: 'usernameError',
      },
      getProps: (__, _) => ({
        ...FromTextInputGetProps(__, _),
        placeholder: _.translate('usernameEmptyError', {
          emailAddress: { key: 'emailAddress' },
          phoneNumber: { key: 'phoneNumber' },
        }),
      }),
      validate: value => assert(!!value, null, {
        key: 'usernameEmptyError',
        values: {
          emailAddress: { key: 'emailAddress' },
          phoneNumber: { key: 'phoneNumber' },
        },
      }),
    }, {
      name: 'password',
      exposed: {
        onChange: 'onPasswordChange',
        error: 'passwordError',
      },
      getProps: FromTextInputGetProps,
      validate: value => assert(value != null && value !== '', null, { key: 'passwordEmptyError' }),
    }, {
      name: 'password-visibility',
      defaultValue: false,
      getProps: FromPasswordVisibilityGetProps,
      converter: {
        fromView: (({ valueInState }) => !valueInState),
      },
    });

    this.state = this.fil.mergeInitState({
      fil: this.fil,
      rememberMe: this.props.defaultRememberMe !== undefined ? this.props.defaultRememberMe : false,
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (state.fil) {
      return state.fil.derivedFromProps(props, state);
    }

    // No state update necessary
    return null;
  }

  handleSubmit = () => {
    const {
      onSubmit = () => {},
    } = this.props;

    const {
      username,
      password,
    } = this.fil.getOutputs();

    if (this.fil.validate()) {
      onSubmit(username, password, this.state.rememberMe);
    }
  }

  handleEnterForTextField = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
      event.preventDefault();
    }
  };

  handleRememberMeChange = (event, checked) => {
    const {
      onRememberMeChange = () => {},
    } = this.props;
    onRememberMeChange(checked);
    this.setState({ rememberMe: checked });
  };

  render() {
    const {
      intl,
      classes,
    } = this.props;
    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'username',
      'password',
      'login',
      'rememberMe',
    ]);

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          <FormTextInput
            label={translated.username}
            onKeyPress={this.handleEnterForTextField}
            {...this.fil
              .getPropsForInputField('username', { translate })}
          />
          <FormSpace variant="content1" />
          <FormPasswordInput
            label={translated.password}
            onKeyPress={this.handleEnterForTextField}
            {...this.fil
              .getPropsForInputField('password', { translate })}
            {...this.fil
              .getPropsForInputField('password-visibility', { translate })}
          />
          <FormCheckbox
            dense="true"
            color="primary"
            checked={this.state.rememberMe}
            onChange={this.handleRememberMeChange}
            label={translated.rememberMe}
            onKeyPress={this.handleEnterForTextField}
          />
          <FormSpace variant="content1" />
          <Button
            variant="raised"
            fullWidth
            color="primary"
            className={classes.loginBtn}
            onClick={this.handleSubmit}
          >
            {translated.login}
          </Button>
          <FormSpace variant="content1" />
        </FormContent>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(styles),
)(LoginForm);
