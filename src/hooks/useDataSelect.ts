import _isEqual from 'lodash-es/isEqual';
import _isArray from 'lodash-es/isArray';
import _isNil from 'lodash-es/isNil';

import {useCallback, useMemo, useState} from 'react';
import {useEvent, usePrevious, useUpdateEffect} from 'react-use';

interface IDataSelectItem {
    id: number | string | boolean,
    label?: string,

    [key: string]: unknown,
}

export interface IDataSelectConfig {
    /**
     * Возможность множественного выбора
     * @example true
     */
    multiple?: boolean;

    /**
     * Список с видимыми элементами
     * @example [{id: 1, label: 'Krasnoyarsk'}, {id: 2, label: 'Moscow'}]
     */
    items?: IDataSelectItem[],

    /**
     * Сделать активным первый элемент в списке
     * @example true
     */
    selectFirst?: any;

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
    inputValue?: any

    /**
     *  Список со всеми элементами
     */
    sourceItems?: IDataSelectItem[],
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
}

const defaultProps = {
    primaryKey: 'id',
};

export default function useDataSelect(config: IDataSelectConfig): IDataSelectResult {
    // Get primary key
    const primaryKey = config.primaryKey || defaultProps.primaryKey;

    // Initial select
    const initialSelectedIds = useMemo(() => {
        if (config.selectedIds?.length > 0) {
            return [].concat(config.selectedIds || []);
        }

        if (!_isNil(config.inputValue)) {
            return [].concat(_isArray(config.inputValue) ? config.inputValue : [config.inputValue]);
        }

        return config.selectFirst && config.items.length > 0
            ? [config.items[0][primaryKey]]
            : [];
    }, [config.items, config.selectFirst, config.selectedIds, primaryKey, config.inputValue]);

    const initialSelectedItems = useMemo(
        () => config.items.length > 0
        && initialSelectedIds.length > 0
            ? initialSelectedIds
                .map(selectedId => config.items.find(item => item.id === selectedId))
                .filter(Boolean)
            : [],
        [initialSelectedIds, config.items],
    );

    // State
    const [isOpened, setIsOpened] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedIds, setSelectedIdsInternal] = useState(initialSelectedIds);
    const [selectedItems, setSelectedItemsInternal] = useState(initialSelectedItems);

    // Handler for select/toggle item by id
    const setSelectedIds = useCallback((ids, skipToggle = false) => {
        if (_isArray(ids)) {
            if (!config.multiple && ids.length > 1) {
                ids = [ids[0]];
            }

            setSelectedIdsInternal(ids.sort());
        } else {
            const id = ids;
            if (!id) {
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
                }
                setIsOpened(false);
            }
        }
    }, [config.multiple, selectedIds]);

    // Update selected items on change selectedIds or items or source items
    const prevSelectedIdsLength = usePrevious(selectedIds.length);
    useUpdateEffect(() => {
        const newSelectedItems = [];
        let hasChanges = false;
        selectedIds.forEach(selectedId => {
            let finedItem = config.items.find(item => item[primaryKey] === selectedId);
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
    }, [config.items, config.sourceItems, primaryKey, selectedIds, selectedItems, prevSelectedIdsLength]);

    // Select first after fetch data
    const prevItemsLength = usePrevious(config.items.length);
    useUpdateEffect(() => {
        if (config.selectFirst && prevItemsLength === 0 && config.items.length > 0) {
            setSelectedIdsInternal([config.items[0][primaryKey]]);
        }
    }, [config.items, config.selectFirst, prevItemsLength, primaryKey]);

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

        if (!_isEqual(prevConfigSelectedIds, newSelectedIds)
            && !_isEqual(selectedIds, newSelectedIds) && newSelectedIds.length !== 0) {
            setSelectedIdsInternal(newSelectedIds);
        }
    }, [config.items, config.selectedIds, primaryKey, prevConfigSelectedIds,
        selectedItems, config.sourceItems, selectedIds]);

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
        }

        // Keys: enter (select and close)
        if (e.which === 13 && isOpened) {
            e.preventDefault();

            if (hoveredId) {
                // Select hovered
                setSelectedIds(hoveredId, true);
            } else if (selectedIds.length > 0) {
                // Select first selected
                setSelectedIds(selectedIds[0], true);
            } else if (config.items.length > 0) {
                // Select first result
                setSelectedIds(config.items[0], true);
            }

            setIsOpened(false);
        }

        // Keys: space (toggle select)
        if (e.which === 32 && isOpened) {
            e.preventDefault();
            if (hoveredId) {
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
                const getKeysRecursive = items => {
                    let ids = [];
                    items.forEach(item => {
                        if (config.groupAttribute && Array.isArray(item[config.groupAttribute])) {
                            ids = ids.concat(getKeysRecursive(item[config.groupAttribute]));
                        } else {
                            ids.push(item.id);
                        }
                        return ids;
                    });
                    return ids;
                };
                //const keys = config.items.map(item => item.id);
                const keys = getKeysRecursive(config.items);

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
    }, [isFocused, isOpened, hoveredId, selectedIds, config.items, config.groupAttribute, setSelectedIds]);
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
    };
}
