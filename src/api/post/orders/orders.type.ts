import { CurrencyPair } from '../../../general/currency.general-type';

export type TOrderRes = {
  orderId: string,
}

export type TBaseOrderBody = {
  clientOid: string,

  side: 'buy' | 'sell',

  symbol: CurrencyPair,
};
