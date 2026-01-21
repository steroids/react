import CheckboxListField, {ICheckboxListFieldProps} from '../CheckboxListField/CheckboxListField';

export default function SwitcherListField(props: ICheckboxListFieldProps) {
    return (
        <CheckboxListField
            view='form.SwitcherListFieldView'
            {...props}
        />
    );
}
