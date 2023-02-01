import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {mount} from 'enzyme';
import HtmlComponent from '../src/components/HtmlComponent';
import useApplication from '../src/hooks/useApplication';

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
                reducers: require('../src/reducers/index').default,
                ...config?.components?.store,
            },
        },
        onInit: ({ui}) => {
            //components.ui.addViews(require('@steroidsjs/bootstrap').default);
            //ui.addFields(require('@steroidsjs/core/ui/form').default);
            //ui.addFormatters(require('@steroidsjs/core/ui/format').default);
            ui.addViews(require('@steroidsjs/bootstrap/index').default);
            ui.addIcons(require('@steroidsjs/bootstrap/icon/fontawesome').default);
        },
    });

    return renderApplication(
        <Component {...childProps} />,
    );
}

export default (Component: any, props: any = {}) => mount(<AppMock {...props} Component={Component} />);
