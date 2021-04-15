import * as React from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useClickAway} from 'react-use';
import useComponents from '../../../hooks/useComponents';
import fieldWrapper, {IFieldWrapperOutputProps} from '../../../ui/form/Field/fieldWrapper';
import {useDataProvider, useDataSelect} from '../../../hooks';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import {IDataSelectConfig} from '../../../hooks/useDataSelect';
import {IInputFieldProps} from '../InputField/InputField';

/**
 * AutoComplete
 * Поле ввода текста с подсказками (auto-complete)
 */
export interface IAutoCompleteFieldProps extends IInputFieldProps, IDataProviderConfig,
    Omit<IDataSelectConfig, 'items'> {
    /**
     * При фокусировке на поле ввода будет запускаться поиск
     * @example true
     */
    searchOnFocus?: boolean,

    [key: string]: any,
}

export interface IAutoCompleteFieldViewProps extends Omit<IAutoCompleteFieldProps, 'items'> {
    items: Record<string, unknown>[],
    hoveredId: PrimaryKey | any,
    selectedIds: (PrimaryKey | any)[],
    forwardedRef: any,
    inputProps: {
        type: string,
        name: string,
        placeholder?: string;
        value: string | number,
        disabled: boolean,
        onChange: (value: string) => void,
        onFocus: (e: Event | React.FocusEvent) => void,
        onBlur: (e: Event | React.FocusEvent) => void,
        className?: CssClassName
    },
    isOpened: boolean,
    isLoading?: boolean,
    onItemSelect: (id: PrimaryKey | any) => void,
    onItemHover: (id: PrimaryKey | any) => void,
}

function AutoCompleteField(props: IAutoCompleteFieldProps & IFieldWrapperOutputProps) {
    const components = useComponents();

    // Query state
    const [query, setQuery] = useState('');

    // Data provider
    const {
        items,
        isLoading
    } = useDataProvider({
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

    // Outside click -> close
    const forwardedRef = useRef(null);
    useClickAway(forwardedRef, onClose);

    const onChange = useCallback((value) => {
        setQuery(value);
        props.input.onChange.call(null, value);
    }, [props.input.onChange]);

    // TODO
    const onFocus = (e) => {
        props.onOpen();
        if (props.searchOnFocus) {
            props.onSearch(props.input.value);
        }
        if (props.inputProps && props.inputProps.onFocus) {
            props.inputProps.onFocus(e);
        }
    };

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
        value: props.input.value || '',
        placeholder: props.placeholder,
        disabled: props.disabled,
        onChange,
        onBlur,
    }), [onBlur, onChange, props.disabled, props.input.name, props.input.value, props.inputProps, props.placeholder]);

    //Sync with form
    useEffect(() => {
        props.input.onChange.call(null, selectedIds[0] || null);
    }, [props.input.onChange, selectedIds]);

    return components.ui.renderView(props.view || 'form.AutoCompleteFieldView', {
        ...props,
        inputProps,
        items,
        isLoading,
        hoveredId,
        selectedIds,
        onOpen,
        isOpened,
        onClose,
        forwardedRef,
        onItemHover,
        onItemSelect,
    });
}

AutoCompleteField.defaultProps = {
    primaryKey: 'label',
    autoComplete: true,
    multiple: false,
    disabled: false,
    required: false,
    className: '',
};

export default fieldWrapper('AutoCompleteField', AutoCompleteField);
