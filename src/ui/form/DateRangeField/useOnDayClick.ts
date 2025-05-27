import {useCallback} from 'react';

interface IUseOnDayClickProps {
    useFocusOnRangeEdgeClick?: boolean,
    focus: 'from' | 'to',
    fromValue: string,
    toValue: string,
    onFromChange: (value: string) => void,
    onToChange: (value: string) => void,
}

export default function useOnDayClick(props: IUseOnDayClickProps) {
    const {useFocusOnRangeEdgeClick, focus, fromValue, toValue, onFromChange, onToChange} = props;

    const onDayClick = useCallback((value) => {
        // Если кликнули по дате начала или конца диапазона, то позволяем её изменить следующим кликом
        // Если клик не на дату конца или начала диапазона, а диапазон есть, то сбрасываем его
        if (useFocusOnRangeEdgeClick) {
            if (value === fromValue?.split(',')[0]) {
                onFromChange(toValue);
                onToChange(null);
                return;
            }
            if (value === toValue?.split(',')[0]) {
                onFromChange(fromValue);
                onToChange(null);
                return;
            }

            if (fromValue && toValue) {
                onToChange(null);
                onFromChange(value);
                return;
            }
        }

        if (focus === 'from') {
            onFromChange(value);
        } else {
            onToChange(value);
        }
    }, [focus, fromValue, onFromChange, onToChange, toValue, useFocusOnRangeEdgeClick]);
    return onDayClick;
}
