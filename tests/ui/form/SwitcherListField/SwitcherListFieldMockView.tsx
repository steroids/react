import {useBem, useUniqueId} from '../../../../src/hooks';
import {ICheckboxListFieldViewProps} from '../../../../src/ui/form/CheckboxListField/CheckboxListField';
import SwitcherFieldMockView from '../SwitcherField/SwitcherFieldMockView';

export default function SwitcherListFieldMockView(props: ICheckboxListFieldViewProps) {
    const bem = useBem('SwitcherListFieldView');
    const prefix = useUniqueId('switcher');

    return (
        <div
            className={bem(
                bem.block(),
                props.className,
            )}
        >
            {props.items.map((checkbox, checkboxIndex) => props.renderItem({
                key: checkboxIndex,
                id: `${prefix}_${checkbox.id}`,
                label: checkbox.label,
                inputProps: {
                    name: `${prefix}_${checkbox.id}`,
                    type: 'checkbox',
                    checked: props.selectedIds.includes(checkbox.id),
                    onChange: () => {
                        props.onItemSelect(checkbox.id);
                    },
                    disabled: props.disabled || checkbox.disabled,
                },
                size: checkbox.size || props.size,
                color: checkbox.color,
                required: checkbox.required,
                view: SwitcherFieldMockView,
            }))}

        </div>
    );
}
