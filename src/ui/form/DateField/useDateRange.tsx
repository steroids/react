import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useFirstMountState, usePrevious} from 'react-use';
import _isNil from 'lodash-es/isNil';
import dayjs from 'dayjs';
import {convertDate} from '@steroidsjs/core/utils/calendar';
import {IDateInputStateInput} from '@steroidsjs/core/ui/form/DateField/useDateInputState';

const isOneRangeValueEmpty = (valueFrom, valueTo) => !valueFrom || !valueTo;

interface IUseDateRangeProps extends Pick<IDateInputStateInput, 'displayFormat' | 'valueFormat' | 'useUTC' | 'dateInUTC'>{
    onCloseFrom: any,
    onCloseTo: any,
    onClearFrom: any,
    onClearTo: any,
    inputPropsFrom: any,
    inputPropsTo: any,
    inputTo: any,
    inputFrom: any,
    useSmartFocus: boolean,
    hasInitialFocus: boolean,
}

export default function useDateRange(props:IUseDateRangeProps) {
    // Tracking focus for input being edited
    const [focus, setFocus] = useState<'from' | 'to'>('from');

    const isFirstMount = useFirstMountState();

    // Refs to handle auto-focus
    const valueFromRef = useRef('');
    const valueToRef = useRef('');

    // Close handler
    const onClose = useCallback(() => {
        if (focus === 'from') {
            props.onCloseFrom();
        } else {
            props.onCloseTo();
        }
        valueFromRef.current = '';
        valueToRef.current = '';
    }, [focus, props]);

    // Clear handler
    const onClear = useCallback(() => {
        props.onClearFrom();
        props.onClearTo();
        valueFromRef.current = '';
        valueToRef.current = '';
    }, [props]);

    // Custom onFocus for inputFrom
    const inputFromRef = useRef(null);
    const onFocusFrom = useCallback(e => {
        props.inputPropsFrom.onFocus.call(null, e);
        setFocus('from');
    }, [props.inputPropsFrom.onFocus]);
    const extendedInputPropsFrom = useMemo(() => ({
        ...props.inputPropsFrom,
        onFocus: onFocusFrom,
        ref: inputFromRef,
    }), [onFocusFrom, props.inputPropsFrom]);

    // Custom onFocus for inputTo
    const inputToRef = useRef(null);
    const onFocusTo = useCallback(e => {
        props.inputPropsTo.onFocus.call(null, e);
        setFocus('to');
    }, [props.inputPropsTo.onFocus]);
    const extendedInputPropsTo = useMemo(() => ({
        ...props.inputPropsTo,
        onFocus: onFocusTo,
        ref: inputToRef,
    }), [onFocusTo, props.inputPropsTo]);

    const prevValueFrom = usePrevious(props.inputFrom.value);
    const prevValueTo = usePrevious(props.inputTo.value);
    useEffect(() => {
        if (!props.hasInitialFocus && isFirstMount) {
            return;
        }

        if (_isNil(props.inputFrom.value) && _isNil(props.inputTo.value)) {
            return;
        }
        if (props.useSmartFocus && isOneRangeValueEmpty(props.inputFrom.value, props.inputTo.value)) {
            if (focus === 'from' && !valueToRef.current && prevValueFrom !== props.inputFrom.value) {
                valueFromRef.current = props.inputFrom.value;
                inputToRef.current.focus();
            }
            if (focus === 'to' && !valueFromRef.current && prevValueTo !== props.inputTo.value) {
                valueToRef.current = props.inputTo.value;
                inputFromRef.current.focus();
            }
        } else if (props.hasInitialFocus && isFirstMount) {
            inputFromRef.current.focus();
        }

    // eslint-disable-next-line max-len
    }, [focus, isFirstMount, onClose, prevValueFrom, prevValueTo, props, props.inputFrom.onChange, props.inputFrom.value, props.inputTo.onChange, props.inputTo.value]);

    // Swap start and end dates if start date is later than end date
    useEffect(() => {
        if (
            props.inputFrom.value
            && props.inputTo.value
            && (dayjs(props.inputTo.value).isBefore(dayjs(props.inputFrom.value)))
        ) {
            const convertedDateFrom = convertDate(
                props.inputFrom.value,
                props.valueFormat,
                props.valueFormat,
                props.useUTC,
                props.dateInUTC,
            );

            const convertedDateTo = convertDate(
                props.inputTo.value,
                props.valueFormat,
                props.valueFormat,
                props.useUTC,
                props.dateInUTC,
            );

            props.inputFrom.onChange.call(null, convertedDateTo);
            props.inputTo.onChange.call(null, convertedDateFrom);
        }
    }, [props.dateInUTC,
        props.inputFrom.onChange,
        props.inputFrom.value,
        props.inputTo.onChange,
        props.inputTo.value,
        props.useUTC,
        props.valueFormat,
    ]);

    return {
        focus,
        onClose,
        onClear,
        extendedInputPropsFrom,
        extendedInputPropsTo,
    };
}
