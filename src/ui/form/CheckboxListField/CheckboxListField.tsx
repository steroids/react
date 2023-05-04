import * as React from 'react';
import {useCallback, useEffect, useMemo} from 'react';
import {usePrevious, useUpdateEffect} from 'react-use';
import {useComponents, useDataProvider, useDataSelect} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../../ui/form/Field/fieldWrapper';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import {ICheckboxFieldViewProps} from '../CheckboxField/CheckboxField';

/**
 * CheckboxListField
 * Список с чекбоксами. Используется в формах для выбора нескольких значений.
 */
export interface ICheckboxListFieldProps extends IFieldWrapperInputProps,
    IDataProviderConfig, Omit<IDataSelectConfig, 'items'> {

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

    /**
     * Ориентация списка
     */
    orientation?: Orientation,

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
    orientation?: Orientation,
    renderCheckbox: (checkboxProps: ICheckboxFieldViewProps) => JSX.Element,
}

function CheckboxListField(props: ICheckboxListFieldProps): JSX.Element {
    const components = useComponents();

    const inputSelectedIds = useMemo(
        () => props.selectedIds || [].concat(props.input.value || []),
        [props.input.value, props.selectedIds],
    );

    // Data Provider
    const {items} = useDataProvider({
        items: props.items,
    });

    // Data select
    const {
        selectedIds,
        setSelectedIds,
    } = useDataSelect({
        selectedIds: inputSelectedIds,
        multiple: props.multiple,
        primaryKey: props.primaryKey,
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
    useEffect(() => {
        props.input.onChange.call(null, selectedIds);
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

    const CheckboxFieldView = components.ui.getView('form.CheckboxFieldView');

    const renderCheckbox = (checkboxProps: ICheckboxFieldViewProps) => <CheckboxFieldView {...checkboxProps} />;

    return components.ui.renderView(props.view || 'form.CheckboxListFieldView', {
        ...props,
        items,
        inputProps,
        onItemSelect,
        selectedIds,
        renderCheckbox,
    });
}

CheckboxListField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    multiple: true,
    orientation: 'vertical',
};

export default fieldWrapper<ICheckboxListFieldProps>('CheckboxListField', CheckboxListField);
