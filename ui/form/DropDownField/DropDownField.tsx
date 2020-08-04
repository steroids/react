import * as React from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import {components, field} from '../../../hoc';
import dataProvider, {IDataProviderHocInput, IDataProviderHocOutput} from '../../../hoc/dataProvider';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';
import {conditional} from 'conditional-decorator';

export interface IDropDownFieldProps extends IFieldHocInput, IDataProviderHocInput {

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    searchPlaceholder?: string;
    inputProps?: any;
    className?: CssClassName;
    style?: any,
    view?: any;

    /**
     * Показать кнопку для сброса выбранного значения
     * @example true
     */
    showReset?: boolean;
}

export interface IDropDownFieldViewProps extends IFieldHocOutput, IDataProviderHocOutput {
    style?: any,
    items: {
        id: number | string | boolean,

        /**
         * Название поля
         * @example Save
         */
        label?: string,
        isSelected: boolean,
        isHovered: boolean,
    }[];
    selectedItems?: {
        id: number | string | boolean,

        /**
         * Название поля
         * @example Save
         */
        label?: string
    }[];
    multiple: boolean,
    placeholder: string,
    searchInputProps: {
        type: string,
        name: string,
        onChange: (value: string) => void,
        value: string | number,
        placeholder: string,
        disabled: string,
    },
    isOpened?: boolean,
    isLoading?: boolean,
    showReset?: boolean,
    onOpen: () => void,
    onReset: () => void,
    onItemClick: (item: {id: number | string | boolean}) => void,
    onItemMouseOver: (item: {id: number | string | boolean}) => void,
}

interface IDropDownFieldPrivateProps extends IFieldHocOutput, IDataProviderHocOutput, IComponentsHocOutput {}

@field({
    componentId: 'form.DropDownField'
})
@dataProvider()
@conditional(!!process.env.IS_WEB, enhanceWithClickOutside)
@components('ui')
export default class DropDownField extends React.PureComponent<IDropDownFieldProps & IDropDownFieldPrivateProps> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        autoComplete: false,
        showReset: false,
        multiple: false
    };

    constructor(props) {
        super(props);
        this._onReset = this._onReset.bind(this);
    }

    handleClickOutside() {
        this.props.onClose();
    }

    render() {
        const DropDownFieldView = this.props.view || this.props.ui.getView('form.DropDownFieldView');

        return (
            <DropDownFieldView
                {...this.props}
                searchInputProps={{
                    type: 'search',
                    placeholder:
                        this.props.searchPlaceholder ||
                        __('Начните вводить символы для поиска...'),
                    onChange: value => this.props.onSearch(value),
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
                onClose={this.props.onClose}
            />
        );
    }

    _onReset() {
        this.props.input.onChange(null);
    }
}
