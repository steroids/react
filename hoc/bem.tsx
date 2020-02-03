import * as React from 'react';
import components, {IComponentsContext} from './components';

interface IBemHocProps {
    bem: any,
    components: IComponentsContext,
}

export default (className): any => WrappedComponent =>
    components()(
        class BemHoc extends React.PureComponent<IBemHocProps> {
            static WrappedComponent = WrappedComponent;

            render() {
                const props = {} as IBemHocProps;
                if (className) {
                    props.bem = this.props.components.html.bem(className);
                }
                return (
                    <WrappedComponent
                        {...this.props}
                        {...props}
                        components={this.props.components}
                    />
                );
            }
        }
    )
