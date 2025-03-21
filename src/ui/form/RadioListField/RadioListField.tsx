import React, {useMemo} from 'react';
import {useComponents} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import {IRadioFieldViewProps} from '../RadioField/RadioField';
import useListField from '../CheckboxListField/useListField';

/**
 * RadioListField
 * Список с радиокнопками. Используется в формах для выбора одного значения.
 */
export interface IRadioListFieldProps extends IFieldWrapperInputProps, IDataProviderConfig,
    Omit<IDataSelectConfig, 'items'>, IUiComponent {
    /**
     * Свойства для элемента input
     * @example {onKeyDown: ...}
     */
    inputProps?: any,

    /**
     * Ориентация списка
     */
    orientation?: Orientation,
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
        required?: boolean,
        size?: Size,
    }[],
    selectedIds: (PrimaryKey | any)[],
    className?: CssClassName,
    orientation?: Orientation,
    disabled?: boolean,
    size?: Size,
    onItemSelect: (id: PrimaryKey | any) => void,
    renderItem: (radioProps: IRadioFieldViewProps) => JSX.Element,
}

function RadioListField(props: IRadioListFieldProps): JSX.Element {
    const components = useComponents();

    const {
        selectedIds,
        items,
        inputProps,
        onItemSelect,
        renderItem,
    } = useListField({
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
    }), [inputProps, items, onItemSelect, props.className, props.disabled, props.orientation,
        props.size, props.style, props.viewProps, renderItem, selectedIds]);

    return components.ui.renderView(props.view || 'form.RadioListFieldView', viewProps);
}

RadioListField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    multiple: false,
    errors: null,
    orientation: 'vertical',
};

export default fieldWrapper<IRadioListFieldProps>('RadioListField', RadioListField);
