import * as React from 'react';
import {connect} from 'react-redux';
import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';

import components, {IComponentsHocOutput} from '../../../hoc/components';
import form, {IFormHocOutput} from '../../../hoc/form';
import {getMeta} from '../../../reducers/fields';
import {IConnectHocOutput} from '../../../hoc/connect';
import {getFieldPropsFromModel} from '../../../hoc/field';

export interface IFieldProps {
}

export interface IFieldPrivateProps extends IFormHocOutput, IConnectHocOutput, IComponentsHocOutput{
}

@form()
@connect((state, props) => {
    let model = props.model;
    if (_isString(model)) {
        model = getMeta(state, model) || null;
    }
    return {
        model
    };
})
@components('ui')
export default class Field extends React.Component<IFieldProps & IFieldPrivateProps, {}> {
    render() {
        const component = this.props.component
            || _get(getFieldPropsFromModel(this.props.model, this.props.attribute), 'component')
            || 'InputField';
        const ComponentField = _isString(component) ? this.props.ui.getField('form.' + component) : component;
        return (
            <ComponentField {...this.props} />
        );
    }
}
