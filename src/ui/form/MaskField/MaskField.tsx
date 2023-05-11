import {useComponents} from '../../../hooks';
import fieldWrapper from '../Field/fieldWrapper';
import {IInputFieldProps} from '../InputField/InputField';

export interface IMaskFieldProps extends IInputFieldProps {
    mask?: string,
}

function MaskField(props: IMaskFieldProps): JSX.Element {
    const components = useComponents();

    return components.ui.renderView(props.view || 'form.MaskFieldView', {
        mask: props.mask,
        ...props.maskProps,
    });
}

export default fieldWrapper<IMaskFieldProps>('MaskField', MaskField);
