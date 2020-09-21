import * as React from 'react';
import _round from 'lodash-es/round';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IMoneyFormatterProps {

    /**
     * Валюта @enum {eur, rub, usd}
     * @example rub
     */
    currency?: string;

    /**
     * Округление числа
     * @example 2
     */
    scale?: number;

    /**
     * Разрядность (при передаче int в значении)
     * @example 2
     */
    precision?: number;


    view?: CustomView;
    value?: any;
}

export const moneyFormat = (amount, currency, scale) => {
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

@components('ui')
export default class MoneyFormatter extends React.Component<IMoneyFormatterProps & IComponentsHocOutput> {

    static defaultProps = {
        scale: 2,
        precision: 0,
    };

    render() {
        const MoneyFormatterView = this.props.view || this.props.ui.getView('format.DefaultFormatterView');
        const value = this.props.precision > 0
            ? this.props.value / Math.pow(10, this.props.precision)
            : this.props.value;

        return <MoneyFormatterView
            value={moneyFormat(
                value,
                this.props.currency,
                this.props.scale
            )}
        />;
    }

}
