import * as React from 'react';
import moment from 'moment';
import _isEqual from 'lodash-es/isEqual';
import {components, field} from '../../../hoc';
import DateField from '../DateField';
import TimeField from "../TimeField";
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IDateTimeFieldProps extends IFieldHocInput {

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

export interface IDateTimeFieldViewProps extends IFieldHocOutput {
    dateField: any,
    timeField: any,
    style?: any
}

interface IDateTimeFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {
}

type DateTimeFieldState = {
    time?: any,
    date?: any
};
@field({
    componentId: 'form.DateTimeField'
})
@components('ui')
export default class DateTimeField extends React.PureComponent<IDateTimeFieldProps & IDateTimeFieldPrivateProps, DateTimeFieldState> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        displayDateFormat: 'DD.MM.YYYY',
        valueDateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm'
    };

    constructor(props) {
        super(props);
        this.state = this._parseToState(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const newState = this._parseToState(nextProps);
        if (!_isEqual(this.state, newState)) {
            this.setState(newState);
        }
    }

    render() {
        const DateFieldInternal = DateField.WrappedComponent;
        const TimeFieldInternal = TimeField.WrappedComponent;
        const DateTimeFieldView = this.props.view || this.props.ui.getView('form.DateTimeFieldView');

        return (
            <DateTimeFieldView
                {...this.props}
                dateField={
                    <DateFieldInternal
                        isInvalid={this.props.isInvalid}
                        required={this.props.required}
                        disabled={this.props.disabled}
                        displayFormat={this.props.displayDateFormat}
                        valueFormat={this.props.valueDateFormat}
                        input={{
                            name: '',
                            value: this.state.date,
                            onChange: value => this._onChange({date: value})
                        }}
                        layout={false}
                        {...this.props.dateProps}
                    />
                }
                timeField={
                    <TimeFieldInternal
                        isInvalid={this.props.isInvalid}
                        required={this.props.required}
                        disabled={this.props.disabled}
                        timeFormat={this.props.timeFormat}
                        input={{
                            name: '',
                            value: this.state.time,
                            onChange: value => this._onChange({time: value})
                        }}
                        layout={false}
                        {...this.props.timeProps}
                    />
                }
            />
        );
    }

    _onChange(data) {
        this.setState(data, () => {
            const momentDate = this._parseDate(
                this.state.date + ' ' + this.state.time
            );
            const format = this.props.valueDateFormat + ' ' + this.props.timeFormat;
            if (momentDate) {
                this.props.input.onChange(momentDate.format(format));
            }
        });
    }

    _parseToState(props) {
        const momentDate = this._parseDate(props.input.value);
        return {
            date: momentDate ? momentDate.format(props.valueDateFormat) : null,
            time: (momentDate || moment().startOf('day')).format(props.timeFormat)
        };
    }

    _parseDate(date) {
        const formats = [
            this.props.displayDateFormat + ' ' + this.props.timeFormat,
            this.props.displayDateFormat + ' ' + this.props.timeFormat + ':ss',
            this.props.valueDateFormat + ' ' + this.props.timeFormat,
            this.props.valueDateFormat + ' ' + this.props.timeFormat + ':ss',
        ];
        const format = formats.find(format => {
            return (
                date && date.length === format.length && moment(date, format).isValid()
            );
        });
        return format ? moment(date, format) : null;
    }
}
