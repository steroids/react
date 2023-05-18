import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useClickAway, usePrevious, useUpdateEffect} from 'react-use';
import _isEqual from 'lodash-es/isEqual';
import _includes from 'lodash-es/includes';
import {IAccordionCommonViewProps} from 'src/ui/content/Accordion/Accordion';
import {useComponents, useDataProvider, useDataSelect} from '../../../hooks';
import {DataProviderItems, IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';

export const GROUP_CONTENT_TYPE = 'group';
export const CHECKBOX_CONTENT_TYPE = 'checkbox';
export const RADIO_CONTENT_TYPE = 'radio';
export const ICON_CONTENT_TYPE = 'icon';
export const IMG_CONTENT_TYPE = 'img';

export type ContentType = 'checkbox' | 'radio' | 'icon' | 'img';
export type ItemSwitchType = ContentType | 'group' | string;

export interface IDropDownFieldItem {
    id: number | string | boolean,
    label: string,
    contentType?: ContentType | string,
    contentSrc?: string | React.ReactElement,
}

export interface IDropDownFieldItemViewProps extends IAccordionCommonViewProps,
    Pick<IDropDownFieldProps, 'itemsContent'>, Pick<IDropDownFieldProps, 'itemToSelectAll'> {
    item: IDropDownFieldItem,
    size: Size,
    type: ItemSwitchType,
    selectedIds: (PrimaryKey | any)[]
    groupAttribute: 'string',
    primaryKey: PrimaryKey,
    hoveredId: string,
    onItemSelect: (id: PrimaryKey | any) => void,
    onItemHover: (id: PrimaryKey | any) => void,
    setSelectedAll: VoidFunction,

    [key: string]: any,
}

/**
 * DropDownField
 * Выпадающий список для выбора одного или нескольких значений
 */
export interface IDropDownFieldProps extends IFieldWrapperInputProps,
    Omit<IDataProviderConfig, 'items'>,
    Omit<IDataSelectConfig, 'items'> {

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    searchPlaceholder?: string;

    /**
     * Цвет состояния
     * @example success
     */
    color?: ColorName;

    /**
    * Включает стиль `outline`, когда у DropDownField остается только `border`, а задний фон становится прозрачным
    * @example true
    */
    outline?: boolean;

    inputProps?: any;

    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: CustomStyle,

    /**
     * Показать иконку сброса для выбранных значений
     * @example true
     */
    showReset?: boolean,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

    /**
     * Атрибут, в котором должны лежать дочерние элементы списка (для группировки)
     * Если аттрибут не задан - группировка не производится
     * @example items
     */
    groupAttribute?: string,

    /**
     * Свойство, которое устанавливает один type и src контента для всех пунктов
     * @example {type: 'icon', src: 'user'}
     */
    itemsContent?: {
        type: ContentType | string,
        src?: string | React.ReactElement;
    };

    /**
     * Элементы вложенные внутрь DropDownField
     * @example [{id: 1, label: 'Ivan Ivanov', type: 'icon', typeSrc: 'user'}]
     */
    items?: IDropDownFieldItem[] | DataProviderItems,

    /**
     * Нужно ли использовать троеточие при переполнении DropDownField
     * @example {'true'}
     */
    showEllipses?: boolean,

    /**
    * Добавляет кнопку при нажатии на которую выбираются все элементы, работает только при multiple: true
    * @example {label: 'All', id: 'all'}
    */
    itemToSelectAll?: {
        label: string,
        id: string,
    },

    [key: string]: any;
}

export interface IDropDownFieldViewProps extends IDropDownFieldProps {
    errors?: string[],
    selectedItems: Record<string, unknown>[],
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
    onOpen: () => void,
    renderItem: (item: IDropDownFieldItem, hasSelectAll?: boolean) => JSX.Element;
    onItemRemove: (id: PrimaryKey | any) => void,
    isAutoComplete?: boolean,
    isSearchAutoFocus?: boolean,
    primaryKey: string,
    items: IDropDownFieldItem[],
}

function DropDownField(props: IDropDownFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    // Query state
    const [query, setQuery] = useState('');

    const hasGroup = !!props.groupAttribute;
    const [selectedAccordionItems, setSelectedAccordionItems] = React.useState<number[]>([]);

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
        () => props.selectedIds || [].concat(props.input.value || []),
        [props.input.value, props.selectedIds],
    );

    // Data provider
    const {items, isLoading, isAutoComplete, sourceItems} = useDataProvider({
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
    } = useDataSelect({
        multiple: props.multiple,
        selectFirst: props.selectFirst,
        selectedIds: inputSelectedIds,
        primaryKey: props.primaryKey,
        groupAttribute: props.groupAttribute,
        items,
        sourceItems,
        inputValue: props.input.value,
        customItemSelectAllId: props.itemToSelectAll?.id,
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
    if (process.env.PLATFORM !== 'mobile') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useClickAway(forwardedRef, onClose);
    }

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

    const renderItemView = (
        item: IDropDownFieldItem,
        type: ItemSwitchType,
        src: string | React.ReactElement,
    ) => components.ui.renderView('form.DropDownFieldItemView', {
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
        setSelectedAll,
        itemToSelectAll: props.itemToSelectAll,
    });

    const renderItem = (item: IDropDownFieldItem) => {
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
    };

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
        selectedItems,
        // TODO onFocus
        // TODO onBlur
        onReset,
        onClose,
        renderItem,
        onItemRemove,
        hasGroup,
    });
}

DropDownField.defaultProps = {
    primaryKey: 'id',
    outline: false,
    size: 'md',
    color: 'basic',
    disabled: false,
    required: false,
    className: '',
    autoComplete: false,
    showReset: false,
    multiple: false,
    isSearchAutoFocus: true,
};

export default fieldWrapper<IDropDownFieldProps>('DropDownField', DropDownField);
