import {useComponents} from '../../../hooks';
import fieldWrapper from '../Field/fieldWrapper';

export interface IMaskFieldProps {
    view?: CustomView,
    mask?: string,
    maskProps?: {
        maskPlaceholder?: string,
        alwaysShowMask?: boolean,
    }
}

function MaskField(props: IMaskFieldProps): JSX.Element {
    const components = useComponents();

    return components.ui.renderView(props.view || 'form.MaskFieldView', {
        mask: props.mask,
        ...props.maskProps,
    });
}

export default fieldWrapper<IMaskFieldProps>('MaskField', MaskField);
