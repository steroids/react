import * as React from 'react';

export default (): any => WrappedComponent => {
    if (!process.env.APP_MULTI_HOC) {
        return WrappedComponent;
    }
    if (WrappedComponent.IS_MULTI_HOC) {
        return WrappedComponent;
    }

    const names = [];
    let ItemComponent = WrappedComponent;
    while (true) {
        if (!ItemComponent?.prototype?._getProps) {
            break;
        }
        names.push(ItemComponent.displayName || ItemComponent.name);
        ItemComponent = ItemComponent.WrappedComponent
    }

    const MultiHoc = class MultiHoc extends React.Component {

        static IS_MULTI_HOC = true;
        static WrappedComponent = WrappedComponent;
        static displayName = 'Hoc_' + names.map(n => n.replace(/Hoc$/, '')).join('_') + '_' + (ItemComponent.displayName || ItemComponent.name);

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
                if (ItemComponent?.prototype?._getProps) {
                    const instance = new ItemComponent(this._props);
                    instance.forceUpdate = this.forceUpdate.bind(this);
                    this._props = instance._getProps();
                    this._instances.push(instance);
                } else if (!ItemComponent.IS_MULTI_HOC) {
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
                this._props = instance._getProps();
            });
        }

    }

    const methods = [
        'UNSAFE_componentWillReceiveProps',
        'componentDidMount',
        'componentDidUpdate',
        'componentWillUnmount',
        'UNSAFE_componentWillMount',
        //'shouldComponentUpdate',
    ];
    methods.forEach(method => {
        MultiHoc.prototype[method] = function() {
            const args = arguments;
            const results = [];
            this._instances.forEach(instance => {
                this._updateProps(this.props);

                if (instance[method]) {
                    instance.props = this._props;
                    results.push(instance[method].apply(instance, args));
                }
            });

            if (method === 'shouldComponentUpdate') {
                return results.filter(result => !result).length === 0;
            }
        };
    });

    return MultiHoc;
}