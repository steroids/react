import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useClickAway} from 'react-use';
import useComponents from '../../../hooks/useComponents';
import fieldWrapper, {IFieldWrapperOutputProps} from '../../../ui/form/Field/fieldWrapper';
import {useDataProvider, useDataSelect} from '../../../hooks';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import {IBaseFieldProps} from '../InputField/InputField';
import {FieldEnum} from '../../../enums';

export interface IAutoCompleteItem {
    id: number | string | boolean,
    label?: string,
    additional?: {
        icon: string,
        text: string,
    },
    category?: string,
    [key: string]: unknown,
}

/**
 * AutoCompleteField
 *
 * Поле ввода текста с подсказками (auto-complete). Он позволяет пользователю вводить текст и предлагает
 * варианты автозаполнения на основе предоставленных данных.
 *
 * Компонент `AutoCompleteField` принимает следующие свойства:
 *
 * - `searchOnFocus`: при фокусировке на поле ввода будет запускаться поиск (тип: boolean)
 * - все остальные свойства являются наследниками интерфейсов `IBaseFieldProps`, `IDataProviderConfig` и `IDataSelectConfig`
 *
 * Примечание: Компонент `AutoCompleteField` требует указания списка элементов (`items`) и предоставления
 * конфигурации для провайдера данных (`dataProvider`) и выборки данных (`autoComplete` и `autoFetch`).
 */
export interface IAutoCompleteFieldProps extends IBaseFieldProps, IDataProviderConfig,
    Omit<IDataSelectConfig, 'items'> {
    /**
     * При фокусировке на поле ввода будет запускаться поиск
     * @example true
     */
    searchOnFocus?: boolean,

    /**
     * Текст при отсутствии элементов
     * @example 'Ничего не найдено'
     */
    empty?: string,
}

export interface IAutoCompleteFieldViewProps extends Omit<IAutoCompleteFieldProps, 'items'> {
    items: IAutoCompleteItem[],
    categories: string[],
    hoveredId: PrimaryKey | any,
    selectedIds: (PrimaryKey | any)[],
    forwardedRef: any,
    inputProps: {
        type: string,
        name: string,
        placeholder?: string,
        value: string | number,
        disabled: boolean,
        onChange: (value: string) => void,
        onBlur: (e: Event | React.FocusEvent) => void,
        className?: CssClassName,
    },
    isOpened: boolean,
    isLoading?: boolean,
    onItemSelect: (id: PrimaryKey | any) => void,
    onItemHover: (id: PrimaryKey | any) => void,
    onClear: () => void,
}

const getCategories = (items) => {
    if (!items) {
        return [];
    }
    return items.reduce((allCategories, item) => {
        if (item.category && !allCategories.includes(item.category)) {
            allCategories.push(item.category);
        }

        return allCategories;
    }, []);
};

function AutoCompleteField(props: IAutoCompleteFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    // Query state
    const [query, setQuery] = useState('');

    // Data provider
    const {
        items,
        isLoading,
        sourceItems,
    } = useDataProvider({
        items: props.items,
        dataProvider: props.dataProvider,
        autoComplete: props.autoComplete,
        autoFetch: props.autoFetch,
        initialSelectedIds: props.selectedIds,
        query,
    });

    // Data select
    const {
        isOpened,
        setIsOpened,
        setIsFocused,
        hoveredId,
        setHoveredId,
        selectedIds,
        setSelectedIds,
    } = useDataSelect({
        selectedIds: props.selectedIds,
        primaryKey: props.primaryKey,
        items,
        inputValue: props.input.value,
        sourceItems,
    });

    const onOpen = useCallback(() => {
        setQuery('');
        setIsFocused(true);
        setIsOpened(true);
        setHoveredId(null);
    }, [setHoveredId, setIsFocused, setIsOpened]);

    const onItemSelect = useCallback((id) => {
        setSelectedIds(id);
    }, [setSelectedIds]);

    const onItemHover = useCallback((id) => {
        setHoveredId(id);
    }, [setHoveredId]);

    const onClose = useCallback(() => {
        setIsFocused(false);
        setIsOpened(false);
    }, [setIsFocused, setIsOpened]);

    const onClear = useCallback(() => {
        setSelectedIds([]);
    }, [setSelectedIds]);

    // Outside click -> close
    const forwardedRef = useRef(null);
    useClickAway(forwardedRef, onClose);

    const onChange = useCallback((value) => {
        setQuery(value);
        props.input.onChange.call(null, value);
    }, [props.input.onChange]);

    const onBlur = useCallback((e) => {
        setTimeout(() => {
            if (props.isOpened) {
                onClose();
            }
        }, 200);
        if (props.inputProps && props.inputProps.onBlur) {
            props.inputProps.onBlur(e);
        }
    }, [onClose, props.inputProps, props.isOpened]);

    const inputProps = useMemo(() => ({
        ...props.inputProps,
        type: 'text',
        name: props.input.name,
        value: props.input.value ?? '',
        placeholder: props.placeholder,
        disabled: props.disabled,
        onChange,
        onBlur,
    }), [onBlur, onChange, props.disabled, props.input.name, props.input.value, props.inputProps, props.placeholder]);

    //Sync with form
    useEffect(() => {
        props.input.onChange.call(null, selectedIds[0] || null);
    }, [props.input.onChange, selectedIds]);

    const viewProps = useMemo(() => ({
        inputProps,
        items,
        isLoading,
        hoveredId,
        selectedIds,
        onOpen,
        isOpened,
        onClose,
        onClear,
        forwardedRef,
        onItemHover,
        onItemSelect,
        primaryKey: props.primaryKey,
        size: props.size,
        placeholder: props.placeholder,
        disabled: props.disabled,
        required: props.required,
        categories: getCategories(props.items),
        className: props.className,
        style: props.style,
        showClear: props.showClear,
        empty: props.empty,
    }), [inputProps, items, isLoading, hoveredId, selectedIds, onOpen, isOpened, onClose, onClear, onItemHover, onItemSelect,
        props.primaryKey, props.size, props.placeholder, props.disabled, props.required, props.items, props.className,
        props.style, props.showClear, props.empty]);

    return components.ui.renderView(props.view || 'form.AutoCompleteFieldView', viewProps);
}

AutoCompleteField.defaultProps = {
    primaryKey: 'label',
    autoComplete: true,
    multiple: false,
    disabled: false,
    required: false,
    showClear: false,
};

export default fieldWrapper<IAutoCompleteFieldProps>(FieldEnum.AUTO_COMPLETE_FIELD, AutoCompleteField);
