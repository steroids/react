import React from 'react';
import useApplication, {IApplicationHookConfig} from '../../src/hooks/useApplication';
import LocaleComponent from '../../src/components/LocaleComponent';
import HttpComponent from '../../src/components/HttpComponent';

export interface IMockApplicationConfig extends IApplicationHookConfig {
    store?: any;
}

interface IMockApplicationProps {
    children: React.ReactNode,
    config?: IMockApplicationConfig,
}

export default function MockApplication(props: IMockApplicationProps) {
    const {renderApplication} = useApplication({
        ...props.config,
        layoutView: () => require('./mockLayout').default,
        components: {
            locale: LocaleComponent,
            http: {
                className: HttpComponent,
            },
            store: {
                reducers: require('../mocks/reducersMock').default,
                ...props.config?.store,
            },
            metrics: {
                className: jest.fn(),
            },
        },
        onInit: ({ui}) => {
            ui.addViews(require('../ui/index').default);
            ui.addFields(require('../ui/fields').default);
            ui.addIcons(require('../ui/content/Icon/mockIcon').default);
        },
    });

    return renderApplication(props.children);
}
