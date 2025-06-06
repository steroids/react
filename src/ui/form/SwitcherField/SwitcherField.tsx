import React, {useCallback, useEffect, useMemo} from 'react';
import {usePrevious} from 'react-use';
import _isEqual from 'lodash-es/isEqual';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../Field/fieldWrapper';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {useComponents, useDataProvider, useDataSelect} from '../../../hooks';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import {FieldEnum} from '../../../enums';

export interface ISwitcherItem {
    id: number | string | boolean,
    label?: string | {
        checked: string,
        unchecked: string,
    },
    [key: string]: any,
}

/**
 * SwitcherField
 * Список с кнопками. Используется для выбора одного значения.
 */
export interface ISwitcherFieldProps extends IFieldWrapperInputProps,
    IDataProviderConfig, Omit<IDataSelectConfig, 'items'>, IUiComponent {
    /**
    * Свойства для элемента input
    * @example {onKeyDown: ...}
    */
    inputProps?: any,
}

export interface ISwitcherFieldViewProps extends IFieldWrapperOutputProps, Omit<ISwitcherFieldProps, 'items'> {
    items: ISwitcherItem[],
    hoveredId: PrimaryKey | any,
    selectedIds: (PrimaryKey | any)[],
    onItemSelect: (id: PrimaryKey | any) => void,
    onItemHover: (id: PrimaryKey | any) => void,
    buttonProps?: any,
    inputProps: {
        name: string,
        type: string,
        disabled?: boolean,
        onChange: (value: string | React.ChangeEvent) => void,
    },
}

function SwitcherField(props: ISwitcherFieldProps): JSX.Element {
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
        selectFirst: props.selectFirst,
        selectedIds: props.selectedIds,
        primaryKey: props.primaryKey,
        items,
        inputValue: props.input.value,
        multiple: props.multiple,
    });

    const onItemHover = useCallback((id) => {
        setHoveredId(id);
    }, [setHoveredId]);

    const onItemSelect = useCallback((id) => {
        setSelectedIds(id);
    }, [setSelectedIds]);

    const inputProps = React.useMemo(() => ({
        ...props.inputProps,
        type: 'checkbox',
        name: props.input.name,
        disabled: props.disabled,
    }), [props.disabled, props.input.name, props.inputProps]);

    // Sync with form
    const prevSelectedIds = usePrevious(selectedIds);
    useEffect(() => {
        if (!_isEqual(prevSelectedIds, selectedIds)) {
            props.input.onChange.call(null, selectedIds[0] ?? null);
            if (props.onChange) {
                props.onChange(selectedIds);
            }
        }
    }, [selectedIds, props.input.onChange, prevSelectedIds, props, items]);

    const viewProps = useMemo(() => ({
        items,
        inputProps,
        hoveredId,
        selectedIds,
        onItemHover,
        onItemSelect,
        className: props.className,
        style: props.style,
        size: props.size,
    }), [hoveredId, inputProps, items, onItemHover, onItemSelect, props.className, props.size, props.style, selectedIds]);

    return components.ui.renderView(props.view || 'form.SwitcherFieldView', viewProps);
}

SwitcherField.defaultProps = {
    primaryKey: 'id',
    disabled: false,
    required: false,
    className: '',
    errors: null,
};

export default fieldWrapper<ISwitcherFieldProps>(FieldEnum.SWITCHER_FIELD, SwitcherField);
