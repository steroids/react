import * as React from 'react';
import * as moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';
import {components, field} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';

export interface IDateFieldProps extends IFieldHocInput {
    label?: string | boolean | any;
    hint?: string;
    attribute?: string;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    required?: boolean;
    size?: Size;
    disabled?: boolean;
    pickerProps?: any;
    onChange?: (...args: any[]) => any;
    displayFormat?: string;
    valueFormat?: string;
    className?: string;
    view?: any;
    isInvalid?: boolean;
    placeholder?: any;
}

export interface IDateFieldViewProps extends IFieldHocOutput {
    pickerProps: {
        name: string,
        placeholder?: string,
        value?: string,
        parseDate: (date: string) => Date | undefined,
        formatDate: (date: string) => Date | undefined,
        onDayChange: (day: string) => void,
        dayPickerProps: {
            locale: string,
            localeUtils: any,
        },
        inputProps: {
            disabled: boolean,
        },
    }
}

interface IDateFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {

}

@field({
    componentId: 'form.DateField'
})
@components('ui', 'locale')
export default class DateField extends React.PureComponent<IDateFieldProps & IDateFieldPrivateProps> {

    static WrappedComponent: any;

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
    }

    render() {
        // TODO Add months switcher http://react-day-picker.js.org/examples/elements-year-navigation
        const DateFieldView =
            this.props.view || this.props.ui.getView('form.DateFieldView');
        return (
            <DateFieldView
                {...this.props}
                pickerProps={{
                    name: this.props.input.name,
                    placeholder: this.props.placeholder || this.props.displayFormat,
                    value: this._parseDate(this.props.input.value),
                    parseDate: this._parseDate,
                    formatDate: this._formatDate,
                    onDayChange: day => {
                        if (day) {
                            this.props.input.onChange(
                                moment(day).format(this.props.valueFormat)
                            );
                        }
                    },
                    dayPickerProps: {
                        locale: this.props.locale.language,
                        localeUtils: MomentLocaleUtils,
                        ...(this.props.pickerProps && this.props.pickerProps.dayPickerProps)
                    },
                    inputProps: {
                        disabled: this.props.disabled,
                        ...(this.props.pickerProps && this.props.pickerProps.inputProps)
                    },
                    ...this.props.pickerProps
                }}
            />
        );
    }

    /**
     * Convert date from string to Date object
     * @param {string} date
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
     * @param {string} date
     * @returns {string}
     * @private
     */
    _formatDate(date) {
        return moment(date).format(this.props.displayFormat);
    }
}
