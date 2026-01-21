import CheckboxField, {ICheckboxFieldProps} from '../CheckboxField/CheckboxField';

export default function SwitcherField(props: ICheckboxFieldProps) {
    return (
        <CheckboxField
            view='form.SwitcherFieldView'
            {...props}
        />
    );
}
