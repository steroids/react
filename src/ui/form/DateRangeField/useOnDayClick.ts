import {useCallback} from 'react';

interface IUseOnDayClickProps {
    useFocusOnRangeEdgeClick?: boolean,
    focus: 'from' | 'to',
    fromValue: string,
    toValue: string,
    onFromChange: (value: string) => void,
    onToChange: (value: string) => void,
    fromRef: React.RefObject<HTMLInputElement>,
    toRef: React.RefObject<HTMLInputElement>,
}

export default function useOnDayClick(props: IUseOnDayClickProps) {
    const {useFocusOnRangeEdgeClick, focus, fromValue, toValue, onFromChange, onToChange, fromRef, toRef} = props;

    const onDayClick = useCallback((value) => {
        // Если кликнули по дате начала диапазона, то устанавливаем focus на "from", кликнули на последнею дату - на "to"
        // Если кликнули по дате начала или конца диапазона, а фокус уже стоит, то меняем значение диапазона на одну дату (например 12.04-12.04)
        if (useFocusOnRangeEdgeClick) {
            if (value === fromValue) {
                if (focus === 'to') {
                    fromRef.current.focus();
                    return;
                }
                onToChange(value);
                return;
            }
            if (value === toValue) {
                if (focus === 'from') {
                    toRef.current.focus();
                    return;
                }
                onFromChange(value);
                return;
            }
        }

        if (focus === 'from') {
            onFromChange(value);
        } else {
            onToChange(value);
        }
    }, [focus, fromRef, fromValue, onFromChange, onToChange, toRef, toValue, useFocusOnRangeEdgeClick]);
    return onDayClick;
}
