import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useClickAway, usePrevious} from 'react-use';
import _isEqual from 'lodash-es/isEqual';
import {useComponents, useDataProvider, useDataSelect} from '../../../hooks';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';

/**
 * DropDownField
 * Выпадающий список для выбора одного или нескольких значений
 */
export interface IDropDownFieldProps extends IFieldWrapperInputProps,
    IDataProviderConfig,
    Omit<IDataSelectConfig, 'items'> {

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    searchPlaceholder?: string;

    inputProps?: any;

    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
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
    errors?: string[],
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

function DropDownField(props: IDropDownFieldProps & IFieldWrapperOutputProps): JSX.Element {
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
        inputValue: props.input.value,
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
    const prevSelectedIds = usePrevious(selectedIds);
    useEffect(() => {
        if (!_isEqual(prevSelectedIds, selectedIds)) {
            props.input.onChange.call(null, props.multiple ? selectedIds : (selectedIds[0] ?? null));
        }
    }, [selectedIds, props.input.onChange, props.multiple, prevSelectedIds, props.attribute]);

    return components.ui.renderView(props.view || 'form.DropDownFieldView', {
        ...props,
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
