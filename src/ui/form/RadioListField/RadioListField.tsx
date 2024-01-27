import React, {useCallback, useEffect, useMemo} from 'react';
import {usePrevious} from 'react-use';
import _isEqual from 'lodash-es/isEqual';
import {useComponents, useDataProvider, useDataSelect} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import {IRadioFieldViewProps} from '../RadioField/RadioField';

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
    renderRadio: (radioProps: IRadioFieldViewProps) => JSX.Element,
}

function RadioListField(props: IRadioListFieldProps): JSX.Element {
    const components = useComponents();

    const inputSelectedIds = useMemo(
        () => props.selectedIds || [].concat(props.input.value || []),
        [props.input.value, props.selectedIds],
    );

    // Data provider
    const {items} = useDataProvider({
        items: props.items,
    });

    // Data select
    const {
        selectedIds,
        setSelectedIds,
    } = useDataSelect({
        multiple: props.multiple,
        selectedIds: inputSelectedIds,
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
    const prevSelectedIds = usePrevious(selectedIds);
    useEffect(() => {
        if (!_isEqual(prevSelectedIds || [], selectedIds)) {
            props.input.onChange.call(null, selectedIds[0]);
            if (props.onChange) {
                props.onChange.call(null, selectedIds[0]);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.input.onChange, selectedIds]);

    const RadioFieldView = components.ui.getView('form.RadioFieldView');

    const renderRadio = (radioProps: IRadioFieldViewProps) => <RadioFieldView {...radioProps} />;

    const viewProps = useMemo(() => ({
        items,
        inputProps,
        onItemSelect,
        selectedIds,
        renderRadio,
        orientation: props.orientation,
        className: props.className,
        disabled: props.disabled,
        size: props.size,
    }), [inputProps, items, onItemSelect, props.className, props.disabled, props.orientation, props.size, renderRadio, selectedIds]);

    return components.ui.renderView(props.view || 'form.RadioListFieldView', viewProps);
}

RadioListField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    multiple: true,
    errors: null,
    orientation: 'vertical',
};

export default fieldWrapper<IRadioListFieldProps>('RadioListField', RadioListField);
