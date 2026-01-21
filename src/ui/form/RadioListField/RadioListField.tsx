import CheckboxListField, {ICheckboxListFieldProps} from '../CheckboxListField/CheckboxListField';

/**
 * RadioListField
 * Список с радиокнопками. Используется в формах для выбора одного значения.
 */

export default function RadioListField(props: ICheckboxListFieldProps): JSX.Element {
    return (
        <CheckboxListField
            multiple={false}
            view='form.RadioListFieldView'
            {...props}
        />
    );
}
