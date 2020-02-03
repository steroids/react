import * as React from 'react';
import fieldHoc from '../fieldHoc';
import {components} from '../../../hoc';
import {IComponentsContext} from '../../../hoc/components';

interface IReCaptchaFieldProps extends IComponentsContext{
    metaItem?: any;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    props?: any;
    getView?: any;
    ui?: any;
    view?: any;
}

@fieldHoc({
    componentId: 'form.ReCaptchaField'
})
@components('resource', 'ui')
export default class ReCaptchaField extends React.PureComponent<IReCaptchaFieldProps,
    {}> {
    render() {
        const {input, ...props} = this.props;
        const ReCaptchaFieldView =
            this.props.view || this.props.ui.getView('form.ReCaptchaFieldView');
        return (
            <ReCaptchaFieldView
                {...props}
                reCaptchaProps={{
                    sitekey: this.props.resource.googleCaptchaSiteKey,
                    onChange: value => input.onChange(value)
                }}
            />
        );
    }
}
