import _isEqual from 'lodash-es/isEqual';
import _isEmpty from 'lodash-es/isEmpty';
import _isArray from 'lodash-es/isArray';
import _isNil from 'lodash-es/isNil';
import _difference from 'lodash-es/difference';
import _intersection from 'lodash-es/intersection';
import _pullAll from 'lodash-es/pullAll';
import {MutableRefObject, useCallback, useMemo, useState} from 'react';
import {useEvent, usePrevious, useUpdateEffect} from 'react-use';

export interface IDataSelectItem {
    /**
    * Идентификатор элемента
    */
    id: number | string | boolean,

    /**
    * Отображаемое название для IDataSelectItem
    */
    label?: string,

    [key: string]: unknown,
}

export interface IDataSelectConfig {
    /**
     * Возможность множественного выбора
     * @example true
     */
    multiple?: boolean,

    /**
     * Список с видимыми элементами
     * @example [{id: 1, label: 'Krasnoyarsk'}, {id: 2, label: 'Moscow'}]
     */
    items?: IDataSelectItem[],

    /**
     * Сделать активным первый элемент в списке
     * @example true
     */
    selectFirst?: boolean,

    /**
     * Список с идентификаторами выбранных элементов
     * @example [1, 4]
     */
    selectedIds?: any,

    /**
     * Первичный ключ для item
     * @example id
     */
    primaryKey?: string,

    /**
     * Атрибут, в котором должны лежать дочерние элементы списка (для группировки)
     * Если аттрибут не задан - группировка не производится
     * @example items
     */
    groupAttribute?: string,

    /**
     * Значение поля в форме
     */
    inputValue?: any,

    /**
     * Список со всеми элементами
     */
    sourceItems?: IDataSelectItem[],

    /**
     * Ref autocomplete поиска
     */
    autoCompleteInputRef?: MutableRefObject<HTMLInputElement>,

    /**
     * Нужно ли закрывать выпадающий список после выбора элемента
     * @example true
     */
    hasCloseOnSelect?: boolean,
}

export interface IDataSelectResult {
    isOpened: boolean,
    setIsOpened: (value: boolean) => void,
    isFocused: boolean,
    setIsFocused: (value: boolean) => void,
    hoveredId: PrimaryKey,
    setHoveredId: (id: PrimaryKey) => void,
    selectedIds: PrimaryKey[],
    setSelectedIds: (ids: PrimaryKey | PrimaryKey[], skipToggle?: boolean) => void,
    selectedItems: IDataSelectItem[],
    setSelectedAll: VoidFunction,
    isSelectedAll: boolean,
}

const defaultProps = {
    primaryKey: 'id',
};

const isAutoCompleteInputFocused = (
    autoCompleteInputRef: MutableRefObject<HTMLInputElement>,
) => document.activeElement === autoCompleteInputRef.current;

export const getFlattenedItems = (items, groupAttribute) => {
    let result = [];
    items.forEach(item => {
        if (groupAttribute && Array.isArray(item[groupAttribute])) {
            result = result.concat(getFlattenedItems(item[groupAttribute], groupAttribute));
        } else {
            result.push(item);
        }
    });
    return result;
};

const isIdExists = id => {
    if (typeof id === 'boolean') {
        return true;
    }
    return !!id;
};

