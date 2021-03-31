import * as React from 'react';
import {useCallback, useEffect, useMemo} from 'react';
import {useComponents, useDataProvider, useDataSelect} from '@steroidsjs/core/hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '@steroidsjs/core/ui/form/Field/fieldWrapper';
import {IDataProviderConfig} from '@steroidsjs/core/hooks/useDataProvider';
import {IDataSelectConfig} from '@steroidsjs/core/hooks/useDataSelect';

export interface IRadioListFieldProps extends IFieldWrapperInputProps, IDataProviderConfig,
 Omit<IDataSelectConfig, 'items'> {
    inputProps?: any;
    className?: CssClassName;
    view?: CustomView;
}

export interface IRadioListFieldViewProps extends IFieldWrapperOutputProps {
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
}

function RadioListField(props: IRadioListFieldProps) {
    const components = useComponents();

    // Data provider
    const {items} = useDataProvider({
        items: props.items,
    });

    // Data select
    const {
        selectedIds,
        setSelectedIds,
    } = useDataSelect({
        selectedIds: props.selectedIds,
        primaryKey: props.primaryKey,
        items,
    });

    const onItemSelect = useCallback((id) => {
        setSelectedIds(id);
    }, [setSelectedIds]);

    const inputProps = useMemo(() => ({
        ...props.inputProps,
        type: 'radio',
        name: props.input.name,
        disabled: props.disabled,
        onChange: (value) => props.input.onChange(value),
    }), [props.disabled, props.input, props.inputProps]);

    // Sync with form
    useEffect(() => {
        props.input.onChange.call(null, selectedIds[0]);
    }, [props.input.onChange, selectedIds]);

    return components.ui.renderView(props.view || 'form.RadioListFieldView', {
        ...props,
        inputProps,
        onItemSelect,
        selectedIds,
    });
}

RadioListField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    errors: [],
};

export default fieldWrapper('RadioListField', RadioListField);
