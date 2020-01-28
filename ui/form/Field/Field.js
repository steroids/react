import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';

import {components} from '../../../hoc';
import formIdHoc from '../formIdHoc';
import {getMeta} from '../../../reducers/fields';

export const getFieldPropsFromModel = (model, attribute) => {
    if (!model || !attribute) {
        return null;
    }
    if (_isFunction(model.fields)) {
        return model.fields()[attribute] || null;
    }
    if (_isObject(model.fields)) {
        return model.fields[attribute] || null;
    }
    return null;
};

@formIdHoc()
@connect(
    (state, props) => {
        let model = props.model;
        if (_isString(model)) {
            model = getMeta(state, model) || null;
        }

        return {
            model,
        };
    }
)
@components('ui')
export default class Field extends React.Component {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        attribute: PropTypes.string,
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.object,
        ]),
        hint: PropTypes.string,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
        component: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.elementType,
        ]),
        onChange: PropTypes.func,
        className: PropTypes.string,
        layoutClassName: PropTypes.string,
        view: PropTypes.elementType,
    };

    render() {
        let props = this.props;

        // Get field config from model
        props = {
            ...getFieldPropsFromModel(this.props.model, this.props.attribute),
            ...props,
        };

        const component = props.component || 'InputField';
        const ComponentField = _isString(component) ? this.props.ui.getField('form.' + component) : component;
        return <ComponentField {...props}/>;
    }

}
