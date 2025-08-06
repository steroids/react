import CheckboxField, {ICheckboxFieldProps} from '../CheckboxField/CheckboxField';

/**
 * RadioField
 *
 * Компонент RadioField представляет собой элемент выбора типа "radio". Он позволяет пользователю выбрать один вариант из нескольких предложенных.
 **/
export default function RadioField(props: ICheckboxFieldProps): JSX.Element {
    return (
        <CheckboxField
            multiply={false}
            view="form.RadioFieldView"
            {...props}
        />
    );
}
