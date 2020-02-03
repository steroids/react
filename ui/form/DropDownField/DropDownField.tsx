import * as React from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';
import dataProviderHoc from '../dataProviderHoc';

interface IDropDownFieldProps {
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
    isLoading?: boolean;
    onOpen?: (...args: any[]) => any;
    onClose?: (...args: any[]) => any;
    onSearch?: (...args: any[]) => any;
    onItemClick?: (...args: any[]) => any;
    onItemMouseOver?: (...args: any[]) => any;
    map?: any;
    getView?: any;
    ui?: any;
}

@fieldHoc({
    componentId: 'form.DropDownField'
})
@dataProviderHoc()
@enhanceWithClickOutside
@components('ui')
export default class DropDownField extends React.PureComponent<IDropDownFieldProps,
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
        this._onSearch = this._onSearch.bind(this);
        this._onReset = this._onReset.bind(this);
    }

    handleClickOutside() {
        this.props.onClose();
    }

    render() {
        const DropDownFieldView =
            this.props.view || this.props.ui.getView('form.DropDownFieldView');
        return (
            <DropDownFieldView
                {...this.props}
                searchInputProps={{
                    type: 'search',
                    placeholder:
                        this.props.searchPlaceholder ||
                        __('Начните вводить символы для поиска...'),
                    onChange: this._onSearch,
                    tabIndex: -1
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
                isLoading={this.props.isLoading}
                showReset={this.props.showReset}
                onOpen={this.props.onOpen}
                onReset={this._onReset}
                onItemClick={this.props.onItemClick}
                onItemMouseOver={this.props.onItemMouseOver}
            />
        );
    }

    _onSearch(e) {
        this.props.onSearch(e.target.value);
    }

    _onReset() {
        this.props.input.onChange(null);
    }
}
