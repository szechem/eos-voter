import * as types from './types';

import eos from './helpers/eos';
import { getCurrencyBalance } from './accounts';

export function decrease(owner, quantity, symbol = 'BEOS') {
  return (dispatch: () => void, getState) => {
    const {
      balances,
      connection
    } = getState();
    dispatch({
      type: types.SYSTEM_TRANSFER_PENDING
    });
    try {
      const contracts = balances.__contracts;
      const account = contracts[symbol].contract;
      return eos(connection, true).transaction('beos.gateway', contract => {
        contract.withdraw(
          owner,
          quantity,
        );
      }, {
        broadcast: connection.broadcast,
        expireInSeconds: connection.expireInSeconds,
        sign: connection.sign
      }).then((tx) => {
        // If this is an offline transaction, also store the ABI
        if (!connection.sign && account !== 'beos.gateway') {
          return eos(connection, true).getAbi(account).then((contract) =>
            dispatch({
              payload: {
                contract,
                tx
              },
              type: types.SYSTEM_TRANSFER_SUCCESS
            }));
        }
        dispatch(getCurrencyBalance(owner));
        return dispatch({
          payload: { tx },
          type: types.SYSTEM_TRANSFER_SUCCESS
        });
      }).catch((err) => dispatch({
        payload: { err },
        type: types.SYSTEM_TRANSFER_FAILURE
      }));
    } catch (err) {
      return dispatch({
        payload: { err },
        type: types.SYSTEM_TRANSFER_FAILURE
      });
    }
  };
}

export default {
  decrease
};
