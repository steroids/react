import _isEqual from 'lodash-es/isEqual';
import _isArray from 'lodash-es/isArray';
import _remove from 'lodash-es/remove';
import _includes from 'lodash-es/includes';
import _isNil from 'lodash-es/isNil';

import {useCallback, useEffect, useMemo, useState} from 'react';
import {useEvent, usePrevious, useUpdateEffect} from 'react-use';

export interface IDataSelectConfig {
    /**
     * Возможность множественного выбора
     * @example true
     */
    multiple?: boolean;

    /**
     * Список с элементами
     * @example [{id: 1, label: 'Krasnoyarsk'}, {id: 2, label: 'Moscow'}]
     */
    items: {
        id: number | string | boolean,
        label?: string,
        [key: string]: unknown,
    }[],

    /**
     * Сделать активным первый элемент в списке
     * @example true
     */
    selectFirst?: any;

    /**
     * Список с идентификаторами выбранных элементов
     * @example [1, 4]
     */
    selectedIds: any,

    /**
     * Первичный ключ для item
     * @example id
     */
    primaryKey?: string,

    /**
     * Значение поля в форме
     */
    inputValue: any
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
}

const defaultProps = {
    primaryKey: 'id',
};

export default function useDataSelect(config: IDataSelectConfig): IDataSelectResult {
    // Get primary key
    const primaryKey = config.primaryKey || defaultProps.primaryKey;

    // Initial select
    const initialSelectedIds = useMemo(() => {
        if (config.selectedIds) {
            return [].concat(config.selectedIds || []);
        }

        if (!_isNil(config.inputValue)) {
            return [].concat(_isArray(config.inputValue) ? config.inputValue : [config.inputValue]);
        }

        return config.selectFirst && config.items.length > 0
            ? [config.items[0][primaryKey]]
            : [];
    }, [config.items, config.selectFirst, config.selectedIds, primaryKey, config.inputValue]);

    // State
    const [isOpened, setIsOpened] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedIds, setSelectedIdsInternal] = useState(initialSelectedIds);

    // Handler for select/toggle item by id
    const setSelectedIds = useCallback((ids, skipToggle = false) => {
        if (_isArray(ids)) {
            if (!config.multiple && ids.length > 1) {
                ids = [ids[0]];
            }
            setSelectedIdsInternal(ids);
        } else {
            const id = ids;
            if (!id) {
                setSelectedIdsInternal([]);
            } else if (config.multiple) {
                if (selectedIds.indexOf(id) !== -1) {
                    if (!skipToggle) {
                        setSelectedIdsInternal(selectedIds.filter(itemValue => itemValue !== id));
                    }
                } else {
                    setSelectedIdsInternal([...selectedIds, id]);
                }
            } else {
                if (selectedIds.length !== 1 || selectedIds[0] !== id) {
                    setSelectedIdsInternal([id]);
                }
                setIsOpened(false);
            }
        }
    }, [config.multiple, selectedIds]);

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
        // console.log(config.selectedIds, prevConfigSelectedIds);
        const newSelectedIds = config.selectedIds && config.selectedIds.length > 0
            ? config.items.map(item => item[primaryKey]).filter(id => config.selectedIds.includes(id))
            : [];
        if (!_isEqual(prevConfigSelectedIds, newSelectedIds)) {
            setSelectedIdsInternal(newSelectedIds);
        }
    }, [config.items, config.selectedIds, primaryKey, prevConfigSelectedIds]);

    // Global key down handler for navigate on items
    // Support keys:
    // - tab
    // - esc
    // - enter
    // - up/down arrows
    const onKeyDown = useCallback((e) => {
        // Skip no active
        if (!isFocused && !isOpened) {
            return;
        }

        // Keys: tab, esc
        if ([9, 27].includes(e.which)) {
            e.preventDefault();
            setIsOpened(false);
            return;
        }

        // Keys: enter
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
                const keys = config.items.map(item => item.id);

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
    }, [config.items, hoveredId, isFocused, isOpened, setSelectedIds, selectedIds]);
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
    };
}
