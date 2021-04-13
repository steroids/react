import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import moment from 'moment';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';
import {useComponents} from '../../../hooks';
import DateField from '../../form/DateField';
import TimeField from '../../form/TimeField';

export interface IDateTimeFieldProps extends IFieldWrapperInputProps {

    /**
     * Формат даты показываемый пользователю
     * @example DD.MM.YYYY
     */
    displayDateFormat?: string;

    /**
     * Формат даты отправляемый на сервер
     * @example YYYY-MM-DD
     */
    valueDateFormat?: string;

    /**
     * Формат времени
     * @example HH:mm
     */
    timeFormat?: string;
    dateProps?: any;
    timeProps?: any;
    style?: any;
    className?: CssClassName;
    view?: CustomView;
    [key: string]: any;
}

export interface IDateTimeFieldViewProps extends IDateTimeFieldProps, IFieldWrapperOutputProps {
    dateField: any,
    timeField: any,
    style?: any
}

function DateTimeField(props: IDateTimeFieldProps) {
    const components = useComponents();

    const parseDate = useCallback(date => {
        const formats = [
            props.displayDateFormat + ' ' + props.timeFormat,
            props.displayDateFormat + ' ' + props.timeFormat + ':ss',
            props.valueDateFormat + ' ' + props.timeFormat,
            props.valueDateFormat + ' ' + props.timeFormat + ':ss',
        ];
        const format = formats.find(format => (
            date && date.length === format.length && moment(date, format).isValid()
        ));
        return format ? moment(date, format) : null;
    }, [props.displayDateFormat, props.timeFormat, props.valueDateFormat]);

    const parseToState = useCallback(props => {
        const momentDate = parseDate(props.input.value);
        return {
            date: momentDate ? momentDate.format(props.valueDateFormat) : null,
            time: (momentDate || moment().startOf('day')).format(props.timeFormat),
        };
    }, [parseDate]);

    const [state, setState] = useState(parseToState(props));
    const stateCbRef = useRef(null);

    const onChange = useCallback(data => {
        stateCbRef.current = state => {
            const momentDate = parseDate(state.date + ' ' + state.time);
            const format = props.valueDateFormat + ' ' + props.timeFormat;
            if (momentDate) {
                props.input.onChange(momentDate.format(format));
            }
        };

        setState(state => ({
            ...state,
            ...data,
        }));
    }, [parseDate, props.valueDateFormat, props.timeFormat, props.input]);

    useEffect(() => {
        setState(parseToState(props));
    }, [parseToState, props.input.value, props.valueDateFormat, props.timeFormat, props]);

    const DateFieldInternal = DateField.WrappedComponent;
    const TimeFieldInternal = TimeField.WrappedComponent;

    useEffect(() => {
        if (stateCbRef.current) {
            stateCbRef.current(state);
            stateCbRef.current = null;
        }
    }, [state]);

    return components.ui.renderView(props.view || 'form.DateTimeFieldView', {
        ...props,
        dateField: (
            <DateFieldInternal
                isInvalid={props.isInvalid}
                required={props.required}
                disabled={props.disabled}
                displayFormat={props.displayDateFormat}
                valueFormat={props.valueDateFormat}
                input={{
                    name: '',
                    value: state.date,
                    onChange: value => onChange({date: value}),
                }}
                layout={false}
                {...props.dateProps}
            />
        ),
        timeField: (
            <TimeFieldInternal
                isInvalid={props.isInvalid}
                required={props.required}
                disabled={props.disabled}
                timeFormat={props.timeFormat}
                input={{
                    name: '',
                    value: state.time,
                    onChange: value => onChange({time: value}),
                }}
                layout={false}
                {...props.timeProps}
            />
        ),
    });
}

DateTimeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayDateFormat: 'DD.MM.YYYY',
    valueDateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
};

export default fieldWrapper('DateTimeField', DateTimeField);
