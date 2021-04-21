import * as React from 'react';
import { useMemo } from 'react';
import { useComponents } from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

export interface IReCaptchaFieldProps extends IFieldWrapperInputProps {
    action?: any;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;
    [key: string]: any;
}

export interface IReCaptchaFieldViewProps extends IReCaptchaFieldProps, IFieldWrapperOutputProps {
    reCaptchaProps: any,
}

function ReCaptchaField(props: IReCaptchaFieldProps & IFieldWrapperOutputProps) {
    const components = useComponents();

    const googleCaptchaSiteKey = components.resource?.googleCaptchaSiteKey;
    const reCaptchaProps = useMemo(() => ({
        sitekey: googleCaptchaSiteKey,
        action: props.action,
        verifyCallback: value => props.input.onChange(value),
    }), [googleCaptchaSiteKey, props.action, props.input]);

    return components.ui.renderView(props.view || 'form.ReCaptchaFieldView', {
        ...props,
        reCaptchaProps,
    });
}

export default fieldWrapper('ReCaptchaField', ReCaptchaField);
