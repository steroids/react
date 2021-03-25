import * as React from 'react';
import _isBoolean from 'lodash-es/isBoolean';
import _range from 'lodash-es/range';
import {useComponents} from '@steroidsjs/core/hooks';
import {useEvent, useMount} from 'react-use';
import {useCallback, useContext, useMemo, useRef} from 'react';
import {FormContext} from '@steroidsjs/core/ui/form/Form/Form';
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

export interface IFieldListViewProps extends IFieldListProps {
    items?: (IFieldListItem & {
        disabled?: boolean,
        size?: boolean,
    })[];
    renderField?: (field: any, prefix: string) => any,
    onAdd?: () => void,
    showRemove?: boolean,
    showAdd?: boolean,
    children?: React.ReactNode,
    className?: string,
    forwardedRef?: any,
}

export interface IFieldListItemViewProps extends IFieldWrapperOutputProps {
    items?: (IFieldListItem & {
        disabled?: boolean,
        size?: boolean,
    })[];
    renderField?: (field: any, prefix: string) => any,
    onRemove?: (rowIndex: number) => void,
    prefix: string,
    rowIndex: number,
    showRemove: boolean,
}

function FieldList(props: IFieldListProps & IFieldWrapperOutputProps) {
    const components = useComponents();
    const context = useContext(FormContext);

    // Resolve model
    const modelFields = components.ui.getModel(props.model)?.fields;

    // Add and Remove handlers
    const onAdd = useCallback((rowsCount = 1) => {
        const newValue = [].concat(props.input.value || []);
        for (let i = 0; i < rowsCount; i += 1) {
            newValue.push(props.initialValues);
        }
        props.input.onChange.call(null, newValue);
    }, [props.initialValues, props.input.onChange, props.input.value]);
    const onRemove = useCallback((rowIndex) => {
        const newItems = [].concat(props.input.value || []);
        newItems.splice(rowIndex, 1);
        props.input.onChange.call(null, newItems);
    }, [props.input.onChange, props.input.value]);

    // Add initial rows
    useMount(() => {
        if (!props.input.value?.length) {
            onAdd(props.initialRowsCount);
        }
    });

    // Keyboard navigation
    const nodeRef = useRef();
    const onKeyDown = useCallback((event) => {
        if (!props.enableKeyboardNavigation) {
            return;
        }

        if (!isDescendant(nodeRef.current, event.target)) {
            return;
        }

        tableNavigationHandler(event, () => onAdd());
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

    const FieldListView = props.view || components.ui.getView('form.FieldListView');
    const FieldListItemView = props.itemView || components.ui.getView('form.FieldListItemView');
    return (
        <FormContext.Provider
            value={{
                formId: props.formId,
                model: props.model,
                prefix: props.prefix,
                layout: props.layout,
                globalState: context.globalState,
            }}
        >
            <FieldListView
                {...props}
                {...props.viewProps}
                forwardedRef={nodeRef}
                items={items}
                onAdd={onAdd}
            >
                {_range(props.input.value?.length || 0).map(index => (
                    <FieldListItemView
                        {...props}
                        {...props.itemViewProps}
                        key={index}
                        items={items}
                        prefix={props.input.name + '.' + index}
                        onRemove={onRemove}
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

export default fieldWrapper('FieldList', FieldList);
