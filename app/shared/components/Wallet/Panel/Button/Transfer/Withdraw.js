// @flow
import React, { Component } from 'react';
import { translate } from 'react-i18next';

import GlobalTransactionModal from '../../../../Global/Transaction/Modal';
import WalletPanelFormTransferWithdraw from '../../Form/Transfer/Withdraw';

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

class WalletPanelButtonTransferWithdraw extends Component<Props> {
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
          content: t('transfer_withdraw_beos_button_cta'),
          fluid: true,
          icon: 'arrow circle up'
        }}
        content={(
          <WalletPanelFormTransferWithdraw
            actions={actions}
            balances={balances}
            settings={settings}
            system={system}
          />
        )}
        icon="arrow circle up"
        title={t('transfer_modal_withdraw_title')}
        settings={settings}
        system={system}
      />
    );
  }
}

export default translate('transfer')(WalletPanelButtonTransferWithdraw);
