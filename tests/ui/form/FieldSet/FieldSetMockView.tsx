import {IFieldSetViewProps} from '../../../../src/ui/form/FieldSet/FieldSet';
import {useBem} from '../../../../src/hooks';

export default function FieldSetView(props: IFieldSetViewProps) {
    const bem = useBem('FieldSetView');
    return (
        <fieldset className={bem(bem.block(), props.className)}>
            <legend className={bem.element('legend')}>{props.label}</legend>
            {props.children}
        </fieldset>
    );
}
