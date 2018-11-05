// @flow
import React, { Component } from 'react';
import { Button, Divider, Form, Icon, Segment } from 'semantic-ui-react';
import { translate } from 'react-i18next';

import FormFieldMultiToken from '../../../../Global/Form/Field/MultiToken';
import WalletPanelFormWithdrawBitsharesEosConfirming from './ConfirmingBitsharesEos';

class WalletPanelFormWithdrawBitsharesEos extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      asset: 'PXBTS',
      confirming: false,
      owner: props.settings.account,
      quantity: '',
      submitDisabled: true,
      waiting: false,
      waitingStarted: 0
    };
  }

  onConfirm = () => {
    const {
      owner,
      quantity
    } = this.state;
    this.setState({ confirming: false }, () => {
      this.props.actions.withdraw(owner, quantity);
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
    newState.submitDisabled = false;
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
      owner,
      quantity,
      submitDisabled,
      waiting,
      waitingStarted
    } = this.state;

    const balance = balances[settings.account];

    return (
      <Form
        loading={system.TRANSFER === 'PENDING'}
        onSubmit={this.onSubmit}
      >
        {(confirming)
          ? (
            <WalletPanelFormWithdrawBitsharesEosConfirming
              asset={asset}
              balances={balances}
              owner={owner}
              onBack={this.onBack}
              onConfirm={this.onConfirm}
              quantity={quantity}
              waiting={waiting}
              waitingStarted={waitingStarted}
            />
          ) : (
            <Segment basic clearing>
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

export default translate('transfer')(WalletPanelFormWithdrawBitsharesEos);
