import { mount } from 'enzyme';
import HtmlComponent from '../../src/components/HtmlComponent';
import useApplication from '../../src/hooks/useApplication';

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
                reducers: require('../../src/reducers/index').default,
                ...config?.components?.store,
            },
        },
        screen: {},
    });

    return renderApplication(
        <Component {...childProps} />,
    );
}

export default (Component: any, props: any = {}) => mount(
    <AppMock
        {...props}
        Component={Component}
    />,
);
