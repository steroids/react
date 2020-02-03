import * as React from 'react';
import _get from 'lodash-es/get';
import _upperFirst from 'lodash-es/upperFirst';

const defaultConfig = {
    componentId: "",
    attributes: [""]
};

interface IViewHocProps {
    item?: object,
    attribute?: string,
}

export default (config = {}): any => WrappedComponent =>
    class ViewHoc extends React.Component<IViewHocProps> {

        static WrappedComponent = WrappedComponent;

        render() {
            const _config = {
                ...defaultConfig,
                componentId:
                    'view.' + (WrappedComponent.displayName || WrappedComponent.name),
                ...config
            };
            const valueProps = {};
            _config.attributes.forEach(key => {
                valueProps[`value${_upperFirst(key)}`] = _get(
                    this.props.item,
                    this.props[`attribute${_upperFirst(key)}`]
                );
            });
            return <WrappedComponent {...valueProps} {...this.props} />;
        }

    }
