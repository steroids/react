import * as React from 'react';
import _get from 'lodash-es/get';
import _isObject from 'lodash-es/isObject';
import _isFunction from 'lodash-es/isFunction';
import _isString from 'lodash-es/isString';
import {components} from '../../../hoc';
import {FormContext} from '../../../hoc/form';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IFormatProps {
    attribute?: string;
    model?: string | ((...args: any[]) => any) | any;
    item?: any;
    component?: string | ((...args: any[]) => any);
    getFormatter?: any;
    ui?: any;
    emptyText?: any;
}

interface IFormatPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class Format extends React.Component<IFormatProps & IFormatPrivateProps> {

    static WrappedComponent: any;

    static getFormatterPropsFromModel(model, attribute) {
        if (!model || !attribute) {
            return null;
        }
        if (_isFunction(model.formatters)) {
            return model.formatters()[attribute] || null;
        }
        if (_isObject(model.formatters)) {
            return model.formatters[attribute] || null;
        }
        return null;
    }

    render() {
      return (
          <FormContext.Consumer>
            {context => this.renderContent(context)}
          </FormContext.Consumer>
      )
    }

    renderContent(context) {
        let props = this.props;
        // Get field config from model
        const model = this.props.model || context.model;
        props = {
            ...Format.WrappedComponent.getFormatterPropsFromModel(model, this.props.attribute),
            ...props
        };
        const ComponentField = _isString(props.component)
            ? this.props.ui.getFormatter('format.' + props.component)
            : props.component;
        if (ComponentField) {
            return <ComponentField {...props} />;
        }
        return _get(this.props.item, this.props.attribute) || this.props.emptyText || null;
    }

}
