import * as React from 'react';
import _get from 'lodash-es/get';
import _upperFirst from 'lodash-es/upperFirst';

const defaultConfig = {
    componentId: '',
    attributes: ['']
};

export interface IFormatterHocInput {
    item?: object,
    attribute?: string, // or attributeFrom, attributeTo, attribute*
    value?: any, // or valueFrom, valueTo, value*
}

export interface IFormatterHocOutput {
    item?: object,
    value?: any, // or valueFrom, valueTo, value*
}

interface IFormatterHocConfig {
    componentId: string,
    attributes: string[],
}

export default (config = {}): any => WrappedComponent =>
    class FormatterHoc extends React.Component<IFormatterHocInput> {

        static WrappedComponent = WrappedComponent;

        render() {
            const _config = {
                ...defaultConfig,
                componentId:
                    'view.' + (WrappedComponent.displayName || WrappedComponent.name),
                ...config
            } as IFormatterHocConfig;
            const valueProps = {} as IFormatterHocOutput;
            _config.attributes.forEach(attribute => {
                const valueKey = 'value' + _upperFirst(attribute);
                const attributeKey = 'attribute' + _upperFirst(attribute);
                valueProps[valueKey] = _get(this.props, valueKey) || _get(this.props.item, this.props[attributeKey]);
            });
            return (
                <WrappedComponent
                    {...valueProps}
                    {...this.props}
                />
            );
        }

    }
