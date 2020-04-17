import * as React from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import _get from 'lodash-es/get';
import {components, field} from '../../../hoc';
import {props} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from "../../../hoc/field";
import dataProvider, {IDataProviderHocInput, IDataProviderHocOutput} from "../../../hoc/dataProvider";
import {IComponentsHocOutput} from '../../../hoc/components';
import {IInputFieldProps} from '../InputField/InputField';
import {conditional} from "conditional-decorator";

/**
 * AutoComplete
 * Поле ввода текста с подсказками (auto-complete)
 */
interface IAutoCompleteFieldProps extends IInputFieldProps, IFieldHocInput, IDataProviderHocInput {
    searchOnFocus?: boolean,
}

export interface IAutoCompleteFieldViewProps extends IFieldHocOutput, IDataProviderHocOutput {
    placeholder?: string;
    inputProps: {
        type: string,
        name: string,
        onChange: (value: string) => void,
        onFocus: (e: Event) => void,
        onBlur: (e: Event) => void,
        value: string | number,
    },
    items: {
        id: number | string | boolean,
        label?: string,
        isSelected: boolean,
        isHovered: boolean,
    }[];
    selectedItems?: {
        id: number | string | boolean,
        label?: string
    }[];
    isOpened: boolean,
    onItemClick: (item: {id: number | string | boolean}) => void,
    onItemMouseOver: (item: {id: number | string | boolean}) => void,
}

interface IAutoCompleteFieldPrivateProps extends IFieldHocOutput, IDataProviderHocOutput, IComponentsHocOutput {
    isOpened?: boolean;
    onOpen?: (...args: any[]) => any;
    onClose?: (...args: any[]) => any;
    onSearch?: (...args: any[]) => any;
    onItemClick?: (...args: any[]) => any;
    onItemMouseOver?: (...args: any[]) => any;
    onBlur?: any;
    onFocus?: any;
    selectedItems?: {
        id?: number | string | boolean,
        label?: string
    }[];
    hoveredItem?: {
        id?: number | string | boolean,
        label?: string
    };
}

@field({
    componentId: 'form.AutoCompleteField'
})
@props({
    autoComplete: true,
    multiple: false,
})
@dataProvider()
@conditional(process.env.PLATFORM === 'web', enhanceWithClickOutside)
@components('ui')
export default class AutoCompleteField extends React.PureComponent<IAutoCompleteFieldProps & IAutoCompleteFieldPrivateProps> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        autoComplete: false,
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
                    value: this.props.input.value || ''
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
                isOpened={this.props.isOpened}
                onItemClick={this.props.onItemClick}
                onItemMouseOver={this.props.onItemMouseOver}
            />
        );
    }

    _onChange(value) {
        if (!this.props.isOpened) {
            this.props.onOpen();
        }
        this.props.input.onChange(value);
    }

    _onFocus(e) {
        this.props.onOpen();
        if (this.props.searchOnFocus) {
            this.props.onSearch(this.props.input.value);
        }
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
