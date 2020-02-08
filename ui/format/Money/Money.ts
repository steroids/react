import * as React from 'react';
import _round from 'lodash-es/round';
import {IFormatterHocInput, IFormatterHocOutput} from '../../../hoc/formatter';
import {formatter} from '../../../hoc';

export interface IMoneyFormatterProps extends IFormatterHocInput {
    currency?: string;
    scale?: number;
}

interface IMoneyFormatterPrivateProps extends IFormatterHocOutput {

}

@formatter()
export default class Money extends React.Component<IMoneyFormatterProps & IMoneyFormatterPrivateProps> {
    static defaultProps = {
        scale: 2
    };

    render() {
        return Money.getAsString(
            this.props.value,
            this.props.currency,
            this.props.scale
        );
    }

    static getAsString(amount, currency, scale) {
        const symbols = {
            eur: __('€'),
            rub: __('₽'),
            usd: __('$')
        };
        return __('{amount, number} {symbol}', {
            amount: _round(amount, scale),
            symbol: symbols[currency] || currency.toUpperCase()
        });
    }
}
