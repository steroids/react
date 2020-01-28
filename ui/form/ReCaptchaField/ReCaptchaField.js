import React from 'react';
import PropTypes from 'prop-types';

import fieldHoc from '../fieldHoc';
import {components} from '../../../hoc';

@fieldHoc({
    componentId: 'form.ReCaptchaField',
})
@components('resource', 'ui')
export default class ReCaptchaField extends React.PureComponent {

    static propTypes = {
        metaItem: PropTypes.object,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
    };

    render() {
        const {input, ...props} = this.props;
        const ReCaptchaFieldView = this.props.view || this.props.ui.getView('form.ReCaptchaFieldView');
        return (
            <ReCaptchaFieldView
                {...props}
                reCaptchaProps={{
                    sitekey: this.props.resource.googleCaptchaSiteKey,
                    onChange: value => input.onChange(value),
                }}
            />
        );
    }

}
