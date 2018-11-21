// @flow
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Accordion, Menu, Segment } from 'semantic-ui-react';

import WalletPanelButtonBroadcast from './Button/Broadcast';
import WalletPanelButtonLock from './Button/Lock';

import WalletPanelButtonTransferReceive from './Button/Transfer/Receive';
import WalletPanelButtonTransferSendBitsharesEos from './Button/Transfer/SendBitsharesEos';

import WalletPanelButtonWithdrawBitsharesEos from './Button/Withdraw/WithdrawBitsharesEos';


class WalletPanelUnlocked extends Component<Props> {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    const {
      actions,
      balances,
      blockExplorers,
      connection,
      globals,
      validate,
      settings,
      system,
      transaction,
      t
    } = this.props;
    return (
      <div>
        {(settings.walletMode !== 'watch' && settings.walletMode !== 'ledger' && !settings.walletTemp)
          ? (
            <WalletPanelButtonLock
              lockWallet={actions.lockWallet}
            />
          )
          : ''
        }
        <Segment vertical>

          <Accordion
            as={Menu}
            fluid
            vertical
          >
            <Menu.Item>
              <Accordion.Title
                active={activeIndex === 0}
                content={t('wallet_actions')}
                index={0}
                onClick={this.handleClick}
              />
              <Accordion.Content
                active={activeIndex === 0}
              >
                <Segment.Group>
                  <Segment>
                    <WalletPanelButtonTransferSendBitsharesEos
                      actions={actions}
                      balances={balances}
                      blockExplorers={blockExplorers}
                      connection={connection}
                      validate={validate}
                      settings={settings}
                      system={system}
                    />
                  </Segment>
                  <Segment>
                    <WalletPanelButtonWithdrawBitsharesEos
                      actions={actions}
                      balances={balances}
                      blockExplorers={blockExplorers}
                      connection={connection}
                      settings={settings}
                      system={system}
                    />
                  </Segment>
                  <Segment>
                    <WalletPanelButtonTransferReceive
                      accountName={settings.account}
                    />
                  </Segment>
                  {(settings.walletMode === 'watch')
                    ? (
                      <Segment>
                        <WalletPanelButtonBroadcast
                          actions={actions}
                          blockExplorers={blockExplorers}
                          settings={settings}
                          system={system}
                          transaction={transaction}
                        />
                      </Segment>
                    )
                    : false
                  }
                </Segment.Group>
              </Accordion.Content>
            </Menu.Item>
            {(settings.walletMode === 'hot')
              ? (
                <Menu.Item>
                  <Accordion.Title
                    active={activeIndex === 1}
                    content={t('wallet_actions_advanced')}
                    index={1}
                    onClick={this.handleClick}
                  />
                  <Accordion.Content
                    active={activeIndex === 1}
                  >
                    <Segment basic>
                      <WalletPanelButtonBroadcast
                        actions={actions}
                        blockExplorers={blockExplorers}
                        settings={settings}
                        system={system}
                        transaction={transaction}
                      />
                    </Segment>
                  </Accordion.Content>
                </Menu.Item>
              )
              : false
            }
          </Accordion>
        </Segment>
      </div>
    );
  }
}

export default translate('wallet')(WalletPanelUnlocked);
