import {ChangeEvent, KeyboardEventHandler, useCallback, useMemo} from 'react';
import {useComponents, useSaveCursorPosition} from '../../../hooks';
import fieldWrapper, {IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {IBaseFieldProps} from '../InputField/InputField';
import {FieldEnum} from '../../../enums';

/**
 * TextField
 * Поле для ввода нескольких строк текста
 */
export interface ITextFieldProps extends IBaseFieldProps {
    /**
     * Отправлять форму при нажатии на кнопку `enter`
     * @example true
     */
    submitOnEnter?: boolean,
}

export interface ITextFieldViewProps extends ITextFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        name: string,
        onChange: (value: string | ChangeEvent) => void,
        onKeyUp: KeyboardEventHandler,
        value: string | number,
        placeholder: string,
        disabled: boolean,
        required: boolean,
    },
    onClear: VoidFunction,
}

function TextField(props: ITextFieldProps & IFieldWrapperOutputProps): JSX.Element {
    // const dispatch = useDispatch();
    const components = useComponents();

    const {inputRef, onChange} = useSaveCursorPosition({
        inputParams: props.input,
    });

    const onKeyUp = useCallback(e => {
        if (
            props.submitOnEnter
            && props.formId
            && e.keyCode === 13
            && !e.shiftKey
        ) {
            e.preventDefault();
            // TODO This is not worked in redux... =(
            // dispatch(submit(props.formId));
        }
    }, [props.formId, props.submitOnEnter]);

    const handleChange = useCallback(
        event => onChange(event, event.target ? event.target.value : event.nativeEvent.text),
        [onChange],
    );

    const onClear = useCallback(() => props.input.onChange(''), [props.input]);

    const inputProps = useMemo(() => ({
        name: props.input.name,
        value: props.input.value ?? '',
        onChange: handleChange,
        onKeyUp,
        placeholder: props.placeholder,
        disabled: props.disabled,
        required: props.required,
        ref: inputRef,
        ...props.inputProps,
    }), [props.input.name, props.input.value, props.placeholder, props.disabled, props.required, props.inputProps, handleChange, onKeyUp, inputRef]);

    const viewProps = useMemo(() => ({
        ...props.viewProps,
        inputProps,
        onClear,
        errors: props.errors,
        size: props.size,
        className: props.className,
        showClear: props.showClear,
    }), [inputProps, onClear, props.className, props.errors, props.showClear, props.size, props.viewProps]);

    return components.ui.renderView(props.view || 'form.TextFieldView', viewProps);
}

TextField.defaultProps = {
    disabled: false,
    required: false,
    submitOnEnter: false,
};

export default fieldWrapper<ITextFieldProps>(FieldEnum.TEXT_FIELD, TextField);
