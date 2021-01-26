import * as React from 'react';
import _isEqual from 'lodash-es/isEqual';
import Hoc from '../base/Hoc';
import multi from './multi';

/**
 * Normalize HOC
 * Приводит данные к единому виду. Используется, когда данные в `props` могут быть записаны в нескольких форматах. На
 * выходе в отдельный `props` будут прокидываться "нормализованные" данные. При обновлении поля с оригинальными данными,
 * процесс нормализации будет повторяться.
 */
export interface INormalizeHocInput {

}

export interface INormalizeHocOutput {

}

export interface INormalizeHocConfig {
    fromKey: string,
    toKey: string,
    normalizer: (value: any, props: any) => any,
}

export default (configs: INormalizeHocConfig | INormalizeHocConfig[]): any => WrappedComponent =>
    multi()(
        class NormalizeHoc extends Hoc<INormalizeHocInput> {
            static WrappedComponent = WrappedComponent;

            _state: any;

            constructor(props) {
                super(props);

                this._state = this._normalize([].concat(configs), this.props);
            }

            componentDidUpdate(prevProps: Readonly<{}>) {
                const toNormalize = [].concat(configs).filter(config => !_isEqual(prevProps[config.fromKey], this.props[config.fromKey]));
                if (toNormalize.length > 0) {
                    this._state = this._normalize(toNormalize, this.props);
                    this.forceUpdate();
                }
            }

            _getProps() {
                return {
                    ...this.props,
                    ...this._state,
                };
            }

            _normalize(configs: INormalizeHocConfig[], props) {
                const data = {};
                configs.map(config => {
                    data[config.toKey] = config.normalizer(
                        props[config.fromKey],
                        {...this.props, ...this.state, ...data}
                    );
                });
                return data;
            }
        }
    )
