import React, {useCallback, useEffect, useMemo} from 'react';
import {usePrevious, useUpdateEffect} from 'react-use';
import _isArray from 'lodash-es/isArray';
import _isEqual from 'lodash-es/isEqual';
import {IPreparedTreeItem} from '../../../hooks/useTree';
import Enum from '../../../base/Enum';
import {useComponents, useDataProvider, useDataSelect, useTree} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../../ui/form/Field/fieldWrapper';
import {DataProviderItems, IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import {ICheckboxFieldViewProps} from '../CheckboxField/CheckboxField';
import {ITreeProps} from '../../nav/Tree/Tree';

type CheckboxTreeItems = string
    | ({new(): Enum,})
    | (string | number | {id: string | number | boolean, label: string, color?: string, [key: string]: any,})[];

/**
 * CheckboxTreeField
 *
 * Список с вложенными чекбоксами. Используется в формах для создания иерархической структуры и выбора нескольких значений.
 */
export interface ICheckboxTreeFieldProps extends IFieldWrapperInputProps,
    Omit<IDataProviderConfig, 'items'>,
    Omit<IDataSelectConfig, 'items'>, IUiComponent,
    Pick<ITreeProps, 'levelPadding' | 'alwaysOpened' | 'hasIconExpandOnly' | 'customIcon' | 'saveInClientStorage' | 'collapseChildItems'> {
    /**
     * Свойства для элемента input
     * @example { onKeyDown: ... }
     */
    inputProps?: any,

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
    items: CheckboxTreeItems,

    /**
     * Первичный ключ для доступа к вложенным элементам
     */
    primaryKey?: string,

    /**
     * Отображать чекбоксы только на узлах, не имеющих вложенных элементов
     */
    hasOnlyLeafCheckboxes?: boolean,

    /**
     * View компонент для элемента дерева
     */
    itemView?: CustomView,

    [key: string]: any,
}

export interface ICheckboxTreeFieldViewProps extends IFieldWrapperOutputProps,
    Pick<ITreeProps, 'levelPadding' | 'hasIconExpandOnly' | 'customIcon'>
{
    items: {
        id: number | string | boolean,
        label?: string,
        isHovered: boolean,
        color?: string,
        disabled?: boolean,
        required?: boolean,
    } & IPreparedTreeItem[],
    selectedIds: (PrimaryKey | any)[],
    onItemSelect: (checkbox: IPreparedTreeItem) => void,
    renderCheckbox: (checkboxProps: ICheckboxFieldViewProps) => JSX.Element,
    size?: Size,
    hasOnlyLeafCheckboxes?: boolean,
    itemView: CustomView,
}

export const getNestedItemsIds = (item, groupAttribute, hasOnlyLeafCheckboxes = false) => {
    if (item.disabled) {
        return [];
    }

    const {[groupAttribute]: nestedItems = []} = item;
    const result = hasOnlyLeafCheckboxes ? [] : [item.id];

    if (groupAttribute && _isArray(nestedItems)) {
        nestedItems.reduce((acc, nestedItem) => {
            if (_isArray(nestedItem[groupAttribute])) {
                acc.push(...getNestedItemsIds(nestedItem, groupAttribute));
            } else if (!nestedItem.disabled) {
                acc.push(nestedItem.id);
            }
            return acc;
        }, result);
    }

    return result.sort();
};

function CheckboxTreeField(props: ICheckboxTreeFieldProps): JSX.Element {
    const components = useComponents();

    const TreeItemView = props.itemView || components.ui.getView('nav.TreeItemView');

    const inputSelectedIds = useMemo(
        () => props.selectedIds || [].concat(props.input.value || []),
        [props.input.value, props.selectedIds],
    );

    // Data Provider
    const {items} = useDataProvider({
        items: props.items as DataProviderItems,
        initialSelectedIds: inputSelectedIds,
        dataProvider: props.dataProvider,
    });

    // Tree items
    const {treeItems} = useTree({
        items,
        autoOpenLevels: 0,
        alwaysOpened: props.alwaysOpened,
        collapseChildItems: props.collapseChildItems,
    });

    // Data select
    const {
        selectedIds,
        setSelectedIds,
    } = useDataSelect({
        selectedIds: inputSelectedIds,
        multiple: true,
        primaryKey: props.primaryKey,
        items: treeItems,
        inputValue: props.input.value,
    });

    const onItemSelect = useCallback((checkbox) => {
        if (checkbox.hasItems) {
            const selectedItemIds = getNestedItemsIds(checkbox, props.primaryKey, props.hasOnlyLeafCheckboxes);

            setSelectedIds(selectedItemIds);
        } else if (checkbox.id && !checkbox.hasItems) {
            setSelectedIds(checkbox.id);
        }
    }, [props.hasOnlyLeafCheckboxes, props.primaryKey, setSelectedIds]);

    const onReset = useCallback(() => {
        setSelectedIds([]);
    }, [setSelectedIds]);

    // Sync with form
    const prevSelectedIds = usePrevious(selectedIds);
    useEffect(() => {
        if (!_isEqual(prevSelectedIds || [], selectedIds)) {
            props.input.onChange.call(null, selectedIds);
            if (props.onChange) {
                props.onChange.call(null, selectedIds);
            }
        }
    }, [prevSelectedIds, props.input.onChange, props.multiple, props.onChange, selectedIds]);

    // Reset selected ids on form reset
    const prevInputValue = usePrevious(props.input.value);
    useUpdateEffect(() => {
        // if form reset
        if (prevInputValue && props.input.value === undefined && selectedIds.length > 0) {
            onReset();
        }
    }, [onReset, prevInputValue, props.input.value, selectedIds.length]);

    const CheckboxFieldView = components.ui.getView('form.CheckboxFieldView');

    const renderCheckbox = (checkboxProps: ICheckboxFieldViewProps) => (
        <CheckboxFieldView
            {...checkboxProps}
        />
    );

    const viewProps = useMemo(() => ({
        items: treeItems,
        onItemSelect,
        selectedIds,
        renderCheckbox,
        size: props.size,
        levelPadding: props.levelPadding,
        hasOnlyLeafCheckboxes: props.hasOnlyLeafCheckboxes,
        hasIconExpandOnly: props.hasIconExpandOnly,
        itemView: TreeItemView,
    }), [treeItems, onItemSelect, selectedIds, renderCheckbox, props.size, props.levelPadding, props.hasOnlyLeafCheckboxes,
        props.hasIconExpandOnly, TreeItemView]);

    return components.ui.renderView(props.view || 'form.CheckboxTreeFieldView', viewProps);
}

CheckboxTreeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    levelPadding: 32,
    alwaysOpened: false,
    primaryKey: 'items',
    hasOnlyLeafCheckboxes: false,
    hasIconExpandOnly: true,
    saveInClientStorage: false,
    collapseChildItems: false,
};

export default fieldWrapper<ICheckboxTreeFieldProps>('CheckboxTreeField', CheckboxTreeField);
