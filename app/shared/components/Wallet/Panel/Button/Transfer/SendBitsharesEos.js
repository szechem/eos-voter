// @flow
import React, { Component } from 'react';
import { translate } from 'react-i18next';

import GlobalTransactionModal from '../../../../Global/Transaction/Modal';
import WalletPanelFormTransferBitsharesEos from '../../Form/Transfer/SendBitsharesEos';

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

class WalletPanelButtonTransferBitsharesEos extends Component<Props> {
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
          content: t('transfer_send_bitshares_eos_button_cta'),
          fluid: true,
          icon: 'arrow circle up'
        }}
        content={(
          <WalletPanelFormTransferBitsharesEos
            actions={actions}
            balances={balances}
            settings={settings}
            system={system}
          />
        )}
        icon="arrow circle up"
        title={t('transfer_bitshares_eos_modal_title')}
        settings={settings}
        system={system}
      />
    );
  }
}

export default translate('transfer')(WalletPanelButtonTransferBitsharesEos);
