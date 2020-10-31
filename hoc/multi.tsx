import * as React from 'react';

export default (): any => WrappedComponent => {
    if (WrappedComponent.IS_MULTI_HOC) {
        return WrappedComponent;
    }
    return WrappedComponent;

    const names = [];
    let ItemComponent = WrappedComponent;
    while (true) {
        if (ItemComponent?.prototype?.getProps) {
            names.push = ItemComponent.displayName || ItemComponent.name;
        } else {
            break;
        }
        ItemComponent = ItemComponent.WrappedComponent
    }

    const MultiHoc = class MultiHoc extends React.Component {

        static IS_MULTI_HOC = true;

        static displayName = names.join('_');

        _props: any;
        _instances: any;
        _LastComponent: any;

        constructor(props) {
            super(props);

            this._props = props;
            this._instances = [];
            this._LastComponent = null;
            let ItemComponent = WrappedComponent;
            while (true) {
                if (ItemComponent?.prototype?.getProps) {
                    const instance = new ItemComponent(this._props);
                    instance.forceUpdate = this.forceUpdate.bind(this);
                    this._props = instance.getProps();
                    this._instances.push(instance);
                } else {
                    this._LastComponent = ItemComponent;
                    break;
                }
                ItemComponent = ItemComponent.WrappedComponent
            }
        }

        render() {
            this._updateProps(this.props);

            const Component: any = this._LastComponent;
            return (
                <Component {...this._props}/>
            );
        }

        _updateProps(props) {
            this._props = props;
            this._instances.forEach(instance => {
                instance.props = this._props;
                this._props = instance.getProps();
            });
        }

    }

    const methods = [
        'UNSAFE_componentWillReceiveProps',
        'componentDidMount',
        'componentDidUpdate',
        'componentWillUnmount',
        'UNSAFE_componentWillMount',
    ];
    methods.forEach(method => {
        MultiHoc.prototype[method] = function() {
            const args = arguments;
            this._instances.forEach(instance => {
                this._updateProps(this.props);

                if (instance[method]) {
                    instance[method].apply({...instance, props: this._props}, args);
                }
            });
        };
    });

    return MultiHoc;
}