import * as React from 'react';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

interface IGeetestFieldProps {
    metaItem?: any;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    geetestParams: {
        gt: string,
        challenge: string,
        success: number
    };
    onChange?: any;
    then?: any;
    loadGeetest?: any;
    resource?: any;
}

@fieldHoc({
    componentId: 'form.GeetestField'
})
@components('resource')
export default class GeetestField extends React.PureComponent<IGeetestFieldProps,
    {}> {
    componentDidMount() {
        this.props.resource.loadGeetest().then(initGeetest => {
            initGeetest(
                {
                    gt: this.props.geetestParams.gt,
                    challenge: this.props.geetestParams.challenge,
                    https: /https/.test(location.protocol),
                    product: 'bind',
                    lang: 'en',
                    sandbox: false,
                    offline: !this.props.geetestParams.success
                },
                geetest => {
                    geetest.onSuccess(() =>
                        this.props.input.onChange(geetest.getValidate())
                    );
                    setTimeout(() => geetest.verify());
                }
            );
        });
    }

    render() {
        return <div/>;
    }
}
