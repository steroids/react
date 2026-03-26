import {useMaskito} from '@maskito/react';
import {useComponents, useDataProvider, useDataSelect, useSaveCursorPosition} from '@steroidsjs/core/hooks';
import {IDropDownFieldItem} from '@steroidsjs/core/ui/form/DropDownField/DropDownField';
import fieldWrapper, {
    IFieldWrapperInputProps, IFieldWrapperOutputProps,
} from '@steroidsjs/core/ui/form/Field/fieldWrapper';
import {IBaseFieldProps, IInputFieldProps} from '@steroidsjs/core/ui/form/InputField/InputField';
import {useCallback, useEffect, useMemo, useState} from 'react';

export interface ICountryPhoneMask extends IDropDownFieldItem{
    phoneCode: string,
    phoneMask?: (string | RegExp)[],
}

/**
 * PhoneField
 *
 * Компонент для ввода и форматирования телефонных номеров с поддержкой масок стран.
 * Автоматически форматирует введенный номер в соответствии с выбранной маской.
 *
 */
interface IPhoneFieldProps extends IFieldWrapperInputProps, IFieldWrapperOutputProps, IBaseFieldProps {
    /**
     * Список доступных масок для телефонных номеров разных стран.
     * Каждая маска определяет формат отображения номера.
     */
    phoneMasks: ICountryPhoneMask[],
    /**
     * Выбранная страна по умолчанию
     */
    initialCountryCode: string,
}

export interface IPhoneFieldDropdownProps {
    onOpen: () => void,
    onClose: () => void,
    isOpened: boolean,
    items: any[],
    onItemSelect: (id) => void,
    selectedIds: any[],
    selectedItems: any[],
    primaryKey: string,
}

export interface IPhoneFieldViewProps extends IPhoneFieldProps, IFieldWrapperOutputProps {
    dropDownProps: IPhoneFieldDropdownProps,
}

function PhoneField(props: IPhoneFieldProps): JSX.Element {
    const components = useComponents();

    const [selectedCountryCode, setSelectedCountryCode] = useState<string>(props.initialCountryCode.toUpperCase());

    // Data provider
    const {items, sourceItems} = useDataProvider({
        items: props.phoneMasks,
        initialSelectedIds: [],
    });

    // Data select
    const {
        isOpened,
        setIsOpened,
        setIsFocused,
        setHoveredId,
        selectedIds,
        setSelectedIds,
        selectedItems,
    } = useDataSelect({
        items,
        sourceItems,
        inputValue: props.input.value,
        selectedIds: [selectedCountryCode],
    });

    const phoneMask = useMemo(
        () => ((items ?? [])).find(
            (countryPhoneMask) => countryPhoneMask.id === (selectedIds[0] ?? props.defaultCountryCode),
        )?.phoneMask as ICountryPhoneMask['phoneMask'],
        [items, selectedIds, props.defaultCountryCode],
    );

    const maskedInputRef = useMaskito({
        options: {
            mask: phoneMask,
        },
    });

    const {
        inputRef,
        onChange,
        value,
    } = useSaveCursorPosition({
        inputParams: props.input,
    });

    useEffect(() => {
        if (inputRef.current) {
            maskedInputRef(inputRef.current);
        }
    }, [inputRef, maskedInputRef]);

    const onOpen = useCallback(() => {
        setIsFocused(true);
        setIsOpened(true);
        setHoveredId(null);
    }, [setHoveredId, setIsFocused, setIsOpened]);

    const onItemSelect = useCallback((id) => {
        // If country changed
        if (selectedCountryCode !== id) {
            setSelectedIds(id);
            onChange(null, '');
            setSelectedCountryCode(id);
        }
        setIsOpened(false);
    }, [setSelectedIds, setIsOpened, onChange, selectedCountryCode]);

    const onClose = useCallback(() => {
        setIsFocused(false);
        setIsOpened(false);
    }, [setIsFocused, setIsOpened]);

    const onClear = useCallback(() => {
        if (props.onClear) {
            props.onClear('');
        }

        props.input.onChange('');
    }, [props]);

    const inputProps = useMemo(() => ({
        name: props.input.name,
        onInput: onChange,
        value,
        placeholder: props.placeholder,
        disabled: props.disabled,
        type: 'tel',
        ...props.inputProps,
    }), [props.disabled, props.input, props.inputProps, props.placeholder, onChange, value]);

    const viewProps = useMemo(() => ({
        inputRef,
        inputProps,
        size: props.size,
        errors: props.errors,
        leadIcon: props.leadIcon,
        showClear: props.showClear,
        onClear,
        input: props.input,
        className: props.className,
        style: props.style,
        onMouseDown: props.onMouseDown,
        placeholder: props.placeholder,
        required: props.required,
        id: props.id,
        viewProps: props.viewProps,
        disabled: props.disabled,
        dropDownProps: {
            onOpen,
            onClose,
            isOpened,
            items,
            onItemSelect,
            selectedIds,
            selectedItems,
            primaryKey: 'id',
        },
    }), [inputProps, inputRef, isOpened, items, onClose,
        onClear, onItemSelect, onOpen, props.className,
        props.disabled, props.errors, props.id, props.input, props.leadIcon,
        props.onMouseDown, props.placeholder, props.required, props.showClear,
        props.size, props.style, props.viewProps, selectedIds, selectedItems]);

    // No render for hidden input
    if (props.type === 'hidden') {
        return null;
    }

    return components.ui.renderView(props.view || 'form.PhoneFieldView', viewProps);
}

PhoneField.defaultProps = {
    disabled: false,
    required: false,
};

export default fieldWrapper<IInputFieldProps>('PhoneField', PhoneField);
