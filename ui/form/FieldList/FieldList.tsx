import * as React from 'react';
import {connect} from 'react-redux';
import {arrayPush} from 'redux-form';
import {findDOMNode} from 'react-dom';
import _isString from 'lodash-es/isString';
import {components} from '../../../hoc';
import Field from '../Field';
import fieldHoc, {getFieldPropsFromModel} from '../fieldHoc';
import tableNavigationHandler from './tableNavigationHandler';
import {getMeta} from '../../../reducers/fields';
import formIdHoc from '../formIdHoc';
import {FormContext} from '../Form/Form';
import {IFieldProps} from '../Field/Field';

interface IFieldListProps extends IFieldProps {
    label?: string | boolean;
    hint?: string;
    attribute?: string;
    items?: {
        label?: string | boolean | JSX.Element,
        hint?: string | boolean | JSX.Element,
        attribute?: string,
        prefix?: string | boolean,
        visible?: boolean,
        model?: string | ((...args: any[]) => any) | any,
        component?: any,
        required?: boolean,
        size?: 'sm' | 'md' | 'lg',
        placeholder?: string,
        disabled?: boolean,
        onChange?: (...args: any[]) => any,
        className?: string,
        headerClassName?: string,
        view?: any
    }[];
    fields?: any;
    required?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    initialRowsCount?: number;
    showAdd?: boolean;
    showRemove?: boolean;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    viewProps?: any;
    itemView?: any;
    itemViewProps?: any;
    enableKeyboardNavigation?: boolean;
    remove?: any;
    push?: any;
    map?: any;
    getView?: any;
    ui?: any;
    formId?: any;
    dispatch?: any;
    length?: any;
}

@fieldHoc({
    componentId: 'form.FieldList',
    list: true
})
@formIdHoc({
    appendPrefix: true
})
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
export default class FieldList extends React.PureComponent<IFieldListProps> {

    constructor(props) {
        super(props);
        this._onAdd = this._onAdd.bind(this);
        this._onRemove = this._onRemove.bind(this);
        this._renderField = this._renderField.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    componentDidMount() {
        if (this.props.fields.length === 0) {
            for (let i = 0; i < this.props.initialRowsCount; i++) {
                this._onAdd();
            }
        }
        if (this.props.enableKeyboardNavigation) {
            document.addEventListener('keydown', this._onKeyDown, false);
        }
    }

    componentWillUnmount() {
        if (this.props.enableKeyboardNavigation) {
            document.removeEventListener('keydown', this._onKeyDown, false);
        }
    }

    _onKeyDown(e) {
        const isDescendant = (parent, child) => {
            let node = child.parentNode;
            while (node !== null) {
                if (node === parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        };
        if (!isDescendant(findDOMNode(this), e.target)) {
            return;
        }
        tableNavigationHandler(e, () =>
            this.props.dispatch(arrayPush(this.props.formId, this.props.attribute))
        );
    }

    render() {
        const FieldListView =
            this.props.view || this.props.ui.getView('form.FieldListView');
        const FieldListItemView =
            this.props.itemView || this.props.ui.getView('form.FieldListItemView');
        const items = (this.props.items || [])
            .filter(field => field.visible !== false)
            .map(field => ({
                ...getFieldPropsFromModel(this.props.model, field.attribute),
                ...field,
                disabled: field.disabled || this.props.disabled,
                size: field.size || this.props.size
            }));
        return (
            <FormContext.Provider
                value={{
                    formId: this.props.formId,
                    model: this.props.model,
                    prefix: this.props.prefix,
                    layout: this.props.layout,
                    layoutProps: this.props.layoutProps,
                    size: this.props.size,
                }}
            >
                <FieldListView
                    {...this.props}
                    {...this.props.view}
                    items={items}
                    renderField={this._renderField}
                    onAdd={this._onAdd}
                >
                    {this.props.fields.map((prefix, rowIndex) => (
                        <FieldListItemView
                            {...this.props}
                            {...this.props.itemViewProps}
                            items={items}
                            renderField={this._renderField}
                            onRemove={this._onRemove}
                            key={rowIndex}
                            prefix={prefix}
                            rowIndex={rowIndex}
                        />
                    ))}
                </FieldListView>
            </FormContext.Provider>
        );
    }

    _renderField(field, prefix) {
        return <Field layout='inline' {...field} prefix={prefix}/>;
    }

    _onAdd() {
        this.props.fields.push();
    }

    _onRemove(rowIndex) {
        this.props.fields.remove(rowIndex);
    }
}
