import * as React from 'react';
import _isFunction from 'lodash-es/isFunction';

/**
 * Props HOC
 * Добавляет на выход переданные первым аргументом пропсы. Может использоваться, например, при необходимости передачи
 * пропсов для ниже стоящих декораторов.
 */
export interface IPropsHocInput {

}

export interface IPropsHoOutput {

}

export default (customProps): any => WrappedComponent =>
    class PropsHoc extends React.PureComponent<IPropsHocInput> {
        static WrappedComponent = WrappedComponent;

        render() {
            const props = _isFunction(customProps)
                ? customProps(this.props)
                : customProps;
            return <WrappedComponent {...this.props} {...props} />;
        }
    }
