import * as React from 'react';

import {ComponentsContext} from './application';

interface IComponents {
    clientStorage?: any,
    html?: any,
    http?: any,
    locale?: any,
    store?: any,
    ui?: any,
    resource?: any,
}

export interface IComponentsHocInput {
}

export interface IComponentsHocOutput extends IComponents {
    components?: IComponents,
}

interface IComponentHocPrivateProps {
    components?: IComponents,
}

export default (...names): any => WrappedComponent =>
    class ComponentHoc extends React.PureComponent<IComponentsHocInput & IComponentHocPrivateProps> {

        static WrappedComponent = WrappedComponent;

        render() {
            if (this.props.components) {
                return this.renderInternal(this.props.components);
            } else {
                return (
                    <ComponentsContext.Consumer>
                        {({components}) => this.renderInternal(components)}
                    </ComponentsContext.Consumer>
                );
            }
        }

        renderInternal(components) {
            const props = {};
            names.forEach(items => {
                [].concat(items).forEach(name => {
                    props[name] = components[name];
                });
            });
            return (
                <WrappedComponent
                    {...this.props}
                    {...props}
                    components={components}
                />
            );
        }
    }
