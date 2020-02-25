import * as React from 'react';
import components, {IComponentsHocOutput} from './components';

export interface IBemHocInput {

}

export interface IBemHocOutput {
    bem?: {
        element(...classes: any[]): string;
        block(...classes: any[]): string;
    } | any,
    components?: IComponentsHocOutput,
}

export interface IBemHocPrivateProps {
    components: IComponentsHocOutput,
}

export default (namespace: string): any => WrappedComponent =>
    components()(
        class BemHoc extends React.PureComponent<IBemHocInput & IBemHocPrivateProps> {
            static WrappedComponent = WrappedComponent;

            render() {
                const props = {} as IBemHocOutput;
                if (namespace) {
                    props.bem = this.props.components.html.bem(namespace);
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
