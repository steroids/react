import React, {MutableRefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {usePrevious, useUpdateEffect} from 'react-use';
import _isEqual from 'lodash-es/isEqual';
import _isEmpty from 'lodash-es/isEmpty';
import _includes from 'lodash-es/includes';
import _isPlainObject from 'lodash-es/isPlainObject';
import _merge from 'lodash-es/merge';
import {IAccordionItemViewProps} from '../../../ui/content/Accordion/Accordion';
import {useComponents, useDataProvider as useSteroidsDataProvider, useDataSelect} from '../../../hooks';
import {DataProviderItems, IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';
import {IDropDownProps} from '../../content/DropDown/DropDown';

export const GROUP_CONTENT_TYPE = 'group';
export const CHECKBOX_CONTENT_TYPE = 'checkbox';
export const RADIO_CONTENT_TYPE = 'radio';
export const ICON_CONTENT_TYPE = 'icon';
export const IMG_CONTENT_TYPE = 'img';

export type ContentType = 'checkbox' | 'radio' | 'icon' | 'img';
export type ItemSwitchType = ContentType | 'group' | string;

export interface IDropDownFieldItem {
    /**
    * Идентификатор элемента
    */
    id: number | string | boolean,

    /**
    * Отображаемое название
    */
    label: string,

    /**
    * Тип контента для элемента
    * @example 'img'
    */
    contentType?: ContentType | string,

    /**
    * Источник контента
    * @example 'https://steroids.kozhindev.com/images/icon.png'
    */
    contentSrc?: string | React.ReactElement,
}

export interface IDropDownFieldItemViewProps extends IAccordionItemViewProps,
    Pick<IDropDownFieldProps, 'itemsContent'> {
    item: IDropDownFieldItem,
    size: Size,
    type: ItemSwitchType,
    selectedIds: (PrimaryKey | any)[],
    groupAttribute: 'string',
    primaryKey: PrimaryKey,
    hoveredId: string,
    onItemSelect: (id: PrimaryKey | any) => void,
    onItemHover: (id: PrimaryKey | any) => void,
    isItemToSelectAll: boolean,
    isSelectedAll: boolean,

    [key: string]: any,
}

/**
 * DropDownField
 *
 * Выпадающий список для выбора одного или нескольких значений.
 *
 * Компонент `DropDownField` предоставляет возможность создания выпадающего списка для выбора одного или нескольких значений.
 * Он поддерживает различные типы контента для элементов списка, такие как флажки, радиокнопки, иконки и изображения.
 *
**/
export interface IDropDownFieldProps extends IFieldWrapperInputProps,
    Omit<IDataProviderConfig, 'items' | 'initialSelectedIds'>,
    Omit<IDataSelectConfig, 'items'>,
    IUiComponent {

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    searchPlaceholder?: string,

    /**
     * Цвет состояния
     * @example success
     */
    color?: ColorName,

    /**
    * Включает стиль `outline`, когда у DropDownField остается только `border`, а задний фон становится прозрачным
    * @example true
    */
    outline?: boolean,

    /**
     * Параметры для элемента input
     */
    inputProps?: any,

    /**
     * Показать иконку сброса для выбранных значений
     * @example true
     */
    showReset?: boolean,

    /**
     * Атрибут, в котором должны лежать дочерние элементы списка (для группировки)
     * Если аттрибут не задан - группировка не производится
     * @example items
     */
    groupAttribute?: string,

    /**
     * Свойство, которое устанавливает один type и src контента для всех пунктов
     * @example
     * {
     *  type: 'icon',
     *  src: 'user'
     * }
     */
    itemsContent?: {
        type: ContentType | string,
        src?: string | React.ReactElement,
    },

    /**
     * Элементы вложенные внутрь DropDownField
     * @example
     * [
     *  {
     *   id: 1,
     *   label: 'Ivan Ivanov',
     *   type: 'icon',
     *   typeSrc: 'user'
     *  }
     * ]
     */
    items?: IDropDownFieldItem[] | DataProviderItems,

    /**
     * Нужно ли использовать троеточие при переполнении DropDownField
     * @example true
     */
    showEllipses?: boolean,

    /**
    * Добавляет кнопку при нажатии на которую выбираются все элементы, работает только при multiple: true
    * @example
     * {
     *  label: 'All',
     *  id: 'all'
     * }
    */
    itemToSelectAll?: boolean | {
        label: string,
        id: string,
    },

    /**
     * Кастомная вьюшка для элемента
     */
    itemView?: CustomView,

    /**
     * Свойства для компонента отображения
     * @example
     * {
     *  customHandler: () => {...}
     * }
     */
    viewProps?: {
        [key: string]: any,
    },

    /**
     * Свойства, которые напрямую передаются в DropDown компонент
     */
    dropDownProps?: IDropDownProps,

    /**
     * Callback-функция, которая вызывается при выборе элемента DropDown
     */
    onItemSelect?: (selectedId: string | number) => void,

    /**
     * Callback-функция, которая вызывается при очистке выбранных элементов DropDown
     */
    onReset?: () => void,

    /**
     * Callback-функция, которая вызывается при закрытии DropDown
     */
    onClose?: (selectedIds: PrimaryKey[]) => void,

    /**
     * Нужно ли подгружать данные после закрытия DropDown
     * @example true
     */
    isFetchOnClose?: boolean,

    /**
     * Число в пикселях, больше которого не может быть выпадающее меню
     */
    maxHeight?: number,

    [key: string]: any,
}

export interface IDropDownFieldViewProps extends IDropDownFieldProps {
    errors?: string[],
    selectedItems: Record<string, unknown>[],
    hoveredId: PrimaryKey | any,
    selectedIds: (PrimaryKey | any)[],
    autoCompleteInputForwardedRef: MutableRefObject<HTMLInputElement>,
    inputRef: MutableRefObject<HTMLInputElement>,
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
    onOpen: () => void,
    onClose: () => void,
    renderItem: (item: IDropDownFieldItem) => JSX.Element,
    onItemRemove: (id: PrimaryKey | any) => void,
    isAutoComplete?: boolean,
    isSearchAutoFocus?: boolean,
    primaryKey: string,
    items: IDropDownFieldItem[],
    itemToSelectAll: null | {
        label: string,
        id: string,
    },
}

const normalizeItemToSelectAll = (
    itemToSelectAll: boolean | {label: string, id: string,},
) => {
    if (!itemToSelectAll) {
        return null;
    }

    if (typeof itemToSelectAll !== 'boolean' && _isPlainObject(itemToSelectAll)) {
        return itemToSelectAll;
    }

    return {
        id: 'all',
        label: __('Все'),
    };
};

const DEFAULT_DROP_DOWN_PROPS = {
    position: 'bottom',
    autoPositioning: true,
};

function DropDownField(props: IDropDownFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    // Query state
    const [query, setQuery] = useState('');
    const autoCompleteInputForwardedRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const hasGroup = !!props.groupAttribute;
    const [selectedAccordionItems, setSelectedAccordionItems] = React.useState<number[]>([]);

    const normalizedItemToSelectAll = React.useMemo(
        () => normalizeItemToSelectAll(props.itemToSelectAll),
        [props.itemToSelectAll],
    );

    const toggleCollapse = indexSelected => {
        if (selectedAccordionItems.includes(indexSelected)) {
            const newState = [...selectedAccordionItems];
            const indexInArray = selectedAccordionItems.indexOf(indexSelected);
            newState.splice(indexInArray, 1);
            setSelectedAccordionItems(newState);
        } else {
            const newState = [...selectedAccordionItems];
            newState.push(indexSelected);
            setSelectedAccordionItems(newState);
        }
    };

    const inputSelectedIds = useMemo(
        () => _isEmpty(props.selectedIds) ? [].concat(props.input.value || []) : props.selectedIds,
        [props.input.value, props.selectedIds],
    );

    // Data provider
    const useDataProvider = useMemo(() => props.useDataProvider || useSteroidsDataProvider, [props.useDataProvider]);
    const {
        fetchRemote,
        items,
        isLoading,
        isAutoComplete,
        sourceItems,
        ...dataProvider
    } = useDataProvider({
        items: props.items,
        dataProvider: props.dataProvider,
        autoComplete: props.autoComplete,
        autoFetch: props.autoFetch,
        query,
        initialSelectedIds: inputSelectedIds,
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
        selectedItems,
        setSelectedAll,
        isSelectedAll,
    } = useDataSelect({
        multiple: props.multiple,
        selectFirst: props.selectFirst,
        selectedIds: inputSelectedIds,
        primaryKey: props.primaryKey,
        groupAttribute: props.groupAttribute,
        items,
        sourceItems,
        inputValue: props.input.value,
        autoCompleteInputRef: autoCompleteInputForwardedRef,
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
        if (id === normalizedItemToSelectAll?.id) {
            setSelectedAll();
            return;
        }

        setSelectedIds(id);

        if (props.onItemSelect) {
            props.onItemSelect(id);
        }
    }, [normalizedItemToSelectAll?.id, props, setSelectedAll, setSelectedIds]);

    const onItemRemove = useCallback((id) => {
        setSelectedIds(selectedIds.filter(i => i !== id));
    }, [selectedIds, setSelectedIds]);

    const onReset = useCallback(() => {
        setSelectedIds([]);

        if (props.onReset) {
            props.onReset();
        }
    }, [props.onReset, setSelectedIds]);

    const onClose = useCallback(() => {
        if (isOpened) {
            if (props.isFetchOnClose && fetchRemote) {
                fetchRemote(false);
            }

            if (props.onClose) {
                props.onClose(selectedIds);
            }
        }

        setIsFocused(false);
        setIsOpened(false);
    }, [fetchRemote, isOpened, props, selectedIds, setIsFocused, setIsOpened]);

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
        if (!_isEqual(prevSelectedIds || [], selectedIds)) {
            const newValues = props.multiple ? selectedIds : (selectedIds[0] || null);
            props.input.onChange.call(null, newValues);
            if (props.onChange) {
                props.onChange.call(null, newValues);
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

    // Add required validation
    useEffect(() => {
        const defaultValidity = __('Required Field');

        const errorMessage = props.required && !selectedIds.length ? defaultValidity : '';

        inputRef.current?.setCustomValidity(errorMessage);
    }, [props.required, selectedIds.length]);

    const renderItemView = (
        item: IDropDownFieldItem,
        type: ItemSwitchType,
        src: string | React.ReactElement,
    ) => components.ui.renderView(props.itemView || 'form.DropDownFieldItemView', {
        item: {
            ...item,
            contentSrc: src,
            contentType: type,
        },
        selectedIds,
        size: props.size,
        groupAttribute: props.groupAttribute,
        hoveredId,
        primaryKey: props.primaryKey,
        type,
        itemsContent: props.itemsContent,
        onItemHover,
        onItemSelect,
        isShowMore: _includes(selectedAccordionItems || [], item.id),
        childIndex: item.id,
        toggleCollapse,
        isItemToSelectAll: item.id === normalizedItemToSelectAll?.id,
        isSelectedAll,
    });

    const renderItem = useCallback((item: IDropDownFieldItem) => {
        if (hasGroup && Array.isArray(item[props.groupAttribute])) {
            return renderItemView(item, 'group', item[props.groupAttribute]);
        }

        if (item.contentType) {
            return renderItemView(item, item.contentType, item.contentSrc);
        }

        if (props.itemsContent) {
            return renderItemView(item, props.itemsContent.type, props.itemsContent.src);
        }

        return renderItemView(item, 'default', null);
    }, [hasGroup, props.groupAttribute, props.itemsContent, renderItemView]);

    const dropDownProps = useMemo(() => _merge(DEFAULT_DROP_DOWN_PROPS, props.dropDownProps), [props.dropDownProps]);

    const viewProps = useMemo(() => ({
        isAutoComplete,
        items,
        hoveredId,
        selectedIds,
        inputRef,
        autoCompleteInputForwardedRef,
        searchInputProps,
        isOpened,
        isLoading,
        onOpen,
        selectedItems,
        // TODO onFocus
        // TODO onBlur
        onReset,
        onClose,
        renderItem,
        onItemRemove,
        hasGroup,
        multiple: props.multiple,
        isSearchAutoFocus: props.isSearchAutoFocus,
        itemToSelectAll: normalizedItemToSelectAll,
        className: props.className,
        viewProps: props.viewProps,
        dropDownProps,
        style: props.style,
        size: props.size,
        color: props.color,
        outline: props.outline,
        placeholder: props.placeholder,
        showReset: props.showReset,
        showEllipses: props.showEllipses,
        errors: props.errors,
        disabled: props.disabled,
        maxHeight: props.maxHeight,
        ...dataProvider,
    }), [isAutoComplete, items, hoveredId, selectedIds, searchInputProps,
        isOpened, isLoading, onOpen, selectedItems, onReset, onClose, renderItem, dropDownProps,
        onItemRemove, hasGroup, props.multiple, props.isSearchAutoFocus, props.className,
        props.style, props.size, props.color, props.outline, props.placeholder, props.showReset,
        props.showEllipses, props.errors, props.disabled, normalizedItemToSelectAll, props.viewProps, dataProvider, props.maxHeight]);

    return components.ui.renderView(props.view || 'form.DropDownFieldView', viewProps);
}

DropDownField.defaultProps = {
    primaryKey: 'id',
    outline: false,
    color: 'basic',
    disabled: false,
    required: false,
    className: '',
    autoComplete: false,
    showReset: false,
    multiple: false,
    isSearchAutoFocus: true,
    itemToSelectAll: false,
    isFetchOnClose: false,
};

export default fieldWrapper<IDropDownFieldProps>('DropDownField', DropDownField);
