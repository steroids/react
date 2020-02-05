import * as React from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import {components, field} from '../../../hoc';
import dataProvider, {IDataProviderHocInput, IDataProviderHocOutput} from '../../../hoc/dataProvider';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

interface IDropDownFieldProps extends IFieldHocInput, IDataProviderHocInput {
    searchPlaceholder?: string;
    inputProps?: any;
    className?: string;
    view?: any;
    showReset?: boolean;
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

interface IDropDownFieldPrivateProps extends IFieldHocOutput, IDataProviderHocOutput, IComponentsHocOutput {
}

@field({
    componentId: 'form.DropDownField'
})
@dataProvider()
@enhanceWithClickOutside
@components('ui')
export default class DropDownField extends React.PureComponent<IDropDownFieldProps & IDropDownFieldPrivateProps,
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
