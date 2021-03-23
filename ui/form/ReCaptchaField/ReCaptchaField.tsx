import * as React from 'react';
import {components, field} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';

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

@field({
    componentId: 'form.ReCaptchaField'
})
@components('resource', 'ui')
export default class ReCaptchaField extends React.PureComponent<IReCaptchaFieldProps & IReCaptchaFieldPrivateProps> {
    render() {
        const {input, ...props} = this.props;
        const ReCaptchaFieldView =
            this.props.view || this.props.ui.getView('form.ReCaptchaFieldView');
        return (
            <ReCaptchaFieldView
                {...props}
                reCaptchaProps={{
                    sitekey: this.props.resource.googleCaptchaSiteKey,
                    action: this.props.action,
                    verifyCallback: value => input.onChange(value)
                }}
            />
        );
    }
}
