import * as React from 'react';

export default class Hoc<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {

    static WrappedComponent;

    _getProps() {
        return this.props;
    }

    render() {
        const WrappedComponent: any = this.constructor['WrappedComponent'];
        return (
            <WrappedComponent {...this._getProps()}/>
        );
    }
}
