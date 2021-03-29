import {useComponents, useDataProvider, useDataSelect} from '@steroidsjs/core/hooks';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useClickAway} from 'react-use';
import {IDataProviderConfig} from '@steroidsjs/core/hooks/useDataProvider';
import {IDataSelectConfig} from '@steroidsjs/core/hooks/useDataSelect';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';

export interface IDropDownFieldProps extends IFieldWrapperInputProps,
    IDataProviderConfig,
    Omit<IDataSelectConfig, 'items'> {

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    searchPlaceholder?: string;
    inputProps?: any;
    className?: CssClassName;
    style?: any,
    view?: any;

    /**
     * Показать кнопку для сброса выбранного значения
     * @example true
     */
    showReset?: boolean;

    /**
     * Включает стиль без 'border'
     * @example true
     */
    noBorder?: boolean;

    [key: string]: any;
}

export interface IDropDownFieldViewProps extends Omit<IDropDownFieldProps, 'items'> {
    isInvalid?: boolean,
    items: Record<string, unknown>[],
    hoveredId: PrimaryKey | any,
    selectedIds: (PrimaryKey | any)[],
    forwardedRef: any,
    searchInputProps: {
        type: string,
        name: string,
        onChange: (value: string) => void,
        value: string | number,
        placeholder: string,
        disabled: boolean,
        className: CssClassName,
    },
    isOpened?: boolean,
    isLoading?: boolean,
    onReset: () => void,
    onItemSelect: (id: PrimaryKey | any) => void,
    onItemHover: (id: PrimaryKey | any) => void,
    onItemRemove: (id: PrimaryKey | any) => void,
    onClose: () => void,

    placeholder: string,
    isAutoComplete?: boolean,
    searchAutoFocus?: any,
}

function DropDownField(props: IDropDownFieldProps & IFieldWrapperOutputProps) {
    const components = useComponents();

    // Query state
    const [query, setQuery] = useState('');

    // Data provider
    const {items, isLoading, isAutoComplete} = useDataProvider({
        items: props.items,
        dataProvider: props.dataProvider,
        autoComplete: props.autoComplete,
        autoFetch: props.autoFetch,
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
        multiple: props.multiple,
        selectFirst: props.selectFirst,
        selectedIds: props.selectedIds,
        primaryKey: props.primaryKey,
        items,
    });

    const onOpen = useCallback(() => {
        setQuery('');
        setIsFocused(true);
        setIsOpened(true);
        setHoveredId(null);
    }, [setHoveredId, setIsFocused, setIsOpened]);

    const onItemHover = useCallback((id) => {
        setHoveredId(id);
    }, [setHoveredId]);

    const onItemSelect = useCallback((id) => {
        setSelectedIds(id);
    }, [setSelectedIds]);

    const onItemRemove = useCallback((id) => {
        setSelectedIds(selectedIds.filter(i => i !== id));
    }, [selectedIds, setSelectedIds]);

    const onReset = useCallback(() => {
        setSelectedIds([]);
    }, [setSelectedIds]);

    const onClose = useCallback(() => {
        setIsFocused(false);
        setIsOpened(false);
    }, [setIsFocused, setIsOpened]);

    // Outside click -> close
    const forwardedRef = useRef(null);
    useClickAway(forwardedRef, onClose);

    // Search input props
    const searchInputProps = useMemo(() => ({
        type: 'search',
        placeholder: props.searchPlaceholder || __('Начните вводить символы для поиска...'),
        onChange: value => setQuery(value),
        tabIndex: -1,
    }), [props]);

    // Sync with form
    useEffect(() => {
        props.input.onChange.call(null, props.multiple ? selectedIds : (selectedIds[0] ?? null));
    }, [selectedIds]);

    return components.ui.renderView(props.view || 'form.DropDownFieldView', {
        ...props,
        isInvalid: !!props.error,
        isAutoComplete,
        items,
        hoveredId,
        selectedIds,
        forwardedRef,
        searchInputProps,
        isOpened,
        isLoading,
        onOpen,
        // TODO onFocus
        // TODO onBlur
        onItemHover,
        onItemSelect,
        onItemRemove,
        onReset,
        onClose,
    });
}

DropDownField.defaultProps = {
    primaryKey: 'id',
    disabled: false,
    required: false,
    className: '',
    autoComplete: false,
    showReset: false,
    multiple: false,
};

export default fieldWrapper('DropDownField', DropDownField);
