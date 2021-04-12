import * as React from 'react';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';
import {components, field} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';

export interface IDateFieldProps extends IFieldHocInput {
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

export interface IDateFieldState {
    month: Date,
}

export interface IDateFieldViewProps extends IFieldHocOutput, IDateFieldProps {
    name: string,
    parseDate: (date: string | Date) => Date | undefined,
    formatDate: (date: string | Date) => string,
    onChange: (day: string | Date) => void,
    localeUtils: any,
}

interface IDateFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {}

@field({
    componentId: 'form.DateField'
})
@components('ui', 'locale')
export default class DateField extends React.PureComponent<IDateFieldProps & IDateFieldPrivateProps, IDateFieldState> {

    static WrappedComponent: any;

    fromMonth: Date;
    toMonth: Date;

    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        displayFormat: 'DD.MM.YYYY',
        valueFormat: 'YYYY-MM-DD'
    };

    constructor(props) {
        super(props);
        this._parseDate = this._parseDate.bind(this);
        this._formatDate = this._formatDate.bind(this);
        this._handleYearMonthChange = this._handleYearMonthChange.bind(this);

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        this.fromMonth = new Date(currentYear - 100, 0);
        this.toMonth = new Date(currentYear + 50, 11);

        this.state = {
            month: new Date(currentYear, currentMonth),
        }
    }

    render() {
        const DateFieldView =
            this.props.view || this.props.ui.getView('form.DateFieldView');

        return (
            <DateFieldView
                {...this.props}
                name={this.props.input.name}
                placeholder={this.props.placeholder || this.props.displayFormat}
                value={this._parseDate(this.props.input.value)}
                parseDate={this._parseDate}
                formatDate={this._formatDate}
                disabled={this.props.disabled}
                onChange={value => {
                    if (value) {
                        const date = moment(value).format(this.props.valueFormat);
                        this.props.input.onChange(date);
                        if (this.props.onChange) {
                            this.props.onChange(date);
                        }
                    }
                }}
                locale={this.props.locale}
                localeUtils={MomentLocaleUtils}
                pickerProps={{
                    onYearMonthChange: this._handleYearMonthChange,
                    ...this.props.pickerProps,
                    dayPickerProps: {
                        month: this.state.month,
                        fromMonth: this.fromMonth,
                        toMonth: this.toMonth,
                        ...this.props.pickerProps.dayPickerProps
                    },
                }}
            />
        );
    }

    _handleYearMonthChange(month) {
        this.setState({ month });
    }

    /**
     * Convert date from string to Date object
     * @param {string | Date} date
     * @returns {Date|undefined}
     * @private
     */
    _parseDate(date) {
        const format = [this.props.displayFormat, this.props.valueFormat].find(
            format => {
                return (
                    date &&
                    date.length === format.length &&
                    moment(date, format).isValid()
                );
            }
        );
        return format ? moment(date, format).toDate() : undefined;
    }

    /**
     * Convert Date to display format
     * @param {string | Date} date
     * @returns {string}
     * @private
     */
    _formatDate(date) {
        if (!date) {
            return date;
        }

        return moment(date).format(this.props.displayFormat);
    }
}
