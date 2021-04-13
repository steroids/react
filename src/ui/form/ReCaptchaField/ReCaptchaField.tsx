import * as React from 'react';
import { useMemo } from 'react';
import { useComponents } from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

export interface IReCaptchaFieldProps extends IFieldWrapperInputProps {
    action?: any;
    view?: CustomView;
    [key: string]: any;
}

export interface IReCaptchaFieldViewProps extends IReCaptchaFieldProps, IFieldWrapperOutputProps {
    reCaptchaProps: any,
}

function ReCaptchaField(props: IReCaptchaFieldProps & IFieldWrapperOutputProps) {
    const components = useComponents();

    const reCaptchaProps = useMemo(() => ({
        sitekey: components.resource?.googleCaptchaSiteKey,
        action: props.action,
        verifyCallback: value => props.input.onChange(value),
    }), [components.resource.googleCaptchaSiteKey, props.action, props.input]);

    return components.ui.renderView(props.view || 'form.ReCaptchaFieldView', {
        ...props,
        reCaptchaProps,
    });
}

export default fieldWrapper('ReCaptchaField', ReCaptchaField);
