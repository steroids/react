import * as React from 'react';
import _round from 'lodash-es/round';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IMoneyFormatterProps {
    currency?: string;
    scale?: number;
    view?: CustomView;
    value?: any;
}

@components('ui')
export default class Money extends React.Component<IMoneyFormatterProps & IComponentsHocOutput> {
    static defaultProps = {
        scale: 2
    };

    render() {
        const MoneyFormatterView = this.props.view || this.props.ui.getView('format.DefaultFormatterView');
        return <MoneyFormatterView
            value={
                Money.getAsString(
                    this.props.value,
                    this.props.currency,
                    this.props.scale
                )
            }
        />;
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
