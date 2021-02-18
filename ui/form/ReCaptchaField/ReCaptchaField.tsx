import * as React from 'react';
import { useMemo } from 'react';
import {IFieldHocInput} from '../../../hoc/field';
import { useComponents } from '../../../hooks';
import {fieldWrapper, IFieldWrapperProps} from '../../../hooks/form';

export interface IReCaptchaFieldProps extends IFieldHocInput {
    action?: any;
    view?: CustomView;
    [key: string]: any;
}

export interface IReCaptchaFieldViewProps extends IReCaptchaFieldProps, IFieldWrapperProps {
    reCaptchaProps: any,
}

function ReCaptchaField(props: IReCaptchaFieldProps & IFieldWrapperProps) {
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

export default fieldWrapper('ReCaptchaField')(ReCaptchaField);
