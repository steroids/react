import * as React from 'react';
import components, {IComponentsHocOutput} from './components';

export interface IBemHocInput {

}

export interface IBemHocOutput extends IComponentsHocOutput {
    bem?: {
        element(...classes: any[]): string;
        block(...classes: any[]): string;
    } | any,
}

export interface IBemHocPrivateProps extends IComponentsHocOutput {
}

export default (namespace: string, styles = null): any => WrappedComponent =>
    components()(
        class BemHoc extends React.PureComponent<IBemHocInput & IBemHocPrivateProps> {
            static WrappedComponent = WrappedComponent;

            render() {
                const props = {} as IBemHocOutput;

                if (namespace) {
                    props.bem = this.props.components.html.bem(namespace);
                }

                // Only for React Native
                if (styles && this.props.components.html.addStyles) {
                    this.props.components.html.addStyles(styles);
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
