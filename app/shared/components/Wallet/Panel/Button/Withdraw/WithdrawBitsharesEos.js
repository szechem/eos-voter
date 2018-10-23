// @flow
import React, { Component } from 'react';
import { translate } from 'react-i18next';

import GlobalTransactionModal from '../../../../Global/Transaction/Modal';
import WalletPanelFormWithdrawBitsharesEos from '../../Form/Withdraw/WithdrawBitsharesEos';

type Props = {
  actions: {
    clearSystemState: () => void
  },
  blockExplorers: {},
  balances: {},
  settings: {},
  system: {},
  t: () => void
};

class WalletPanelButtonWithdrawBitsharesEos extends Component<Props> {
  props: Props;

  render() {
    const {
      actions,
      blockExplorers,
      balances,
      settings,
      system,
      t
    } = this.props;

    return (
      <GlobalTransactionModal
        actionName="TRANSFER"
        actions={actions}
        blockExplorers={blockExplorers}
        button={{
          color: 'blue',
          content: t('withdraw_send_button_cta'),
          fluid: true,
          icon: 'arrow circle up'
        }}
        content={(
          <WalletPanelFormWithdrawBitsharesEos
            actions={actions}
            balances={balances}
            settings={settings}
            system={system}
          />
        )}
        icon="arrow circle up"
        title={t('withdraw_modal_title')}
        settings={settings}
        system={system}
      />
    );
  }
}

export default translate('withdraw')(WalletPanelButtonWithdrawBitsharesEos);
