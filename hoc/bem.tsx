import * as React from 'react';
import components, {IComponentsHocOutput} from './components';

/**
 * Bem HOC
 * Прокидывает утилиту `bem` для правильной генерации CSS классов по методологии БЭМ (блок, элемент, модификатор)
 */
export interface IBemHocInput {
    style?: any
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

            private readonly bem;

            constructor(props) {
                super(props);

                if (namespace) {
                    this.bem = this.props.components.html.bem(namespace, props.style);
                }

                // Only for React Native
                if (styles && this.props.components.html.addStyles) {
                    this.props.components.html.addStyles(styles);
                }
            }

            render() {
                const props = {} as IBemHocOutput;
                props.bem = this.bem;

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
