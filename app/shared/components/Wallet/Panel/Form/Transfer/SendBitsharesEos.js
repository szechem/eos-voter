// @flow
import React, { Component } from 'react';
import { Button, Divider, Form, Icon, Segment } from 'semantic-ui-react';
import { translate } from 'react-i18next';

import FormFieldMultiToken from '../../../../Global/Form/Field/MultiToken';
import GlobalFormFieldAccount from '../../../../Global/Form/Field/Account';
import WalletPanelFormTransferSendConfirmingBitsharesEos from './Send/ConfirmingBitsharesEos';

class WalletPanelFormTransferSendBitsharesEos extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      asset: 'EOS',
      confirming: false,
      from: props.settings.account,
      quantity: '',
      submitDisabled: true,
      to: '',
      waiting: false,
      waitingStarted: 0
    };
  }

  onConfirm = () => {
    const {
      from,
      quantity,
      asset,
      to
    } = this.state;
    this.setState({ confirming: false }, () => {
      this.props.actions.transfer(from, to, quantity, 'memo', asset);
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
    const newState = { [name]: value };
    const re = /^[a-z1-5]+$/;
    if (name === 'to') {
      if (re.test(value) && (value.length === 12)) {
        newState.submitDisabled = false;
      } else {
        newState.submitDisabled = true;
      }
    }
    this.setState(newState);
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
      confirming,
      from,
      quantity,
      submitDisabled,
      to,
      waiting,
      waitingStarted
    } = this.state;

    const balance = balances[settings.account];
    let destinationAccountValidation = null;

    if (submitDisabled === true) {
      destinationAccountValidation = <p>{`${t('transfer_account_validation_error')}`}</p>;
    }

    return (
      <Form
        loading={system.TRANSFER === 'PENDING'}
        onSubmit={this.onSubmit}
      >
        {(confirming)
          ? (
            <WalletPanelFormTransferSendConfirmingBitsharesEos
              asset={asset}
              balances={balances}
              from={from}
              onBack={this.onBack}
              onConfirm={this.onConfirm}
              quantity={quantity}
              to={to}
              waiting={waiting}
              waitingStarted={waitingStarted}
            />
          ) : (
            <Segment basic clearing>
              <GlobalFormFieldAccount
                autoFocus
                fluid
                label={t('transfer_label_to')}
                name="to"
                onChange={this.onChange}
                value={to}
              />
              {destinationAccountValidation}
              <FormFieldMultiToken
                balances={balances}
                icon="x"
                label={t('transfer_label_token_and_quantity')}
                loading={false}
                maximum={balance[asset]}
                name="quantity"
                onChange={this.onChange}
                settings={settings}
                value={quantity}
              />
              <p>
                {`${balance[asset].toFixed(4)} ${asset} ${t('transfer_header_available')}`}
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

export default translate('transfer')(WalletPanelFormTransferSendBitsharesEos);
