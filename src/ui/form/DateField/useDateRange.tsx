import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {usePrevious} from 'react-use';

interface IUseDateRangeProps {
    onCloseFrom: any,
    onCloseTo: any,
    onClearFrom: any,
    onClearTo: any,
    inputPropsFrom: any,
    inputPropsTo: any,
    inputTo: any,
    inputFrom: any,
    useSmartFocus: boolean,
}

export default function useDateRange(props:IUseDateRangeProps) {
    // Tracking focus for input being edited
    const [focus, setFocus] = useState<'from' | 'to'>('from');

    // Local refs to handle auto-focus
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
        if (props.useSmartFocus) {
            if (focus === 'from' && !valueToRef.current && prevValueFrom !== props.inputFrom.value) {
                valueFromRef.current = props.inputFrom.value;
                inputToRef.current.focus();
            }
            if (focus === 'to' && !valueFromRef.current && prevValueTo !== props.inputTo.value) {
                valueToRef.current = props.inputTo.value;
                inputFromRef.current.focus();
            }
        }
    }, [focus, onClose, prevValueFrom, prevValueTo, props, props.inputFrom.onChange, props.inputFrom.value, props.inputTo.onChange, props.inputTo.value]);

    return {
        focus,
        onClose,
        onClear,
        extendedInputPropsFrom,
        extendedInputPropsTo,
    };
}
