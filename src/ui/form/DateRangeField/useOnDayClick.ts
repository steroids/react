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

    const onDayClick = useCallback((value) => {
        if (useSmartRangeReset) {
            // Если кликнули по дате начала или конца диапазона, то позволяем её изменить следующим кликом
            // Если клик не на дату конца или начала диапазона, а диапазон есть, то сбрасываем его
            if (value === fromValue) {
                onFromChange(toValue);
                onToChange(null);
                return;
            }
            if (value === toValue) {
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
