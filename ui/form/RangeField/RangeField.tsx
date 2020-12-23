import * as React from 'react';
import {findDOMNode} from 'react-dom';
import moment from 'moment';
import _get from 'lodash-es/get';
import {components, field} from '../../../hoc';
import InputField from '../InputField';
import DateField from '../DateField';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IRangeFieldProps extends IFieldHocInput {
    attributeFrom?: string;
    attributeTo?: string;
    inputFrom?: FormInputType;
    inputTo?: FormInputType;
    type?: 'input' | 'date' | string;
    fieldComponent?: any;
    placeholderFrom?: string;
    placeholderTo?: string;
    fromProps?: any;
    toProps?: any;
    className?: CssClassName;
    view?: CustomView;
}

export interface IRangeFieldViewProps extends IFieldHocOutput {
    fromField: any,
    toField: any,
}

interface IRangeFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {

}

const fieldsMap = {
    input: InputField,
    date: DateField
};

@field({
    componentId: 'form.RangeField',
    attributes: ['from', 'to']
})
@components('ui')
export default class RangeField extends React.PureComponent<IRangeFieldProps & IRangeFieldPrivateProps> {
    _timer: any;
    refTo: any;
    static defaultProps = {
        type: 'input',
        disabled: false,
        required: false,
        className: '',
        placeholderFrom: '',
        placeholderTo: '',
        errors: []
    };

    constructor(props) {
        super(props);
        this.refTo = React.createRef();
        this._timer = null;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // Auto focus on set 'from' value
        if (
            !this.props.inputFrom.value &&
            nextProps.inputFrom.value &&
            !nextProps.inputTo.value
        ) {
            this._timer = setTimeout(() => {
                const inputEl = this.refTo.current.querySelector('input');
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
        const RangeFieldView =
            this.props.view || this.props.ui.getView('form.RangeFieldView');
        const FieldComponent =
            this.props.fieldComponent || fieldsMap[this.props.type];
        const FieldComponentInternal = FieldComponent.WrappedComponent;
        let fieldProps = {
            disabled: this.props.disabled,
            size: this.props.size
        };
        let fieldFromProps = {};
        let fieldToProps = {};
        switch (this.props.type) {
            case 'date':
                const valueFromFormat = _get(
                    this.props.fromProps,
                    'valueFormat',
                    'YYYY-MM-DD'
                );
                const valueToFormat = _get(
                    this.props.toProps,
                    'valueFormat',
                    'YYYY-MM-DD'
                );
                const from = this.props.inputFrom.value
                    ? moment(this.props.inputFrom.value, valueFromFormat).toDate()
                    : undefined;
                const to = this.props.inputTo.value
                    ? moment(this.props.inputTo.value, valueToFormat).toDate()
                    : undefined;
                const modifiers = {
                    start: from,
                    end: to
                };
                fieldFromProps = {
                    ...fieldFromProps,
                    pickerProps: {
                        dayPickerProps: {
                            selectedDays: [from, {from, to}],
                            disabledDays: {after: to},
                            toMonth: to,
                            modifiers,
                            numberOfMonths: 2
                        }
                    }
                };
                fieldToProps = {
                    ...fieldToProps,
                    pickerProps: {
                        dayPickerProps: {
                            selectedDays: [from, {from, to}],
                            disabledDays: {before: from},
                            modifiers,
                            month: from,
                            fromMonth: from,
                            numberOfMonths: 2
                        }
                    }
                };
                break;
        }
        return (
            <RangeFieldView
                {...this.props}
                fromField={
                    <FieldComponentInternal
                        input={this.props.inputFrom}
                        placeholder={this.props.placeholderFrom}
                        {...fieldProps}
                        {...fieldFromProps}
                        {...this.props.fromProps}
                        isInvalid={this.props.isInvalid}
                    />
                }
                toField={
                    <FieldComponentInternal
                        ref={this.refTo}
                        input={this.props.inputTo}
                        placeholder={this.props.placeholderTo}
                        {...fieldProps}
                        {...fieldToProps}
                        {...this.props.toProps}
                        isInvalid={this.props.isInvalid}
                    />
                }
            />
        );
    }
}
