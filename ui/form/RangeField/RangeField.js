import React from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import _get from 'lodash-es/get';

import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';
import InputField from '../InputField';
import DateField from '../DateField';

@fieldHoc({
    componentId: 'form.RangeField',
    attributes: ['from', 'to'],
})
@components('ui')
export default class RangeField extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        attributeFrom: PropTypes.string,
        attributeTo: PropTypes.string,
        inputFrom: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        inputTo: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        required: PropTypes.bool,
        type: PropTypes.oneOf(['input', 'date']),
        fieldComponent: PropTypes.func,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        placeholderFrom: PropTypes.string,
        placeholderTo: PropTypes.string,
        disabled: PropTypes.bool,
        fromProps: PropTypes.object,
        toProps: PropTypes.object,
        onChange: PropTypes.func,
        className: PropTypes.string,
        view: PropTypes.elementType,
        isInvalid: PropTypes.bool,
    };

    static defaultProps = {
        type: 'input',
        disabled: false,
        required: false,
        className: '',
        placeholderFrom: '',
        placeholderTo: '',
        errors: [], //for storybook
    };

    static fieldsMap = {
        input: InputField,
        date: DateField,
    };

    constructor() {
        super(...arguments);

        this.refTo = null;
        this._timer = null;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // Auto focus on set 'from' value
        if (!this.props.inputFrom.value && nextProps.inputFrom.value && !nextProps.inputTo.value) {
            this._timer = setTimeout(() => {
                const inputEl = findDOMNode(this.refTo).querySelector('input');
                if (inputEl) {
                    inputEl.focus();
                }
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this._timer);
    }

    render() {
        const RangeFieldView = this.props.view || this.props.ui.getView('form.RangeFieldView');
        const FieldComponent = this.props.fieldComponent || RangeField.fieldsMap[this.props.type];
        const FieldComponentInternal = FieldComponent.WrappedComponent;

        let fieldProps = {
            disabled: this.props.disabled,
            size: this.props.size,
        };
        let fieldFromProps = {};
        let fieldToProps = {};

        switch (this.props.type) {
            case 'date':
                const valueFromFormat = _get(this.props.fromProps, 'valueFormat', FieldComponentInternal.defaultProps.valueFormat);
                const valueToFormat = _get(this.props.toProps, 'valueFormat', FieldComponentInternal.defaultProps.valueFormat);
                const from = this.props.inputFrom.value ? moment(this.props.inputFrom.value, valueFromFormat).toDate() : undefined;
                const to = this.props.inputTo.value ? moment(this.props.inputTo.value, valueToFormat).toDate() : undefined;
                const modifiers = {
                    start: from,
                    end: to,
                };
                fieldFromProps = {
                    ...fieldFromProps,
                    pickerProps: {
                        dayPickerProps: {
                            selectedDays: [from, { from, to }],
                            disabledDays: {after: to},
                            toMonth: to,
                            modifiers,
                            numberOfMonths: 2,
                        },
                    },
                };
                fieldToProps = {
                    ...fieldToProps,
                    pickerProps: {
                        dayPickerProps: {
                            selectedDays: [from, { from, to }],
                            disabledDays: {before: from},
                            modifiers,
                            month: from,
                            fromMonth: from,
                            numberOfMonths: 2,
                        },
                    },
                };
                break;
        }

        return (
            <RangeFieldView
                {...this.props}
                fromField={(
                    <FieldComponentInternal
                        input={this.props.inputFrom}
                        placeholder={this.props.placeholderFrom}
                        {...fieldProps}
                        {...fieldFromProps}
                        {...this.props.fromProps}
                        isInvalid={this.props.isInvalid}
                    />
                )}
                toField={(
                    <FieldComponentInternal
                        ref={el => (this.refTo = el)}
                        input={this.props.inputTo}
                        placeholder={this.props.placeholderTo}
                        {...fieldProps}
                        {...fieldToProps}
                        {...this.props.toProps}
                        isInvalid={this.props.isInvalid}
                    />
                )}
            />
        );
    }

}
