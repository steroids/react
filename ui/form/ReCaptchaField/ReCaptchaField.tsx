import * as React from 'react';
import { useMemo } from 'react';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import useField, { defineField } from '../../../hooks/field';
import { useComponents } from '../../../hooks';

export interface IReCaptchaFieldProps extends IFieldHocInput {
    action?: any;
    view?: CustomView;
    [key: string]: any;
}

export interface IReCaptchaFieldViewProps extends IFieldHocOutput {
    reCaptchaProps: any,
}

interface IReCaptchaFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {

}

function ReCaptchaField(props: IReCaptchaFieldProps & IReCaptchaFieldPrivateProps) {
    props = useField('ReCaptchaField', props);

    const components = useComponents();

    props = useMemo(() => ({
        ...props.input,
        reCaptchaProps: {
            sitekey: components.resource?.googleCaptchaSiteKey,
            action: props.action,
            verifyCallback: value => props.input.onChange(value),
        },
    }), [props.disabled, props.input, props.inputProps, props.placeholder, props.type, props.action]);

    return components.ui.renderView(props.view || 'form.ReCaptchaFieldView', props);
}

export default defineField('ReCaptchaField')(ReCaptchaField);
