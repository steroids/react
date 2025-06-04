import React, {useMemo} from 'react';
import Enum from '../../../base/Enum';
import {useComponents, useListField} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../../ui/form/Field/fieldWrapper';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import {ICheckboxFieldViewProps} from '../CheckboxField/CheckboxField';

type CheckboxFieldListItems = string
    | ({new(): Enum,})
    | (string | number | {id: string | number | boolean, label: string | any, color?: string, [key: string]: any,})[];

/**
 * CheckboxListField
 *
 * Список с чекбоксами. Используется в формах для выбора нескольких значений.
 */
export interface ICheckboxListFieldProps extends IFieldWrapperInputProps,
    Omit<IDataProviderConfig, 'items'>, Omit<IDataSelectConfig, 'items'>, IUiComponent {
    /**
     * Свойства для элемента input
     * @example { onKeyDown: ... }
     */
    inputProps?: any,

    /**
     * Ориентация списка
     */
    orientation?: Orientation,

    /**
     * Коллекция элементов
     * @example
     * [
     *  {
     *      id: 1,
     *      label: 'Krasnoyarsk',
     *      color: 'red'
     *  },
     *  {
     *      id: 2,
     *      label: 'Moscow',
     *      color: 'purple'
     *  }
     * ]
     */
    items?: CheckboxFieldListItems,

    /**
     * Кастомная вьюшка для элемента
     */
    itemView?: CustomView,

    /**
     * Пропсы для отображения элемента
     */
    itemViewProps?: CustomViewProps,

    /**
     * Свойства для компонента отображения
     * @example
     * {
     *  customHandler: () => {...}
     * }
     */
    viewProps?: {
        [key: string]: any,
    },
}

export interface ICheckboxListFieldViewProps extends IFieldWrapperOutputProps, IUiComponent {
    inputProps: {
        name: string,
        type: string,
        disabled?: boolean,
        onChange: (value: string | React.ChangeEvent) => void,
    },
    items: {
        id: number | string | boolean,
        label?: string,
        isSelected: boolean,
        isHovered: boolean,
        color?: string,
        required?: boolean,
        size?: Size,
        disabled?: boolean,
    }[],
    selectedIds: (PrimaryKey | any)[],
    onItemSelect: (id: PrimaryKey | any) => void,
    orientation?: Orientation,
    disabled?: boolean,
    renderItem: (checkboxProps: ICheckboxFieldViewProps) => JSX.Element,
    size?: Size,
    className?: string,
}

function CheckboxListField(props: ICheckboxListFieldProps): JSX.Element {
    const components = useComponents();

    const {
        selectedIds,
        items,
        inputProps,
        onItemSelect,
        renderItem,
    } = useListField({
        inputType: props.multiple ? 'checkbox' : 'radio',
        defaultItemView: props.multiple ? 'form.CheckboxFieldView' : 'form.RadioFieldView',
        selectedIds: props.selectedIds,
        input: props.input,
        items: props.items,
        dataProvider: props.dataProvider,
        multiple: props.multiple,
        selectFirst: props.selectFirst,
        primaryKey: props.primaryKey,
        inputProps: props.inputProps,
        disabled: props.disabled,
    });

    const viewProps = useMemo(() => ({
        items,
        inputProps,
        onItemSelect,
        selectedIds,
        renderItem,
        orientation: props.orientation,
        size: props.size,
        disabled: props.disabled,
        className: props.className,
        style: props.style,
        viewProps: props.viewProps,
    }), [inputProps, items, onItemSelect, props.className, props.disabled,
        props.orientation, props.size, props.style, props.viewProps, renderItem, selectedIds]);

    return components.ui.renderView(props.view || 'form.CheckboxListFieldView', viewProps);
}

CheckboxListField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    multiple: true,
    orientation: 'vertical',
};

export default fieldWrapper<ICheckboxListFieldProps>('CheckboxListField', CheckboxListField);
