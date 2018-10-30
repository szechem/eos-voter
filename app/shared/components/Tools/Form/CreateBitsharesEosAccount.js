// @flow
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import debounce from 'lodash/debounce';

import { Segment, Form, Header, Button, Icon, Table } from 'semantic-ui-react';

import FormFieldMultiToken from '../../Global/Form/Field/MultiToken';
import GlobalFormFieldAccount from '../../Global/Form/Field/Account';
import GlobalFormFieldKeyPublic from '../../Global/Form/Field/Key/Public';

class ToolsFormCreateBitsharesEosAccount extends Component<Props> {
  constructor(props) {
    super(props);
    const {
      accountName
    } = props;

    this.state = {
      asset: 'PXBTS',
      accountName,
      showAccountValidationError: false,
      showPublicActiveKeyError: false,
      showPublicOwnerKeyError: false,
      quantity: '',
      confirming: false,
      submitDisabled: true
    };
  }

  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick.bind(this), 30000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    const {
      account,
      actions
    } = this.props;
  }

  onSubmit = (e) => {
    this.setState({
      confirming: true
    });
    e.preventDefault();
    return false;
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.onSubmit(e);

      e.preventDefault();
      return false;
    }
  }

  onChange = debounce((e, { name, value, valid }) => {
    const newState = {
      showAccountValidationError: false,
      [name]: value
    };
    const re = /^[a-z1-5]+$/;
    if (name === 'accountName') {
      if (re.test(value) && (value.length === 12)) {
        newState.showAccountValidationError = false;
      } else {
        newState.showAccountValidationError = true;
      }
    }

    if (name === 'ownerKey') {
      if (!valid) {
        this.setState({
          showPublicOwnerKeyError: true
        });
      } else {
        this.setState({
          showPublicOwnerKeyError: false
        });
      }
    }

    if (name === 'activeKey') {
      if (!valid) {
        this.setState({
          showPublicActiveKeyError: true
        });
      } else {
        this.setState({
          showPublicActiveKeyError: false
        });
      }
    }

    this.setState(newState, () => {
      const {
        accountName
      } = this.state;

      const {
        actions
      } = this.props;

      const {
        checkAccountAvailability
      } = actions;

      if (name === 'accountName' && accountName.length !== 0) {
        checkAccountAvailability(accountName);
      }
    });
  }, 200)

  onBack = () => {
    this.setState({
      confirming: false
    });
  }

  onConfirm = () => {
    this.setState({
      confirming: false
    });

    const {
      actions
    } = this.props;

    const {
      createAccount
    } = actions;

    const {
      accountName,
      activeKey,
      ownerKey,
      quantity
    } = this.state;

    createAccount(
      accountName,
      activeKey,
      ownerKey,
      quantity
    );
  }

  render() {
    const {
      balances,
      hideCancel,
      onClose,
      settings,
      system,
      t
    } = this.props;

    const {
      asset,
      accountName,
      activeKey,
      quantity,
      ownerKey,
      showAccountValidationError
    } = this.state;

    let {
      submitDisabled
    } = this.state;

    const shouldShowConfirm = this.state.confirming;
    const shouldShowForm = !shouldShowConfirm;
    let accountTakenError = null;
    let accountValidationError = null;
    let publicActiveKeyError = null;
    let publicOwnerKeyError = null;

    if (system.ACCOUNT_AVAILABLE === 'FAILURE') {
      submitDisabled = true;
      accountTakenError = <p>{`${t('tools_account_taken_error')}`}</p>;
    }

    if (system.ACCOUNT_AVAILABLE === 'SUCCESS' && !showAccountValidationError) {
      submitDisabled = false;
    }

    if (showAccountValidationError) {
      submitDisabled = true;
      accountValidationError = <p>{`${t('tools_account_validation_error')}`}</p>;
    }

    if (this.state.showPublicActiveKeyError) {
      submitDisabled = true;
      publicActiveKeyError = <p>{`${t('tools_public_active_key_error')}`}</p>;
    }

    if (this.state.showPublicOwnerKeyError) {
      submitDisabled = true;
      publicOwnerKeyError = <p>{`${t('tools_public_owner_key_error')}`}</p>;
    }

    const balance = balances[settings.account];

    return (
      <Segment
        loading={system.CREATEACCOUNT === 'PENDING'}
      >
        {(shouldShowForm)
          ? (
            <div>
              <Form
                onKeyPress={this.onKeyPress}
                onSubmit={this.onSubmit}
              >
                <GlobalFormFieldKeyPublic
                  defaultValue=""
                  label={t('tools_form_create_account_owner_key')}
                  name="ownerKey"
                  onChange={this.onChange}
                />
                {publicOwnerKeyError}
                <GlobalFormFieldKeyPublic
                  defaultValue=""
                  label={t('tools_form_create_account_active_key')}
                  name="activeKey"
                  onChange={this.onChange}
                />
                {publicActiveKeyError}
                <GlobalFormFieldAccount
                  label={t('tools_form_create_account_account_name')}
                  name="accountName"
                  onChange={this.onChange}
                  value={accountName || ''}
                />
                {accountTakenError}
                {accountValidationError}
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
                <Segment basic clearing>
                  {(!hideCancel)
                    ? (
                      <Button
                        content={t('tools_form_create_account_cancel')}
                        color="grey"
                        onClick={onClose}
                      />
                    ) : ''}

                  <Button
                    content={t('tools_form_create_account_button')}
                    color="green"
                    disabled={submitDisabled}
                    floated="right"
                    primary
                  />
                </Segment>
              </Form>
            </div>
          ) : ''}

        {(shouldShowConfirm)
          ? (
            <Segment padding="true" basic>
              <Header textAlign="center">
                <p>{`${t('tools_account_creation_header')}`}</p>
              </Header>
              <Table size="small" celled>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={8}>
                      {t('tools_form_create_account_owner_key')}
                    </Table.Cell>
                    <Table.Cell width={8}>
                      {ownerKey}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={8}>
                      {t('tools_form_create_account_active_key')}
                    </Table.Cell>
                    <Table.Cell width={8}>
                      {activeKey}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={8}>
                      {t('tools_form_create_account_account_name')}
                    </Table.Cell>
                    <Table.Cell width={8}>
                      {accountName}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={8}>
                      {t('transfer_label_quantity')}
                    </Table.Cell>
                    <Table.Cell width={8}>
                      {quantity}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <Button
                onClick={this.onBack}
              >
                <Icon name="arrow left" /> {t('tools_form_create_account_back')}
              </Button>
              <Button
                color="blue"
                floated="right"
                onClick={this.onConfirm}
              >
                <Icon name="check" /> {t('tools_form_create_account_button')}
              </Button>
            </Segment>
          ) : ''}
      </Segment>
    );
  }
}


export default translate('tools')(ToolsFormCreateBitsharesEosAccount);
