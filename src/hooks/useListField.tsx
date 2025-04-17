import React, {useCallback, useEffect, useMemo} from 'react';
import {useComponents, useDataProvider, useDataSelect} from '@steroidsjs/core/hooks';
import _isEqual from 'lodash-es/isEqual';
import {DataProviderItems, IDataProvider} from '@steroidsjs/core/hooks/useDataProvider';
import {usePrevious, useUpdateEffect} from 'react-use';
import {IInputParams} from '../ui/form/Field/fieldWrapper';

interface IUseListFieldProps {
    defaultItemView: string,
    selectedIds: (PrimaryKey | any)[],
    inputType: string,
    input?: IInputParams,
    items?: DataProviderItems,
    dataProvider?: IDataProvider,
    multiple?: boolean,
    selectFirst?: boolean,
    primaryKey?: string,
    inputProps?: any,
    disabled?: boolean,
    onChange?: (...args: any[]) => any,
    itemView?: CustomView,
    itemViewProps?: CustomViewProps,
}

export default function useListField(props: IUseListFieldProps) {
    const components = useComponents();

    const inputSelectedIds = useMemo(
        () => props.selectedIds || [].concat(props.input.value || []),
        [props.input.value, props.selectedIds],
    );

    // Data provider
    const {items} = useDataProvider({
        items: props.items,
        initialSelectedIds: inputSelectedIds,
        dataProvider: props.dataProvider,
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
        type: props.inputType,
        name: props.input.name,
        disabled: props.disabled,
        onChange: (value) => props.input.onChange(value),
    }), [props.disabled, props.input, props.inputProps, props.inputType]);

    // Sync with form
    const prevSelectedIds = usePrevious(selectedIds);
    useEffect(() => {
        if (!_isEqual(prevSelectedIds || [], selectedIds)) {
            const valueToSave = props.multiple ? selectedIds : selectedIds[0];

            props.input.onChange.call(null, valueToSave);
            if (props.onChange) {
                props.onChange.call(null, valueToSave);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.input.onChange, selectedIds]);

    const onReset = useCallback(() => {
        setSelectedIds([]);
    }, [setSelectedIds]);

    // Reset selected ids on form reset
    const prevInputValue = usePrevious(props.input.value);
    useUpdateEffect(() => {
        // if form reset
        if (prevInputValue && props.input.value === undefined && selectedIds.length > 0) {
            onReset();
        }
    }, [onReset, prevInputValue, props.input.value, selectedIds.length]);

    const renderItem = useCallback(
        (itemProps) => {
            const defaultItemView = props.defaultItemView;
            const ItemFieldView = itemProps.view || props.itemView || components.ui.getView(defaultItemView);

            return (
                <ItemFieldView
                    {...itemProps}
                    {...props.itemViewProps}
                    type={props.inputType}
                />
            );
        },
        [components.ui, props.defaultItemView, props.inputType, props.itemView, props.itemViewProps],
    );

    return {
        selectedIds,
        items,
        inputProps,
        onItemSelect,
        setSelectedIds,
        renderItem,
    };
}
