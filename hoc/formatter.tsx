import * as React from 'react';
import _get from 'lodash-es/get';
import _upperFirst from 'lodash-es/upperFirst';
import theme, {IThemeHocInput, IThemeHocOutput} from './theme';
import components, {IComponentsHocOutput} from '../hoc/components';

const defaultConfig = {
    componentId: '',
    attributes: ['']
};

interface IFormatterHocConfig {
    componentId?: string,
    attributes?: string[],
}

export interface IFormatterHocInput extends IThemeHocInput, IComponentsHocOutput {
    item?: object,
    attribute?: string, // or attributeFrom, attributeTo, attribute*
    value?: any, // or valueFrom, valueTo, value*
}

export interface IFormatterHocOutput extends IThemeHocOutput {
    item?: object,
    value?: any, // or valueFrom, valueTo, value*
    renderValue?: (value: any) => React.ComponentType<any> | string,
}

export default (config: IFormatterHocConfig = {}): any => WrappedComponent =>
    theme()(
        components('ui')(
            class FormatterHoc extends React.Component<IFormatterHocInput> {

                static WrappedComponent = WrappedComponent;

                constructor(props) {
                    super(props);

                    this.renderValue = this.renderValue.bind(this);
                }

                componentId() {
                    return (WrappedComponent.displayName || WrappedComponent.name)
                        ? 'format.' + (WrappedComponent.displayName || WrappedComponent.name)
                        : null;
                }

                renderValue(value) {
                    let FormatterView;
                    try {
                        FormatterView = this.props.ui.getView(config.componentId || this.componentId());
                    } catch (e) {
                    }
                    if (!FormatterView) {
                        try {
                            FormatterView = this.props.ui.getView('format.DefaultView');
                        } catch (e) {
                        }
                    }

                    return FormatterView
                        ? <FormatterView value={value}/>
                        : value;
                }

                render() {
                    const _config = {
                        ...defaultConfig,
                        componentId: this.componentId(),
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
                            renderValue={this.renderValue}
                        />
                    );
                }
            }
        )
    );
