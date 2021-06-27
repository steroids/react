import * as React from 'react';

import {useComponents} from '../hooks';
import {IComponents} from '../hooks/useComponents';

export interface IComponentsHocOutput extends IComponents {
    components?: IComponents,
}

const exportComponents = (components, names) => {
    const props = {};
    names.forEach(items => {
        [].concat(items).forEach(name => {
            props[name] = window.SteroidsComponents[name];
        });
    });
    return props;
};

/**
 * Components HOC
 * Прокидывает в пропсы компоненты приложения. Ключ соответствует названию компонента, объявленного при инициализации
 * приложения (см. `Application.tsx`)
 */
export default (...names): any => WrappedComponent => function ComponentsHoc(props) {
    const components = useComponents();
    return (
        <WrappedComponent
            {...props}
            {...exportComponents(components, names)}
            components={components}
        />
    );
};
