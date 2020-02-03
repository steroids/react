import * as React from 'react';
import {connect} from 'react-redux';
import _isString from 'lodash-es/isString';
import {components} from '../../../hoc';
import formIdHoc from '../formIdHoc';
import {getMeta} from '../../../reducers/fields';

export interface IFieldProps {
    formId?: string | boolean;
    prefix?: string | boolean;
    size?: string;
    label?: string | boolean;
    attribute?: string;
    model?: string | ((...args: any[]) => any) | any;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    component?: string | ((...args: any[]) => any) | JSX.Element;
    onChange?: (...args: any[]) => any;
    className?: string;
    layoutClassName?: string;
    view?: any;
    getField?: any;
    layout?: any;
    layoutProps?: any;
    ui?: any;
}

@formIdHoc()
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
export default class Field extends React.Component<IFieldProps, {}> {
    render() {
        let props = this.props;
        const component = props.component || 'InputField';
        const ComponentField = _isString(component)
            ? this.props.ui.getField('form.' + component)
            : component;
        return <ComponentField {...props} />;
    }
}
