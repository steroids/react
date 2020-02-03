import * as React from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import _get from 'lodash-es/get';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';
import dataProviderHoc from '../dataProviderHoc';
import {props} from '../../../hoc';

interface IAutoCompleteFieldProps {
    label?: string | boolean;
    hint?: string;
    attribute?: string;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    required?: boolean;
    placeholder?: string;
    isInvalid?: boolean;
    searchPlaceholder?: string;
    disabled?: boolean;
    inputProps?: any;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    showReset?: boolean;
    multiple?: boolean;
    items?: {
        id?: number | string | boolean,
        label?: string
    }[];
    selectedItems?: {
        id?: number | string | boolean,
        label?: string
    }[];
    hoveredItem?: {
        id?: number | string | boolean,
        label?: string
    };
    autoComplete?: boolean;
    autoCompleteMinLength?: number;
    autoCompleteDelay?: number;
    isOpened?: boolean;
    onOpen?: (...args: any[]) => any;
    onClose?: (...args: any[]) => any;
    onSearch?: (...args: any[]) => any;
    onItemClick?: (...args: any[]) => any;
    onItemMouseOver?: (...args: any[]) => any;
    onBlur?: any;
    onFocus?: any;
    length?: any;
    map?: any;
    getView?: any;
    ui?: any;
}

@fieldHoc({
    componentId: 'form.AutoCompleteField'
})
@props({
    autoComplete: true
})
@dataProviderHoc()
@enhanceWithClickOutside
@components('ui')
export default class AutoCompleteField extends React.PureComponent<IAutoCompleteFieldProps,
    {}> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: "",
        autoComplete: false,
        showReset: false,
        multiple: false
    };

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
    }

    handleClickOutside() {
        this.props.onClose();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (_get(this.props, 'input.value') !== _get(nextProps, 'input.value')) {
            this.props.onSearch(nextProps.input.value);
        }
    }

    render() {
        const AutoCompleteFieldView =
            this.props.view || this.props.ui.getView('form.AutoCompleteFieldView');
        return (
            <AutoCompleteFieldView
                {...this.props}
                inputProps={{
                    type: 'text',
                    ...this.props.inputProps,
                    name: this.props.input.name,
                    onChange: this._onChange,
                    onFocus: this._onFocus,
                    onBlur: this._onBlur,
                    value: this.props.input.value || ""
                }}
                items={this.props.items.map(item => ({
                    ...item,
                    isSelected: !!this.props.selectedItems.find(
                        selectedItem => selectedItem.id === item.id
                    ),
                    isHovered:
                        this.props.hoveredItem && this.props.hoveredItem.id === item.id
                }))}
                selectedItems={this.props.selectedItems}
                isOpened={this.props.isOpened && this.props.items.length > 0}
                onItemClick={this.props.onItemClick}
                onItemMouseOver={this.props.onItemMouseOver}
            />
        );
    }

    _onChange(e) {
        if (!this.props.isOpened) {
            this.props.onOpen();
        }
        this.props.input.onChange(e.target.value);
    }

    _onFocus(e) {
        this.props.onOpen();
        if (this.props.inputProps && this.props.inputProps.onFocus) {
            this.props.inputProps.onFocus(e);
        }
    }

    _onBlur(e) {
        setTimeout(() => {
            if (this.props.isOpened) {
                this.props.onClose();
            }
        }, 200);
        if (this.props.inputProps && this.props.inputProps.onBlur) {
            this.props.inputProps.onBlur(e);
        }
    }
}
