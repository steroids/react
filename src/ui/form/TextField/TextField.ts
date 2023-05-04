import {ChangeEvent, KeyboardEventHandler, useCallback, useMemo} from 'react';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {IBaseFieldProps} from '../InputField/InputField';

/**
 * TextField
 * Поле для ввода нескольких строк теста
 */
export interface ITextFieldProps extends IBaseFieldProps {
    /**
     * Отправлять форму при нажатии на кнопку `enter`
     * @example true
     */
    submitOnEnter?: boolean;
}

export interface ITextFieldViewProps extends ITextFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        name: string,
        onChange: (value: string | ChangeEvent) => void,
        onKeyUp: KeyboardEventHandler<HTMLTextAreaElement>,
        value: string | number,
        placeholder: string,
        disabled: boolean,
    },
    onClear: VoidFunction,
}

function TextField(props: ITextFieldProps & IFieldWrapperOutputProps): JSX.Element {
    // const dispatch = useDispatch();
    const components = useComponents();

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

    const onChange = useCallback(
        e => props.input.onChange.call(null, e.target ? e.target.value : e.nativeEvent.text),
        [props.input.onChange],
    );

    const onClear = useCallback(() => props.input.onChange(''), [props.input]);

    const inputProps = useMemo(() => ({
        name: props.input.name,
        value: props.input.value || '',
        onChange,
        onKeyUp,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
    }), [onKeyUp, onChange, props.disabled, props.input.name, props.input.value, props.inputProps, props.placeholder]);

    return components.ui.renderView(props.view || 'form.TextFieldView', {
        ...props,
        inputProps,
        onClear,
    });
}

TextField.defaultProps = {
    disabled: false,
    required: false,
    submitOnEnter: false,
};

export default fieldWrapper<ITextFieldProps>('TextField', TextField);
