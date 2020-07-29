import * as React from 'react';
import {connect} from 'react-redux';
import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';

import components, {IComponentsHocOutput} from '../../../hoc/components';
import form, {IFormHocOutput} from '../../../hoc/form';
import {getModel} from '../../../reducers/fields';
import {IConnectHocOutput} from '../../../hoc/connect';
import {getFieldPropsFromModel} from '../../../hoc/field';

export interface IFieldProps {
}

export interface IFieldPrivateProps extends IFormHocOutput, IConnectHocOutput, IComponentsHocOutput{
}

@form()
@connect((state, props) => ({
    model: getModel(state, props.model),
}))
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
