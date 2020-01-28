import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';

import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

@fieldHoc({
    componentId: 'form.DateField',
})
@components('ui', 'locale')
export default class DateField extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        attribute: PropTypes.string,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        required: PropTypes.bool,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        disabled: PropTypes.bool,
        pickerProps: PropTypes.object,
        onChange: PropTypes.func,
        displayFormat: PropTypes.string,
        valueFormat: PropTypes.string,
        className: PropTypes.string,
        view: PropTypes.elementType,
        isInvalid: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        displayFormat: 'DD.MM.YYYY',
        valueFormat: 'YYYY-MM-DD',
    };

    constructor() {
        super(...arguments);

        this._parseDate = this._parseDate.bind(this);
        this._formatDate = this._formatDate.bind(this);
    }

    render() {
        // TODO Add months switcher http://react-day-picker.js.org/examples/elements-year-navigation

        const DateFieldView = this.props.view || this.props.ui.getView('form.DateFieldView');
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
                            this.props.input.onChange(moment(day).format(this.props.valueFormat));
                        }
                    },
                    dayPickerProps: {
                        locale: this.props.locale.language,
                        localeUtils: MomentLocaleUtils,
                        ...(this.props.pickerProps && this.props.pickerProps.dayPickerProps),
                    },
                    inputProps: {
                        disabled: this.props.disabled,
                        ...(this.props.pickerProps && this.props.pickerProps.inputProps),
                    },
                    ...this.props.pickerProps,
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
        const format = [this.props.displayFormat, this.props.valueFormat].find(format => {
            return date && date.length === format.length && moment(date, format).isValid();
        });
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
