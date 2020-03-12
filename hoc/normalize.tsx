import * as React from 'react';

export interface INormalizeHocConfig {
    fromKey: string,
    toKey: string,
    normalizer: (value: any) => any,
}

export default (configs: INormalizeHocConfig | INormalizeHocConfig[]): any => WrappedComponent =>
    class NormalizeHoc extends React.PureComponent {
        static WrappedComponent = WrappedComponent;

        constructor(props) {
            super(props);

            this.state = this._normalize([].concat(configs), this.props);
        }

        componentDidUpdate(prevProps: Readonly<{}>) {
            const toNormalize = [].concat(configs).filter(config => prevProps[config.fromKey] !== this.props[config.fromKey]);
            if (toNormalize.length > 0) {
                this.setState(this._normalize(toNormalize, this.props));
            }

        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    {...this.state}
                />
            );
        }

        _normalize(configs: INormalizeHocConfig[], props) {
            const data = {};
            configs.map(config => {
                data[config.toKey] = config.normalizer(props[config.fromKey]);
            });
            return data;
        }
    }
