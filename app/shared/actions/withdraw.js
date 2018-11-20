import * as types from './types';

import eos from './helpers/eos';
import { getCurrencyBalance } from './accounts';

export function withdraw(owner, bitsharesAccount, quantity) {
  return (dispatch: () => void, getState) => {
    const {
      connection
    } = getState();
    dispatch({
      type: types.SYSTEM_WITHDRAW_PENDING
    });
    try {
      return eos(connection, true).transaction('beos.gateway', contract => {
        contract.withdraw(
          owner,
          bitsharesAccount,
          quantity,
          ''
        );
      }, {
        broadcast: connection.broadcast,
        expireInSeconds: connection.expireInSeconds,
        sign: connection.sign
      }).then((tx) => {
        // If this is an offline transaction, also store the ABI
        if (!connection.sign) {
          return eos(connection, true).getAbi('beos.gateway').then((contract) =>
            dispatch({
              payload: {
                contract,
                tx
              },
              type: types.SYSTEM_WITHDRAW_SUCCESS
            }));
        }
        dispatch(getCurrencyBalance(owner));
        return dispatch({
          payload: { tx },
          type: types.SYSTEM_WITHDRAW_SUCCESS
        });
      }).catch((err) => dispatch({
        payload: { err },
        type: types.SYSTEM_WITHDRAW_FAILURE
      }));
    } catch (err) {
      return dispatch({
        payload: { err },
        type: types.SYSTEM_WITHDRAW_FAILURE
      });
    }
  };
}

export default {
  withdraw
};
