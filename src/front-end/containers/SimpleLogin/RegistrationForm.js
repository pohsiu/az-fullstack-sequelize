/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { messages } from '~/containers/App/translation';
import translateMessages from '~/utils/translateMessages';
import {
  FormSpace,
  FormContent,
  FormTextInput,
  FormPasswordInput,
  FormCheckbox,
  InternalLink as Link,
} from '~/components/SignInSignUp';

import FormInputLinker, {
  FromTextInputGetProps,
  FromPasswordVisibilityGetProps,
  assert,
} from '~/utils/FormInputLinker';

import SuccessButton from '~/components/Buttons/SuccessButton';

import createFormPaperStyle from '~/styles/FormPaper';
import {
  isValidPassword,
} from 'common/utils/validators';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.fil = new FormInputLinker(this, {
      namespace: 'register',
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
      validate: value => assert(isValidPassword(value), null, { key: 'wrongPasswordFormatError' }),
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
      agreed: false,
    });
  }

  onAgreementChange = () => {
    this.setState({ agreed: !this.state.agreed });
  };

  static getDerivedStateFromProps(props, state) {
    if (state.fil) {
      return state.fil.derivedFromProps(props, state);
    }

    // No state update necessary
    return null;
  }

  handleSubmit = () => {
    const {
      comfirmUserAgreement = false,
      onSubmit = () => {},
    } = this.props;

    const {
      username,
      password,
    } = this.fil.getOutputs();

    if ((!comfirmUserAgreement || this.state.agreed) && this.fil.validate()) {
      onSubmit(username, password);
    }
  }

  handleEnterForTextField = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
      event.preventDefault();
    }
  };

  render() {
    const {
      intl,
      comfirmUserAgreement = false,
      classes,
    } = this.props;
    const translate = translateMessages.bind(null, intl, messages);
    const translated = translateMessages(intl, messages, [
      'username',
      'password',
      'createAccount',
      'createAccountV',
      'terms',
      'privacyPolicy',
    ]);

    const userAgreementLable = (
      <FormattedMessage
        {...messages.userAgreement}
        values={{
          createAccountV: translated.createAccountV,
          terms: (<Link key="terms" text={translated.terms} />),
          privacyPolicy: (<Link key="privacyPolicy" text={translated.privacyPolicy} />),
        }}
      >
        {(...parts) => (
          <Typography
            variant="body1"
            className={classes.textContainer}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            {parts}
          </Typography>
        )}
      </FormattedMessage>
    );

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
          <FormSpace variant="content2" />
          {
            !!comfirmUserAgreement && (
              <FormCheckbox
                dense="true"
                color="primary"
                checked={this.state.agreed}
                onChange={this.onAgreementChange}
                label={userAgreementLable}
                onKeyPress={this.handleEnterForTextField}
              />
            )
          }
          <FormSpace variant="content2" />
          {
            !comfirmUserAgreement && (userAgreementLable)
          }
          <SuccessButton
            variant="raised"
            fullWidth
            color="primary"
            disabled={comfirmUserAgreement && !this.state.agreed}
            className={classes.loginBtn}
            onClick={this.handleSubmit}
          >
            {translated.createAccount}
          </SuccessButton>
          <FormSpace variant="content1" />
        </FormContent>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(createFormPaperStyle),
)(RegistrationForm);
