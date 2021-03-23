import * as React from 'react';
import {mount} from 'enzyme';
import useApplication from '../hooks/useApplication';
import {HtmlComponent} from '../components';

function AppMock(props: any) {
    const {config, Component, ...childProps} = props;
    const {renderApplication} = useApplication({
        ...config,
        components: {
            ...config?.components,
            html: {
                className: HtmlComponent,
                ...config?.components?.html,
            },
            store: {
                reducers: require('../reducers/index').default,
                ...config?.components?.store,
            },
        },
        onInit: ({ui}) => {
            //components.ui.addViews(require('@steroidsjs/bootstrap').default);
            //ui.addFields(require('@steroidsjs/core/ui/form').default);
            //ui.addFormatters(require('@steroidsjs/core/ui/format').default);
            //ui.addIcons(require('@steroidsjs/bootstrap/icon/fontawesome').default);
        },
    });

    return renderApplication(
        <Component {...childProps} />,
    );
}

export default (Component: any, props: any = {}) => mount(<AppMock {...props} Component={Component} />);
