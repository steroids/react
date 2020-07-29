import * as React from 'react';
import {connect} from 'react-redux';
import {arrayPush} from 'redux-form';
import {findDOMNode} from 'react-dom';
import {components, field} from '../../../hoc';
import {getFieldPropsFromModel, IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import Field from '../Field';
import tableNavigationHandler from './tableNavigationHandler';
import {getModel} from '../../../reducers/fields';
import {FormContext} from '../../../hoc/form';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';

interface IFieldListItem extends IFieldHocInput {
    visible?: boolean,
    component?: any,
    placeholder?: string,
    className?: CssClassName,
    headerClassName?: CssClassName,
    view?: CustomView,
    [key: string]: any,
}

export interface IFieldListProps extends IFieldHocInput {
    items?: IFieldListItem[];
    fields?: any;
    initialRowsCount?: number;
    showAdd?: boolean;
    showRemove?: boolean;
    className?: string;
    view?: any;
    viewProps?: any;
    itemView?: any;
    itemViewProps?: any;
    enableKeyboardNavigation?: boolean;
}

export interface IFieldListViewProps extends IFieldHocOutput {
    items?: (IFieldListItem & {
        disabled?: boolean,
        size?: boolean,
    })[];
    renderField?: (field: object, prefix: string) => any,
    onAdd?: () => void,
}

export interface IFieldListItemViewProps extends IFieldHocOutput {
    items?: (IFieldListItem & {
        disabled?: boolean,
        size?: boolean,
    })[];
    renderField?: (field: object, prefix: string) => any,
    onRemove?: (rowIndex: number) => void,
    prefix: string,
    rowIndex: number,
}

interface IFieldListPrivateProps extends IFieldHocOutput, IConnectHocOutput, IComponentsHocOutput {

}

const defaultProps = {
    disabled: false,
    required: false,
    showAdd: true,
    showRemove: true,
    className: '',
    initialRowsCount: 1,
    enableKeyboardNavigation: true,
};

@field({
    componentId: 'form.FieldList',
    list: true,
})
@connect((state, props) => ({
    model: getModel(state, props.model),
}))
@components('ui')
export default class FieldList extends React.PureComponent<IFieldListProps & IFieldListPrivateProps> {

    static defaultProps = defaultProps;

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
        if (this.props.enableKeyboardNavigation && process.env.IS_WEB) {
            document.addEventListener('keydown', this._onKeyDown, false);
        }
    }

    componentWillUnmount() {
        if (this.props.enableKeyboardNavigation && process.env.IS_WEB) {
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
