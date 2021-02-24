import * as React from 'react';
import {mount} from 'enzyme';
import useApplication from '../hooks/useApplication';
import {HtmlComponent} from '../components';

function AppMock(props: {children: any}) {
    const {renderApplication} = useApplication({
        components: {
            html: {
                className: HtmlComponent,
            },
            store: {
                reducers: require('../reducers/index').default,
            },
        },
        onInit: ({ui}) => {
            //components.ui.addViews(require('@steroidsjs/bootstrap').default);
            //ui.addFields(require('@steroidsjs/core/ui/form').default);
            //ui.addFormatters(require('@steroidsjs/core/ui/format').default);
            //ui.addIcons(require('@steroidsjs/bootstrap/icon/fontawesome').default);
        },
    });

    return renderApplication(props.children);
}

export default (children: any) => mount(
    <AppMock>{children}</AppMock>,
);
