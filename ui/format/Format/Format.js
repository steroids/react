import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash-es/get';
import _isObject from 'lodash-es/isObject';
import _isFunction from 'lodash-es/isFunction';
import _isString from 'lodash-es/isString';

import {components} from '../../../hoc';

@components('ui')
export default class Format extends React.Component {

    static propTypes = {
        attribute: PropTypes.string,
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.object,
        ]),
        item: PropTypes.object,
        component: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
    };

    static contextTypes = {
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.object,
        ]),
    };

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
        let props = this.props;

        // Get field config from model
        const model = this.props.model || this.context.model;
        props = {
            ...Format.getFormatterPropsFromModel(model, this.props.attribute),
            ...props,
        };

        const ComponentField = _isString(props.component) ? this.props.ui.getFormatter('format.' + props.component) : props.component;
        if (ComponentField) {
            return <ComponentField {...props}/>;
        }

        return _get(this.props.item, this.props.attribute) || null;
    }

}
