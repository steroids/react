import _round from 'lodash-es/round';
import {useComponents} from '../../../hooks';

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
    [key: string]: any;
}

export const moneyFormat = (amount, currency, scale) => {
    const symbols = {
        eur: __('€'),
        rub: __('₽'),
        usd: __('$'),
    };
    return __('{amount, number} {symbol}', {
        amount: _round(amount, scale),
        symbol: symbols[currency] || currency.toUpperCase(),
    });
};

function MoneyFormatter(props: IMoneyFormatterProps) {
    const value = props.precision > 0
        ? props.value / 10 ** props.precision
        : props.value;

    return useComponents().ui.renderView(props.view || 'format.DefaultFormatterView', {
        value: moneyFormat(
            value,
            props.currency,
            props.scale,
        ),
    });
}

MoneyFormatter.defaultProps = {
    scale: 2,
    precision: 0,
};

export default MoneyFormatter;
