import * as React from 'react';
import components, {IComponentsHocOutput} from './components';
import Hoc from '../base/Hoc';
import multi from './multi';

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
    multi()(
        components()(
            class BemHoc extends Hoc<IBemHocInput & IBemHocPrivateProps> {
                static WrappedComponent = WrappedComponent;

                private readonly _bem;

                constructor(props) {
                    super(props);

                    if (namespace) {
                        this._bem = this.props.components.html.bem(namespace, props.style);
                    }

                    // Only for React Native
                    if (styles && this.props.components.html.addStyles) {
                        this.props.components.html.addStyles(styles);
                    }
                }

                getProps() {
                    return {
                        ...this.props,
                        bem: this._bem,
                    };
                }
            }
        )
    )
