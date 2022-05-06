import * as React from 'react';
import {useCallback, useEffect, useMemo} from 'react';
import {useComponents, useDataProvider, useDataSelect} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';

/**
 * RadioListField
 * Список с радиокнопками. Используется в формах для выбора одного значения.
 */
export interface IRadioListFieldProps extends IFieldWrapperInputProps, IDataProviderConfig,
 Omit<IDataSelectConfig, 'items'> {
    /**
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any;

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
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
        disabled?: boolean,
        isSelected: boolean,
        isHovered: boolean,
    }[],
    selectedIds: (PrimaryKey | any)[],
    onItemSelect: (id: PrimaryKey | any) => void,
}

function RadioListField(props: IRadioListFieldProps): JSX.Element {
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
        selectFirst: props.selectFirst,
        primaryKey: props.primaryKey,
        items,
        inputValue: props.input.value,
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
        props.onChange?.call(null, selectedIds[0]);
    }, [props.input.onChange, selectedIds]);

    return components.ui.renderView(props.view || 'form.RadioListFieldView', {
        ...props,
        items,
        inputProps,
        onItemSelect,
        selectedIds,
    });
}

RadioListField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    errors: null,
};

export default fieldWrapper<IRadioListFieldProps>('RadioListField', RadioListField);
