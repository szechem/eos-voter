// @flow
import React, { Component } from 'react';
import { Button, Divider, Form, Icon, Segment } from 'semantic-ui-react';
import { translate } from 'react-i18next';

import FormFieldMultiToken from '../../../../Global/Form/Field/MultiToken';
import GlobalFormFieldAccount from '../../../../Global/Form/Field/Account';
import WalletPanelFormWithdrawBitsharesEosConfirming from './ConfirmingBitsharesEos';

class WalletPanelFormWithdrawBitsharesEos extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      asset: 'PXBTS',
      bitsharesAccount: '',
      bitsharesAccountValidationError: false,
      confirming: false,
      isBitsharesAccount: false,
      isValidatingBitsharesAccount: false,
      owner: props.settings.account,
      quantity: '',
      quantityDisabled: true,
      submitDisabled: true,
      waiting: false,
      waitingStarted: 0
    };
  }

  onConfirm = () => {
    const {
      owner,
      bitsharesAccount,
      quantity
    } = this.state;
    this.setState({ confirming: false }, () => {
      this.props.actions.withdraw(owner, bitsharesAccount, quantity);
    });
  }

  onSubmit = () => {
    this.setState({
      confirming: true,
      waiting: true,
      waitingStarted: new Date()
    });
    const tick = setInterval(this.tick, 250);
    // Make the user wait 3 seconds before they can confirm
    setTimeout(() => {
      clearInterval(tick);
      this.setState({
        waiting: false
      });
    }, 3000);
  }

  tick = () => this.setState({ waiting: true });

  onCancel = (e) => {
    this.setState({
      confirming: false,
      waiting: false
    });
    e.preventDefault();
    return false;
  }

  onChange = (e, { name, value }) => {
    if ((name === 'bitsharesAccount') && (value !== '')) {
      if (this.state.bitsharesAccountValidationError === false) {
        this.setState({
          isBitsharesAccount: true,
          isValidatingBitsharesAccount: true
        });
      }
      this.bitsharesAccountValidation('https://api.blocktrades.us/api/v2', value);
    }
    const newState = { [name]: value };
    newState.submitDisabled = false;
    this.setState(newState);
    if (name === 'quantity') {
      this.setState({
        quantityDisabled: false
      });
    }
  }

  bitsharesAccountValidation = (url, account) => {
    const validationUrl = `${url}/wallets/bitshares2/address-validator?address=${account}`;
    const validationPromise = fetch(validationUrl, {
      method: 'get',
      headers: new Headers({ Accept: 'application/json' })
    }).then(response => response.json());
    validationPromise
      .then(result => {
        setTimeout(() => {
          this.setState({
            bitsharesAccountValidationError: false,
            isValidatingBitsharesAccount: false
          });
          if (result.isValid) {
            this.setState({
              isBitsharesAccount: true
            });
          } else {
            this.setState({
              isBitsharesAccount: false
            });
          }
        }, 300);
        return null;
      }).catch(() => {
        this.setState({
          bitsharesAccountValidationError: true,
          isValidatingBitsharesAccount: false,
          isBitsharesAccount: true
        });
        return null;
      });
  }

  onBack = () => {
    this.setState({
      confirming: false
    });
  }

  render() {
    const {
      balances,
      onClose,
      settings,
      system,
      t
    } = this.props;
    const {
      asset,
      bitsharesAccount,
      bitsharesAccountValidationError,
      confirming,
      isBitsharesAccount,
      isValidatingBitsharesAccount,
      owner,
      quantity,
      quantityDisabled,
      waiting,
      waitingStarted
    } = this.state;

    let {
      submitDisabled
    } = this.state;

    let invalidBitsharesAccount = null;
    let invalidBitsharesAccountValidation = null;
    let bitsharesAccountValidation = null;

    if ((bitsharesAccount === '')
        || (isBitsharesAccount === false)
        || (quantityDisabled === true)
        || (isValidatingBitsharesAccount === true)) {
      submitDisabled = true;
    }

    if (bitsharesAccount !== '') {
      if ((isBitsharesAccount === false) && (bitsharesAccountValidationError === false)) {
        invalidBitsharesAccount = <p className="beos-validation-error">{`${t('withdraw_invalid_account')}`}</p>;
      }

      if (bitsharesAccountValidationError === true) {
        invalidBitsharesAccountValidation = <p className="beos-validation-error">{`${t('withdraw_account_validation_error')}`}</p>;
      }

      if (isValidatingBitsharesAccount === true) {
        bitsharesAccountValidation = <p className="beos-validation-error">{`${t('withdraw_bitshares_account_validation')}`}</p>;
      }
    }

    const balance = balances[settings.account];

    return (
      <Form
        loading={system.WITHDRAW === 'PENDING'}
        onSubmit={this.onSubmit}
      >
        {(confirming)
          ? (
            <WalletPanelFormWithdrawBitsharesEosConfirming
              asset={asset}
              balances={balances}
              bitsharesAccount={bitsharesAccount}
              owner={owner}
              onBack={this.onBack}
              onConfirm={this.onConfirm}
              quantity={quantity}
              waiting={waiting}
              waitingStarted={waitingStarted}
            />
          ) : (
            <Segment basic clearing>
              <GlobalFormFieldAccount
                autoFocus
                fluid
                label={t('withdraw_label_bitshares_account')}
                name="bitsharesAccount"
                onChange={this.onChange}
                value={bitsharesAccount}
              />
              {bitsharesAccountValidation}
              {invalidBitsharesAccount}
              {invalidBitsharesAccountValidation}
              <FormFieldMultiToken
                balances={balances}
                icon="x"
                label={t('withdraw_label_token_and_quantity')}
                loading={false}
                maximum={balance[asset]}
                name="quantity"
                onChange={this.onChange}
                settings={settings}
                value={quantity}
              />
              <p>
                {`${balance[asset].toFixed(4)} ${asset} ${t('withdraw_header_available')}`}
              </p>

              <Divider />
              <Button
                content={t('confirm')}
                disabled={submitDisabled}
                floated="right"
                primary
              />
              <Button
                onClick={onClose}
              >
                <Icon name="x" /> {t('cancel')}
              </Button>
            </Segment>
          )}
      </Form>
    );
  }
}

export default translate('withdraw')(WalletPanelFormWithdrawBitsharesEos);