export default function useDataSelect(config: IDataSelectConfig): IDataSelectResult {
    // Get primary key
    const primaryKey = config.primaryKey || defaultProps.primaryKey;

    const flattenedItems: IDataSelectItem[] = useMemo(
        () => getFlattenedItems(config.items, config.groupAttribute),
        [config.groupAttribute, config.items],
    );

    // Initial select
    const initialSelectedIds = useMemo(() => {
        if (config.selectedIds?.length > 0) {
            return [].concat(config.selectedIds || []);
        }

        if (!_isNil(config.inputValue)) {
            return [].concat(_isArray(config.inputValue) ? config.inputValue : [config.inputValue]);
        }

        return config.selectFirst && flattenedItems.length > 0
            ? [flattenedItems[0][primaryKey]]
            : [];
    }, [config.selectedIds, config.inputValue, config.selectFirst, flattenedItems, primaryKey]);

    const initialSelectedItems = useMemo(
        () => flattenedItems.length > 0
        && initialSelectedIds.length > 0
            ? initialSelectedIds
                .map(selectedId => flattenedItems.find(item => item.id === selectedId))
                .filter(isIdExists)
            : [],
        [initialSelectedIds, flattenedItems],
    );

    // State
    const [isOpened, setIsOpened] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedIds, setSelectedIdsInternal] = useState(initialSelectedIds);
    const [selectedItems, setSelectedItemsInternal] = useState(initialSelectedItems);
    const [isSelectedAll, setIsSelectedAll] = useState(config.items.length === selectedIds.length);

    // Handler for select/toggle item by id
    const setSelectedIds = useCallback((ids, skipToggle = false) => {
        if (_isArray(ids)) {
            if (!config.multiple && ids.length > 1) {
                ids = [ids[0]];
            }

            if (_isEmpty(ids)) {
                setSelectedIdsInternal([]);
                return;
            }

            // If all elements of selectedIds are equal to ids, remove all elements
            if (_isEqual(new Set(selectedIds), new Set(ids))) {
                setSelectedIdsInternal([]);
                return;
            }

            // Check if all elements from ids are contained in selectedIds
            const intersection = _intersection(selectedIds, ids);

            // If all elements are contained, remove them from sourceArray
            if (_isEqual(intersection, ids)) {
                const prevSelectedIds = [...selectedIds];

                _pullAll(prevSelectedIds, ids);

                setSelectedIdsInternal((prevSelectedIds || []).sort());
                return;
            }

            // If not all elements are contained, add new ids
            if (!_isEqual(intersection, ids)) {
                const difference = _difference(ids, selectedIds);
                setSelectedIdsInternal([...selectedIds, ...difference].sort());
            }
        } else {
            const id = ids;
            if (!isIdExists(id)) {
                setSelectedIdsInternal([]);
            } else if (config.multiple) {
                if (selectedIds.indexOf(id) !== -1) {
                    if (!skipToggle) {
                        setSelectedIdsInternal(selectedIds.filter(itemValue => itemValue !== id).sort());
                    }
                } else {
                    setSelectedIdsInternal([...selectedIds, id].sort());
                }
            } else {
                if (selectedIds.length !== 1 || selectedIds[0] !== id) {
                    setSelectedIdsInternal([id]);
                } else if (selectedIds.length === 1 && selectedIds[0] === id) {
                    setSelectedIdsInternal([]);
                }

                if (config.hasCloseOnSelect) {
                    setIsFocused(false);
                    setIsOpened(false);
                }
            }
        }
    }, [config.hasCloseOnSelect, config.multiple, selectedIds]);

    const setSelectedAll = useCallback(() => {
        const itemsIds = flattenedItems.map(item => item.id);
        setSelectedIds(itemsIds);
    }, [flattenedItems, setSelectedIds]);

    // Update selected items on change selectedIds or items or source items
    const prevSelectedIdsLength = usePrevious(selectedIds.length);
    useUpdateEffect(() => {
        const newSelectedItems = [];
        let hasChanges = false;
        selectedIds.forEach(selectedId => {
            let finedItem = flattenedItems.find(item => item[primaryKey] === selectedId);
            if (!finedItem && config.sourceItems) {
                finedItem = config.sourceItems.find(item => item[primaryKey] === selectedId);
            }
            const selectedItem = selectedItems.find(item => item[primaryKey] === selectedId);
            if (finedItem || selectedItem) {
                newSelectedItems.push(finedItem || selectedItem);
            }
            if (
                finedItem
                && (!selectedItem || selectedItem !== finedItem)
            ) {
                hasChanges = true;
            }
        });
        if (hasChanges || prevSelectedIdsLength !== selectedIds.length) {
            setSelectedItemsInternal(newSelectedItems);
        }
    }, [flattenedItems, config.sourceItems, primaryKey, selectedIds, selectedItems, prevSelectedIdsLength]);

    // Select first after fetch data
    const prevItemsLength = usePrevious(flattenedItems.length);
    useUpdateEffect(() => {
        if (config.selectFirst && prevItemsLength === 0 && flattenedItems.length > 0) {
            setSelectedIdsInternal([flattenedItems[0][primaryKey]]);
        }
    }, [flattenedItems, config.selectFirst, prevItemsLength, primaryKey]);

    // Update selected items on change value
    const prevConfigSelectedIds = usePrevious(config.selectedIds || []);
    useUpdateEffect(() => {
        const newSelectedIds = config.selectedIds || [];
        selectedItems.forEach(selectedItem => {
            if (!newSelectedIds.includes(selectedItem.id) && config.selectedIds
                && config.selectedIds.includes(selectedItem.id)) {
                newSelectedIds.push(selectedItem.id);
            }
        });
        newSelectedIds.sort();
        if (!_isEqual(prevConfigSelectedIds, newSelectedIds) && !_isEqual(selectedIds, newSelectedIds)) {
            setSelectedIdsInternal(newSelectedIds);
        }
    }, [config.selectedIds, prevConfigSelectedIds, selectedIds, selectedItems]);

    useUpdateEffect(() => {
        setIsSelectedAll(config.items.length === selectedIds.length);
    }, [config.items.length, selectedIds]);

    // Global key down handler for navigate on items
    // Support keys:
    // - tab
    // - esc
    // - enter
    // - up/down arrows
    // - space
    const onKeyDown = useCallback((e) => {
        // Skip no active
        if (!isFocused && !isOpened) {
            return;
        }

        // Keys: tab, esc
        if ([9, 27].includes(e.which)) {
            e.preventDefault();
            setIsOpened(false);
            setIsFocused(false);
        }

        // Keys: enter (select and close)
        if (e.which === 13 && isOpened) {
            e.preventDefault();

            const flattenedItemsIds = flattenedItems.map(item => item.id);

            if (hoveredId && flattenedItemsIds.includes(hoveredId)) {
                // Select hovered
                setSelectedIds(hoveredId, true);
            } else if (selectedIds.length > 0) {
                // Select first selected
                setSelectedIds(selectedIds[0], true);
            } else if (flattenedItems.length > 0) {
                // Select first result
                setSelectedIds(flattenedItems[0][primaryKey], true);
            }

            setIsOpened(false);
        }

        // Keys: space (toggle select), disable in DropDownField with focused autocomplete
        if (e.which === 32 && isOpened && !isAutoCompleteInputFocused(config.autoCompleteInputRef)) {
            if (hoveredId) {
                e.preventDefault();
                // Select hovered
                setSelectedIds(hoveredId);
            }
        }

        // Keys: arrow up, arrow down
        if ([38, 40].includes(e.which)) {
            e.preventDefault();

            const isDown = e.which === 40;
            if (!isOpened) {
                // Open on down key
                if (isDown) {
                    setIsOpened(true);
                }
            } else {
                // Navigate on items by keys
                const direction = isDown ? 1 : -1;
                const keys: any[] = flattenedItems.map(item => item.id);

                // Get current index
                let index = hoveredId ? keys.indexOf(hoveredId) : -1;
                if (index === -1 && selectedIds.length === 1) {
                    index = keys.indexOf(selectedIds[0]);
                }

                // Get next index
                const newIndex = index !== -1
                    ? Math.min(keys.length - 1, Math.max(0, index + direction))
                    : 0;

                // Set hovered
                setHoveredId(keys[newIndex]);
            }
        }
    }, [isFocused, isOpened, config.autoCompleteInputRef, hoveredId, selectedIds, flattenedItems, setSelectedIds]);
    useEvent('keydown', onKeyDown);

    return {
        isOpened,
        setIsOpened,
        isFocused,
        setIsFocused,
        hoveredId,
        setHoveredId,
        selectedIds,
        setSelectedIds,
        selectedItems,
        setSelectedAll,
        isSelectedAll,
    };
}
