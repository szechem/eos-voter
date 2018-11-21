// @flow
import React, { Component } from 'react';
import { translate } from 'react-i18next';

import { Header, Segment } from 'semantic-ui-react';

class WalletPanelFormStakeStats extends Component<Props> {
  render() {
    const {
      connection,
      cpuOriginal,
      chainSymbolBalance,
      netOriginal,
      t
    } = this.props;

    return (
      <Segment.Group horizontal>
        <Segment>
          <Header textAlign="center">
            {(chainSymbolBalance).toFixed(4)} {connection.chainSymbol || 'BEOS'}
            <Header.Subheader>
              {t('amount_unstaked')}
            </Header.Subheader>
          </Header>
        </Segment>
        <Segment>
          <Header textAlign="center">
            {cpuOriginal.toFixed(4)} {connection.chainSymbol || 'BEOS'}
            <Header.Subheader>
              {t('cpu_that_is_staked')}
            </Header.Subheader>
          </Header>
        </Segment>
        <Segment>
          <Header textAlign="center">
            {netOriginal.toFixed(4)} {connection.chainSymbol || 'BEOS'}
            <Header.Subheader>
              {t('net_that_is_staked')}
            </Header.Subheader>
          </Header>
        </Segment>
      </Segment.Group>
    );
  }
}

export default translate('stake')(WalletPanelFormStakeStats);
