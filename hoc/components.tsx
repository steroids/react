import * as React from 'react';

export interface IComponentsContext {
    components?: object,
    clientStorage?: any,
    html?: any,
    http?: any,
    locale?: any,
    store?: any,
    ui?: any,
    resource?: any,
}

interface IComponentHocProps {
    components?: any,
}

export const ComponentsContext = React.createContext({} as IComponentsContext);

export default (...names): any => WrappedComponent =>
    class ComponentHoc extends React.PureComponent<IComponentHocProps> {

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
