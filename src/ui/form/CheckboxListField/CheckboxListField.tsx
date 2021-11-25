import * as React from 'react';
import {useCallback, useEffect, useMemo} from 'react';
import {useComponents, useDataProvider, useDataSelect} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../../ui/form/Field/fieldWrapper';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';

/**
 * CheckboxListField
 * Список с чекбоксами. Используется в формах для выбора нескольких значений.
 */
export interface ICheckboxListFieldProps extends IFieldWrapperInputProps, IDataProviderConfig, Omit<IDataSelectConfig, 'items'> {

    /**
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any,

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

    [key: string]: any,
}

export interface ICheckboxListFieldViewProps extends IFieldWrapperOutputProps {
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
    }[],
    selectedIds: (PrimaryKey | any)[],
    onItemSelect: (id: PrimaryKey | any) => void,
    onItemHover: (id: PrimaryKey | any) => void,
}

function CheckboxListField(props: ICheckboxListFieldProps): JSX.Element {
    const components = useComponents();

    // Data Provider
    const {items} = useDataProvider({
        items: props.items,
    });

    // Data select
    const {
        hoveredId,
        setHoveredId,
        selectedIds,
        setSelectedIds,
    } = useDataSelect({
        multiple: props.multiple,
        selectedIds: props.selectedIds,
        primaryKey: props.primaryKey,
        items,
        inputValue: props.input.value,
    });

    const onItemSelect = useCallback((id) => {
        setSelectedIds(id);
    }, [setSelectedIds]);

    const onItemHover = useCallback((id) => {
        setHoveredId(id);
    }, [setHoveredId]);

    const inputProps = useMemo(() => ({
        ...props.inputProps,
        type: 'checkbox',
        name: props.input.name,
        disabled: props.disabled,
    }), [props.disabled, props.input, props.inputProps]);

    // Sync with form
    useEffect(() => {
        props.input.onChange.call(null, selectedIds);
    }, [props.input.onChange, selectedIds]);

    return components.ui.renderView(props.view || 'form.CheckboxListFieldView', {
        ...props,
        items,
        inputProps,
        onItemSelect,
        selectedIds,
        onItemHover,
        hoveredId,
    });
}

CheckboxListField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    multiple: true,
};

export default fieldWrapper<ICheckboxListFieldProps>('CheckboxListField', CheckboxListField);
