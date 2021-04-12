import * as React from 'react';
import _isBoolean from 'lodash-es/isBoolean';
import _range from 'lodash-es/range';
import {useEvent, useMount} from 'react-use';
import {useCallback, useContext, useMemo, useRef} from 'react';
import {useComponents} from '../../../hooks';
import {FormContext} from '../../form/Form/Form';
import {formArrayAdd, formArrayRemove} from '../../../actions/form';
import tableNavigationHandler, {isDescendant} from './tableNavigationHandler';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';

interface IFieldListItem extends IFieldWrapperInputProps {

    /**
     * Будет ли отображён item ?
     * @example true
     */
    visible?: boolean,
    component?: any,

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: string,
    className?: CssClassName,
    headerClassName?: CssClassName,
    view?: CustomView,
    [key: string]: any,
}

export interface IFieldListProps extends IFieldWrapperInputProps {
    /**
     * Начальные значения в полях
     * @example {name: 'Ivan', amount: 5}
     */
    initialValues?: {[key: string]: any}
    items?: IFieldListItem[];
    fields?: any;
    initialRowsCount?: number;
    showAdd?: boolean;
    showRemove?: boolean;
    className?: CssClassName;
    view?: any;
    viewProps?: any;
    itemView?: any;
    itemViewProps?: any;
    enableKeyboardNavigation?: boolean;
    [key: string]: any;
}

export interface IFieldListViewProps {
    items?: (IFieldListItem & {
        disabled?: boolean,
        size?: boolean,
    })[];
    onAdd?: () => void,
    showRemove?: boolean,
    showAdd?: boolean,
    children?: React.ReactNode,
    className?: string,
    forwardedRef?: any,
    disabled?: boolean,
    size?: Size,
}

export interface IFieldListItemViewProps extends IFieldWrapperOutputProps {
    items?: (IFieldListItem & {
        disabled?: boolean,
        size?: boolean,
    })[];
    onRemove?: (rowIndex: number) => void,
    prefix: string,
    required?: boolean,
    rowIndex: number,
    showRemove: boolean,
}

function FieldList(props: IFieldListProps & IFieldWrapperOutputProps) {
    const components = useComponents();
    const context = useContext(FormContext);

    // Resolve model
    const modelFields = components.ui.getModel(props.model)?.fields;

    const dispatch = context.provider.useDispatch();

    // Add and Remove handlers
    const onAdd = useCallback((rowsCount = 1) => {
        dispatch(formArrayAdd(context.formId, props.input.name, rowsCount, props.initialValues));
    }, [context.formId, dispatch, props.initialValues, props.input.name]);
    const onRemove = useCallback((rowIndex) => {
        dispatch(formArrayRemove(context.formId, props.input.name, rowIndex));
    }, [context.formId, dispatch, props.input.name]);

    // Add initial rows
    useMount(() => {
        if (!props.input.value?.length) {
            onAdd(props.initialRowsCount);
        }
    });

    // Keyboard navigation
    const nodeRef = useRef();
    const onKeyDown = useCallback((event) => {
        if (props.enableKeyboardNavigation && isDescendant(nodeRef.current, event.target)) {
            tableNavigationHandler(event, () => onAdd());
        }
    }, [onAdd, props.enableKeyboardNavigation]);
    useEvent('keydown', onKeyDown);

    // Rows items
    const items = useMemo(
        () => (props.items || [])
            .filter(field => field.visible !== false)
            .map(field => ({
                ...modelFields?.[field.attribute],
                ...field,
                disabled: _isBoolean(field.disabled) ? field.disabled : props.disabled,
                size: field.size || props.size,
            })),
        [modelFields, props.disabled, props.items, props.size],
    );

    const contextValue = useMemo(() => ({
        formId: props.formId,
        model: props.model,
        prefix: props.prefix,
        layout: props.layout,
        provider: context.provider,
        reducer: context.reducer,
    }), [context.provider, context.reducer, props.formId, props.layout, props.model, props.prefix]);

    const commonProps = {
        showAdd: props.showAdd,
        showRemove: props.showRemove,
        size: props.size,
        disabled: props.disabled,
        required: props.required,
        items,
    };

    const FieldListView = props.view || components.ui.getView('form.FieldListView');
    const FieldListItemView = props.itemView || components.ui.getView('form.FieldListItemView');
    return (
        <FormContext.Provider value={contextValue}>
            <FieldListView
                {...props.viewProps}
                {...commonProps}
                forwardedRef={nodeRef}
                onAdd={onAdd}
            >
                {_range(props.input.value || 0).map(index => (
                    <FieldListItemView
                        {...props.itemViewProps}
                        {...commonProps}
                        key={index}
                        onRemove={onRemove}
                        prefix={props.input.name + '.' + index}
                        rowIndex={index}
                    />
                ))}
            </FieldListView>
        </FormContext.Provider>
    );
}

FieldList.defaultProps = {
    initialValues: null,
    disabled: false,
    required: false,
    showAdd: true,
    showRemove: true,
    className: '',
    initialRowsCount: 1,
    enableKeyboardNavigation: true,
};

export default fieldWrapper('FieldList', FieldList, {list: true});
