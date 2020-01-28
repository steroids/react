import React from 'react';
import PropTypes from 'prop-types';

import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

@fieldHoc({
    componentId: 'form.GeetestField',
})
@components('resource')
export default class GeetestField extends React.PureComponent {

    static propTypes = {
        metaItem: PropTypes.object,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        geetestParams: PropTypes.shape({
            gt: PropTypes.string.isRequired,
            challenge: PropTypes.string.isRequired,
            success: PropTypes.number.isRequired,
        }).isRequired,
    };

    componentDidMount() {
        this.props.resource.loadGeetest()
            .then(initGeetest => {
                initGeetest({
                    gt: this.props.geetestParams.gt,
                    challenge: this.props.geetestParams.challenge,
                    https: /https/.test(location.protocol),
                    product: 'bind',
                    lang: 'en',
                    sandbox: false,
                    offline: !this.props.geetestParams.success,
                }, geetest => {
                    geetest.onSuccess(() => this.props.input.onChange(geetest.getValidate()));
                    setTimeout(() => geetest.verify());
                });
            });
    }

    render() {
        return (
            <div />
        );
    }

}
