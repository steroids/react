import * as React from 'react';

import {ComponentsContext} from './application';
import Hoc from '../base/Hoc';
import multi from './multi';

export interface IComponents {
    clientStorage?: any,
    html?: any,
    http?: any,
    locale?: any,
    store?: any,
    ui?: any,
    resource?: any,
    ws?: any,
    pushNotification?: any,
}

/**
 * Components HOC
 * Прокидывает в пропсы компоненты приложения. Ключ соответствует названию компонента, объявленного при инициализации
 * приложения (см. `Application.tsx`)
 */
export interface IComponentsHocInput {
}

export interface IComponentsHocOutput extends IComponents {
    components?: IComponents,
}

interface IComponentHocPrivateProps {
    components?: IComponents,
}

const exportComponents = (components, names) => {
    const props = {};
    names.forEach(items => {
        [].concat(items).forEach(name => {
            props[name] = window['SteroidsComponents'][name];
        });
    });
    return props;
}

export default (...names): any => WrappedComponent => {
    if (typeof window !== 'undefined' && window['SteroidsComponents']) {
        return multi()(
            class ComponentsGlobalHoc extends Hoc<IComponentsHocInput & IComponentHocPrivateProps> {

                static WrappedComponent = WrappedComponent;

                getProps() {
                    return {
                        ...this.props,
                        ...exportComponents(window['SteroidsComponents'], names),
                        components: window['SteroidsComponents'],
                    };
                }
            }
        )
    } else {
        return multi()(
            class ComponentsContextHoc extends React.PureComponent<IComponentsHocInput & IComponentHocPrivateProps> {

                static WrappedComponent = WrappedComponent;

                render() {
                    return (
                        <ComponentsContext.Consumer>
                            {({components}) => (
                                <WrappedComponent
                                    {...this.props}
                                    {...exportComponents(components, names)}
                                    components={components}
                                />
                            )}
                        </ComponentsContext.Consumer>
                    );
                }
            }
        )
    }

}

