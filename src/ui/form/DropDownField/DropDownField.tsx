import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useClickAway, usePrevious, useUpdateEffect} from 'react-use';
import _isEqual from 'lodash-es/isEqual';
import Icon from '../../../ui/content/Icon/Icon';
import {useComponents, useDataProvider, useDataSelect} from '../../../hooks';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';

const GROUP_CONTENT_TYPE = 'group';
const CHECKBOX_CONTENT_TYPE = 'checkbox';
const RADIO_CONTENT_TYPE = 'radio';
const ICON_CONTENT_TYPE = 'icon';
const IMG_CONTENT_TYPE = 'img';

export type ContentType = 'checkbox' | 'radio' | 'icon' | 'img';
export type ItemSwitchType = ContentType | 'group' | string;

export interface IDropDownFieldItem {
    id: number,
    label: string,
    contentType?: ContentType,
    contentSrc?: 'string' | React.ReactElement,
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
        type: ContentType,
        src?: 'string' | React.ReactElement;
    };

    /**
     * Элементы вложенные внутрь DropDownField
     * @example [{id: 1, label: 'Ivan Ivanov', type: 'icon', typeSrc: 'user'}]
     */
    items: IDropDownFieldItem[],

    /**
     * Нужно ли использовать троеточие при переполнении DropDownField
     * @example {'true'}
     */
    showEllipses?: boolean,

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
    onItemSelect: (id: PrimaryKey | any) => void,
    onItemHover: (id: PrimaryKey | any) => void,
    onItemRemove: (id: PrimaryKey | any) => void,
    onClose: () => void,
    onOpen: () => void,
    renderItem: (item: IDropDownFieldItem, key: number, itemProps: any, itemBem: any) => JSX.Element;
    isAutoComplete?: boolean,
    isSearchAutoFocus?: boolean,
    primaryKey: string,
}

export interface IDropDownItemViewProps extends Pick<IDropDownFieldProps, 'itemsContent'>, Pick<IFieldWrapperInputProps, 'size'> {
    item: {
        id: number,
        label: string,
        contentType?: ContentType,
        contentSrc?: 'string' | React.ReactElement,
    },
    primaryKey: PrimaryKey,
    hoveredId: string,
    selectedIds: (PrimaryKey | any)[];
    onItemSelect: (id: PrimaryKey | any) => void,
    onItemHover: (id: PrimaryKey | any) => void,
    groupAttribute?: string;
}

function DropDownField(props: IDropDownFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    // Query state
    const [query, setQuery] = useState('');

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
    } = useDataSelect({
        multiple: props.multiple,
        selectFirst: props.selectFirst,
        selectedIds: inputSelectedIds,
        primaryKey: props.primaryKey,
        groupAttribute: props.groupAttribute,
        items,
        sourceItems,
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

    const CheckboxFieldView = components.ui.getView('form.CheckboxFieldView');
    const RadioFieldView = components.ui.getView('form.RadioListFieldView');
    const AccordionItemView = components.ui.getView('content.AccordionItemView');

    const switchItem = (
        item: IDropDownFieldItem,
        type: ItemSwitchType,
        src: string | React.ReactElement,
        options: {
            itemProps: any,
            itemKey: number,
            bem: any,
        },
    ) => {
        switch (type) {
            case ICON_CONTENT_TYPE:
                return (
                    <div
                        {...options.itemProps}
                        key={options.itemKey}
                    >
                        {typeof src === 'string' ? (
                            <Icon
                                name={src}
                                className={options.bem.element('icon')}
                            />
                        ) : (
                            <span className={options.bem.element('icon')}>
                                {src}
                            </span>
                        )}
                        <span>
                            {item.label}
                        </span>
                    </div>
                );

            case CHECKBOX_CONTENT_TYPE:
                return (
                    <div
                        {...options.itemProps}
                        key={options.itemKey}
                    >
                        <CheckboxFieldView
                            label={item.label}
                            className={options.bem.element('checkbox')}
                            size={props.size}
                            inputProps={{
                                checked: selectedIds.includes(item[props.primaryKey]),
                                onChange: () => { },
                                type: 'checkbox',
                            }}
                        />
                    </div>
                );

            // case RADIO_CONTENT_TYPE:
            //     return (
            //         <div
            //             {...options.itemProps}
            //             key={options.itemKey}
            //         >
            //             <RadioFieldView
            //                 items={[item]}
            //                 selectedIds={selectedIds}
            //                 className={options.bem.element('radio', {
            //                     size: props.size,
            //                 })}
            //                 size={props.size}
            //                 onItemSelect={onItemSelect}
            //                 inputProps={{
            //                     onChange
            //                 }}
            //             />
            //         </div>
            //     );

            case IMG_CONTENT_TYPE:
                return (
                    <div
                        {...options.itemProps}
                        key={options.itemKey}
                    >
                        <span className={options.bem.element('img')}>
                            <img
                                src={src as string}
                                alt="custom source for item"
                            />
                        </span>
                        <span>
                            {item.label}
                        </span>
                    </div>
                );

            default:
                return (
                    <div
                        {...options.itemProps}
                        key={options.itemKey}
                    >
                        {item.label}
                    </div>
                );
        }
    };

    const renderItem = (item: IDropDownFieldItem, key: number, itemProps: any, bem: any) => {
        if (props.groupAttribute && Array.isArray(item[props.groupAttribute])) {
            return switchItem(item, 'group', item[props.groupAttribute], {
                itemProps,
                itemKey: key,
                bem,
            });
        }

        if (item.contentType) {
            return switchItem(item, item.contentType, item.contentSrc, {
                itemProps,
                itemKey: key,
                bem,
            });
        }

        if (props.itemsContent) {
            return switchItem(item, props.itemsContent.type, props.itemsContent.src, {
                itemProps,
                itemKey: key,
                bem,
            });
        }

        return switchItem(item, 'default', null, {
            itemProps,
            itemKey: key,
            bem,
        });
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
        onItemHover,
        onItemSelect,
        onItemRemove,
        onReset,
        onClose,
        renderItem,
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
