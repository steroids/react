import {useComponents} from '@steroidsjs/core/hooks';
import {useCallback} from 'react';

interface IUseOnDayClickProps {
    useSmartRangeReset?: boolean,
    focus: 'from' | 'to',
    fromValue: string,
    toValue: string,
    onFromChange: (value: string) => void,
    onToChange: (value: string) => void,
}

export default function useOnDayClick(props: IUseOnDayClickProps) {
    const {useSmartRangeReset, focus, fromValue, toValue, onFromChange, onToChange} = props;
    const {locale} = useComponents();

    const onDayClick = useCallback((value) => {
        if (useSmartRangeReset) {
            const valueDate = locale.dayjs(value);
            const fromDate = locale.dayjs(fromValue);
            const toDate = locale.dayjs(toValue);

            // Если кликнули по дате начала или конца диапазона, то позволяем её изменить следующим кликом
            // Если клик не на дату конца или начала диапазона, а диапазон есть, то сбрасываем его
            if (valueDate.isSame(fromDate)) {
                onFromChange(toValue);
                onToChange(null);
                return;
            }
            if (valueDate.isSame(toDate)) {
                onFromChange(fromValue);
                onToChange(null);
                return;
            }

            if (fromValue && toValue) {
                onToChange(null);
                onFromChange(value);
                return;
            }

            if (fromValue) {
                onToChange(value);
                return;
            }
            onFromChange(value);
            return;
        }

        if (focus === 'from') {
            onFromChange(value);
        } else {
            onToChange(value);
        }
    }, [focus, fromValue, onFromChange, onToChange, toValue, useSmartRangeReset]);
    return onDayClick;
}
