// @flow
import React, { Component } from 'react';
import { Popup } from 'semantic-ui-react';
import Decimal from 'decimal.js';

const prettyBytes = require('pretty-bytes');

export default class GlobalDataBytes extends Component<Props> {
  render() {
    const {
      bytes
    } = this.props;

    const safeBytes = new Decimal(bytes).toNumber();

    return (
      <Popup
        content={`${safeBytes} B`}
        inverted
        trigger={
          <span>
            {` ${prettyBytes(safeBytes)} `}
          </span>
        }
      />
    );
  }
}
