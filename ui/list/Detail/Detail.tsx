import * as React from 'react';
import {components, connect} from '../../../hoc';
import _isString from 'lodash-es/isString';
import {getModel} from '../../../reducers/fields';
import _upperFirst from 'lodash-es/upperFirst';
import _isObject from 'lodash-es/isObject';
import _isFunction from 'lodash-es/isFunction';
import _get from 'lodash-es/get';
import Format from '../../format/Format';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IDetailColumn {
  label?: string | boolean | JSX.Element,
  hint?: string | boolean | JSX.Element,
  attribute?: string,
  visible?: boolean,
  value?: any,
  valueView?: any,
  valueProps?: any,
}

export interface IDetailProps {
    item?: any;
    model?: string | ((...args: any[]) => any) | any;
    view?: any;
    attributes?: (string | IDetailColumn)[];
    className?: CssClassName,
    size?: Size,
    emptyText?: any,
    [key: string]: any,
}

export interface IDetailViewProps {
    className?: CssClassName,
    items: (IDetailColumn & {
        label: any,
        value: any,
    })[],
}

interface IDetailPrivateProps extends IConnectHocOutput, IComponentsHocOutput {

}

@connect((state, props) => ({
    model: getModel(state, props.model),
}))
@components('ui')
export default class Detail extends React.PureComponent<IDetailProps & IDetailPrivateProps> {
    render() {
        const attributes = this.props.attributes
            .map(column => (_isString(column) ? {attribute: column} : column))
            .filter((column:IDetailColumn) => column.visible !== false);
        const DetailView = this.props.view || this.props.ui.getView('list.DetailView');
        return (
            <DetailView
                {...this.props}
                items={attributes.map((attribute:IDetailColumn) => ({
                    ...attribute,
                    label: this.renderLabel(attribute),
                    value: this.renderValue(attribute)
                }))}
            />
        );
    }

    renderLabel(attribute) {
        if (attribute.label || attribute.label === '') {
            return attribute.label;
        }
        const autoLabel = _upperFirst(attribute.attribute);
        if (_isObject(this.props.model)) {
            if (_isFunction(this.props.model.formatters)) {
                return (
                    _get(this.props.model.formatters(), [attribute.attribute, 'label']) ||
                    autoLabel
                );
            }
            if (_get(this.props, ['model', 'formatters', attribute.attribute])) {
                return (
                    this.props.model.formatters[attribute.attribute].label || autoLabel
                );
            }
        }
        return autoLabel;
    }

    renderValue(attribute) {
        // Custom component
        if (attribute.valueView) {
            const ValueView = attribute.valueView;
            return (
                <ValueView
                    {...attribute}
                    {...attribute.valueProps}
                    item={this.props.item}
                />
            );
        }

        if (attribute.value) {
            return attribute.value;
        }

        return (
            <Format
                item={this.props.item}
                model={this.props.model}
                emptyText={this.props.emptyText}
                {...attribute}
            />
        );
    }
}
