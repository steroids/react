import React, {useCallback, useEffect, useMemo} from 'react';
import {usePrevious, useUpdateEffect} from 'react-use';
import _isEqual from 'lodash-es/isEqual';
import Enum from '../../../base/Enum';
import {useComponents, useDataProvider, useDataSelect} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../../ui/form/Field/fieldWrapper';
import {DataProviderItems, IDataProviderConfig} from '../../../hooks/useDataProvider';
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
    items: CheckboxFieldListItems,

    /**
     * Кастомная вьюшка для элемента
     */
    itemView?: CustomView,

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
    renderCheckbox: (checkboxProps: ICheckboxFieldViewProps) => JSX.Element,
    size?: Size,
}

function CheckboxListField(props: ICheckboxListFieldProps): JSX.Element {
    const components = useComponents();

    const inputSelectedIds = useMemo(
        () => props.selectedIds || [].concat(props.input.value || []),
        [props.input.value, props.selectedIds],
    );

    // Data Provider
    const {items} = useDataProvider({
        items: props.items as DataProviderItems,
    });

    // Data select
    const {
        selectedIds,
        setSelectedIds,
    } = useDataSelect({
        selectedIds: inputSelectedIds,
        multiple: props.multiple,
        primaryKey: props.primaryKey,
        selectFirst: props.selectFirst,
        items,
        inputValue: props.input.value,
    });

    const onItemSelect = useCallback((id) => {
        setSelectedIds(id);
    }, [setSelectedIds]);

    const inputProps = useMemo(() => ({
        ...props.inputProps,
        type: 'checkbox',
        name: props.input.name,
        disabled: props.disabled,
    }), [props.disabled, props.input, props.inputProps]);

    // Sync with form
    const prevSelectedIds = usePrevious(selectedIds);
    useEffect(() => {
        if (!_isEqual(prevSelectedIds || [], selectedIds)) {
            props.input.onChange.call(null, selectedIds);
            if (props.onChange) {
                props.onChange.call(null, selectedIds);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.input.onChange, selectedIds]);

    const onReset = useCallback(() => {
        setSelectedIds([]);
    }, [setSelectedIds]);

    // Reset selected ids on form reset
    const prevInputValue = usePrevious(props.input.value);
    useUpdateEffect(() => {
        // if form reset
        if (prevInputValue && props.input.value === undefined && selectedIds.length > 0) {
            onReset();
        }
    }, [onReset, prevInputValue, props.input.value, selectedIds.length]);

    const CheckboxFieldView = props.itemView || components.ui.getView('form.CheckboxFieldView');

    const renderCheckbox = useCallback((checkboxProps: ICheckboxFieldViewProps) => (
        <CheckboxFieldView
            {...checkboxProps}
        />
    ), [CheckboxFieldView]);

    const viewProps = useMemo(() => ({
        items,
        inputProps,
        onItemSelect,
        selectedIds,
        renderCheckbox,
        orientation: props.orientation,
        size: props.size,
        disabled: props.disabled,
        className: props.className,
        style: props.style,
        viewProps: props.viewProps,
    }), [
        inputProps,
        items,
        onItemSelect,
        props.className,
        props.disabled,
        props.orientation,
        props.size,
        props.style,
        props.viewProps,
        renderCheckbox,
        selectedIds,
    ]);

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
