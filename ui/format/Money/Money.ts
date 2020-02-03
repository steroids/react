import * as React from 'react';
import _round from 'lodash-es/round';

interface IMoneyProps {
    amount?: number | string;
    currency?: string;
    scale?: number;
}

export default class Money extends React.Component<IMoneyProps, {}> {
    static defaultProps = {
        scale: 2
    };

    render() {
        return Money.getAsString(
            this.props.amount,
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
