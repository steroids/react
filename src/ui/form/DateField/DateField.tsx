import {useCallback, useMemo, useState} from 'react';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';
import * as React from 'react';
import {useComponents} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';

export interface IDateFieldProps extends IFieldWrapperInputProps {
    pickerProps?: any;

    /**
     * Формат даты показываемый пользователю
     * @example DD.MM.YYYY
     */
    displayFormat?: string;

    /**
     * Формат даты отправляемый на сервер
     * @example YYYY-MM-DD
     */
    valueFormat?: string;
    className?: CssClassName;
    view?: CustomView;

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: any;
    style?: any;

    /**
     * Иконка
     * @example calendar-day
     */
    icon?: boolean | string;

    [key: string]: any;
}

export interface IDateFieldViewProps extends IDateFieldProps {
    name: string,
    parseDate: (date: string | Date) => Date | undefined,
    formatDate: (date: string | Date) => string,
    onChange: (day: string | Date) => void,
    localeUtils: any,
}

function DateField(props: IDateFieldProps & IFieldWrapperOutputProps) {
    const components = useComponents();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const {fromMonth, toMonth} = useMemo(() => ({
        fromMonth: new Date(currentYear - 100, 0),
        toMonth: new Date(currentYear + 50, 11),
    }), [currentYear]);

    const [month, setMonth] = useState(new Date(currentYear, currentMonth));

    const handleYearMonthChange = useCallback(month => {
        setMonth(month);
    }, []);

    /**
     * Convert date from string to Date object
     * @param {string | Date} date
     * @returns {Date|undefined}
     */
    const parseDate = useCallback(date => {
        const format = [props.displayFormat, props.valueFormat].find(
            format => (
                date
                    && date.length === format.length
                    && moment(date, format).isValid()
            ),
        );
        return format ? moment(date, format).toDate() : undefined;
    }, [props.displayFormat, props.valueFormat]);

    /**
     * Convert Date to display format
     * @param {string | Date} date
     * @returns {string}
     */
    const formatDate = useCallback(date => {
        if (!date) {
            return date;
        }

        return moment(date).format(props.displayFormat);
    }, [props.displayFormat]);

    const onChange = useCallback(value => {
        if (value) {
            const date = moment(value).format(props.valueFormat);
            props.input.onChange(date);
            if (props.onChange) {
                props.onChange(date);
            }
        }
    }, [props]);

    const value = useMemo(() => parseDate(props.input.value), [parseDate, props.input.value]);

    return components.ui.renderView(props.view || 'form.DateFieldView', {
        ...props,
        name: props.input.name,
        placeholder: props.placeholder || props.displayFormat,
        value,
        parseDate,
        formatDate,
        disabled: props.disabled,
        onChange,
        locale: components.locale,
        localeUtils: MomentLocaleUtils,
        pickerProps: {
            dayPickerProps: {
                month,
                fromMonth,
                toMonth,
            },
            onYearMonthChange: handleYearMonthChange,
            ...props.pickerProps,
        },
    });
}

DateField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY',
    valueFormat: 'YYYY-MM-DD',
};

export default fieldWrapper('DateField', DateField);
