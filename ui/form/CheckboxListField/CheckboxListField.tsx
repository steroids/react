import * as React from 'react';
import {useComponents, useDataProvider, useDataSelect} from '@steroidsjs/core/hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '@steroidsjs/core/ui/form/Field/fieldWrapper';
import {IDataProviderConfig} from '@steroidsjs/core/hooks/useDataProvider';
import {IDataSelectConfig} from '@steroidsjs/core/hooks/useDataSelect';
import {useCallback, useEffect, useMemo} from 'react';

export interface ICheckboxListFieldProps extends IFieldWrapperInputProps, IDataProviderConfig, Omit<IDataSelectConfig, 'items'> {

    /**
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any,
    className?: CssClassName,
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

function CheckboxListField(props: ICheckboxListFieldProps) {
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
        onChange: () => props.input.onChange(!props.input.value),
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

export default fieldWrapper('CheckboxListField', CheckboxListField);
