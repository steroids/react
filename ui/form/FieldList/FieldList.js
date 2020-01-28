import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {arrayPush} from 'redux-form';
import {findDOMNode} from 'react-dom';
import _isString from 'lodash-es/isString';

import {components} from '../../../hoc';
import Field, {getFieldPropsFromModel} from '../Field/Field';
import fieldHoc from '../fieldHoc';

import tableNavigationHandler from './tableNavigationHandler';
import {getMeta} from '../../../reducers/fields';
import formIdHoc from '../formIdHoc';

@fieldHoc({
    componentId: 'form.FieldList',
    list: true,
})
@formIdHoc({
    appendPrefix: true,
})
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
export default class FieldList extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        attribute: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.bool,
                PropTypes.element,
            ]),
            hint: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.bool,
                PropTypes.element,
            ]),
            attribute: PropTypes.string,
            prefix: PropTypes.string,
            visible: PropTypes.bool,
            model: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func,
                PropTypes.object,
            ]),
            component: PropTypes.any,
            required: PropTypes.bool,
            size: PropTypes.oneOf(['sm', 'md', 'lg']),
            placeholder: PropTypes.string,
            disabled: PropTypes.bool,
            onChange: PropTypes.func,
            className: PropTypes.string,
            headerClassName: PropTypes.string,
            view: PropTypes.elementType,
        })),
        fields: PropTypes.object,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        initialRowsCount: PropTypes.number,
        showAdd: PropTypes.bool,
        showRemove: PropTypes.bool,
        onChange: PropTypes.func,
        className: PropTypes.string,
        view: PropTypes.elementType,
        viewProps: PropTypes.object,
        itemView: PropTypes.elementType,
        itemViewProps: PropTypes.object,
        enableKeyboardNavigation: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
        required: false,
        showAdd: true,
        showRemove: true,
        className: '',
        initialRowsCount: 1,
        enableKeyboardNavigation: true,
    };

    static childContextTypes = {
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
            PropTypes.object,
        ]),
        prefix: PropTypes.string,
        layout: PropTypes.oneOfType([
            PropTypes.oneOf(['default', 'inline', 'horizontal']),
            PropTypes.string,
            PropTypes.bool,
        ]),
        layoutProps: PropTypes.object,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
    };

    getChildContext() {
        return {
            model: this.props.model,
            prefix: this.props.prefix,
            layout: this.props.layout,
            layoutProps: this.props.layoutProps,
            size: this.props.size,
        };
    }

    constructor() {
        super(...arguments);

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

        tableNavigationHandler(e, () => this.props.dispatch(arrayPush(this.props.formId, this.props.attribute)));
    }

    render() {
        const FieldListView = this.props.view || this.props.ui.getView('form.FieldListView');
        const FieldListItemView = this.props.itemView || this.props.ui.getView('form.FieldListItemView');
        const items = (this.props.items || [])
            .filter(field => field.visible !== false)
            .map(field => ({
                ...getFieldPropsFromModel(this.props.model, field.attribute),
                ...field,
                disabled: field.disabled || this.props.disabled,
                size: field.size || this.props.size,
            }));

        return (
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
        );
    }

    _renderField(field, prefix) {
        return (
            <Field
                layout='inline'
                {...field}
                prefix={prefix}
            />
        );
    }

    _onAdd() {
        this.props.fields.push();
    }

    _onRemove(rowIndex) {
        this.props.fields.remove(rowIndex);
    }

}
