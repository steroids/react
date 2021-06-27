import * as React from 'react';
import useApplication, {IApplicationHookConfig} from '../hooks/useApplication';

/**
 * Application HOC
 * Обертка над корневым компонентом приложения, используется только в `Application.tsx`. Добавляет через React Context
 * компоненты приложения и конфигурирует их.
 */
export default (config: IApplicationHookConfig): any => WrappedComponent => function ApplicationHoc(props) {
    const {renderApplication} = useApplication(config);
    return renderApplication(
        <WrappedComponent {...props} />,
    );
};
