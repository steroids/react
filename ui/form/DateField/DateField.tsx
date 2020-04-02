import * as React from 'react';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';
import {components, field} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';

export interface IDateFieldProps extends IFieldHocInput {
    pickerProps?: any;
    displayFormat?: string;
    valueFormat?: string;
    className?: CssClassName;
    view?: CustomView;
    placeholder?: any;
    style?: any;
}

export interface IDateFieldViewProps extends IFieldHocOutput {
    name: string,
    placeholder?: string,
    parseDate: (date: string | Date) => Date | undefined,
    formatDate: (date: string | Date) => string,
    onChange: (day: string | Date) => void,
    pickerProps: any
}

interface IDateFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {}

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
                pickerProps={this.props.pickerProps}
            />
        );
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
                    (date instanceof String ? date.length === format.length : true) &&
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
