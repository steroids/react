import * as React from 'react';

export default class Hoc<P = {}, S = {}, SS = any> extends React.PureComponent<P, S, SS> {

    static WrappedComponent;

    getProps() {
        return this.props;
    }

    render() {
        const WrappedComponent: any = this.constructor['WrappedComponent'];
        return (
            <WrappedComponent {...this.getProps()}/>
        );
    }
}
