import * as React from 'react';
import {useCallback, useEffect} from 'react';
import {usePrevious} from 'react-use';
import _isEqual from 'lodash-es/isEqual';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../Field/fieldWrapper';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {useComponents, useDataProvider, useDataSelect} from '../../../hooks';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';

/**
 * SwitcherField
 * Список с кнопками. Используется для выбора одного значения.
 */
export interface ISwitcherFieldProps extends IFieldWrapperInputProps,
    IDataProviderConfig, Omit<IDataSelectConfig, 'items'> {

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Свойства для компонента Button
     */
    buttonProps?: any;

    [key: string]: any;
}

export interface ISwitcherFieldViewProps extends IFieldWrapperOutputProps, Omit<ISwitcherFieldProps, 'items'> {
    items: Record<string, unknown>[],
    hoveredId: PrimaryKey | any,
    selectedIds: (PrimaryKey | any)[],
    onItemSelect: (id: PrimaryKey | any) => void,
    onItemHover: (id: PrimaryKey | any) => void,
    buttonProps?: any,
}

function SwitcherField(props: ISwitcherFieldProps) {
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
    });

    const onItemHover = useCallback((id) => {
        setHoveredId(id);
    }, [setHoveredId]);

    const onItemSelect = useCallback((id) => {
        setSelectedIds(id);
    }, [setSelectedIds]);

    // Sync with form
    const prevSelectedIds = usePrevious(selectedIds);
    useEffect(() => {
        if (!_isEqual(prevSelectedIds, selectedIds)) {
            props.input.onChange.call(null, selectedIds[0] ?? null);
        }
    }, [selectedIds, props.input.onChange, prevSelectedIds]);

    return components.ui.renderView(props.view || 'form.SwitcherFieldView', {
        ...props,
        items,
        hoveredId,
        selectedIds,
        onItemHover,
        onItemSelect,
    });
}

SwitcherField.defaultProps = {
    primaryKey: 'id',
    disabled: false,
    required: false,
    className: '',
    errors: [],
};

export default fieldWrapper('SwitcherField', SwitcherField);
