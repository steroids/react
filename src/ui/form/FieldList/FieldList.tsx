import * as React from 'react';
import _isBoolean from 'lodash-es/isBoolean';
import _range from 'lodash-es/range';
import _concat from 'lodash-es/concat';
import _last from 'lodash-es/last';
import _isEmpty from 'lodash-es/isEmpty';
import _get from 'lodash-es/get';
import {useEvent, useMount} from 'react-use';
import {useCallback, useContext, useMemo, useRef, useState} from 'react';
import {ModelAttribute} from 'src/components/MetaComponent';
import {useComponents, useSelector} from '../../../hooks';
import {FormContext} from '../../form/Form/Form';
import {formArrayAdd, formArrayRemove} from '../../../actions/form';
import tableNavigationHandler, {isDescendant} from './tableNavigationHandler';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';

export interface IFieldListItem extends IFieldWrapperInputProps, IUiComponent {
    /**
     * Будет ли отображён item?
     * @example true
     */
    visible?: boolean,

    /**
     * Какой компонент для item использовать?
     * @example NumberField
     */
    component?: any,

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: string,

    /**
     * Дополнительный CSS-класс для заголовка
     */
    headerClassName?: CssClassName,

    /**
     * Заголовок для колонки таблицы
     */
    title?: string,

    [key: string]: any,
}

/**
 * FieldList
 *
 * Создает список из сгруппированных полей формы.
 * Для загрузки файлов с помощью `FileField` внутри строк `FieldList`, нужно использовать форму с флагом `useRedux`.
 */
export interface IFieldListProps extends IFieldWrapperInputProps, IUiComponent {
    /**
     * Начальные значения в полях
     * @example
     * {
     *  name: 'Ivan',
     *  amount: 5
     * }
     */
    initialValues?: { [key: string]: any }

    /**
     * Список с полями формы
     */
    items?: IFieldListItem[];

    /**
     * Изначальное количество групп с полями
     * @example 2
     */
    initialRowsCount?: number;

    /**
     * Отображение кнопки для добавления ещё одной группы с полями
     * @example true
     */
    showAdd?: boolean;

    /**
     * Возможность удаления группы с полями (добавляет крестик справа от группы)
     * @example true
     */
    showRemove?: boolean;

    /**
     * Дополнительный CSS-класс для таблицы
     */
    tableClassName?: CssClassName;

    /**
     * Пропсы для компонента отображения списка с группами полей - FieldListView
     */
    viewProps?: any;

    /**
     * Переопределение view React компонента для кастомизации отображения группы полей
     * @example MyCustomView
     */
    itemView?: any;

    /**
     * Пропсы для компонента отображения группы полей - FieldListItemView
     */
    itemViewProps?: any;

    /**
     * При фокусировке на одном из элементов формы и нажатию на клавиши стрелок вверх/вниз + Shift
     * происходит добавление группы полей сверху или снизу соответственно
     * @example true
     */
    enableKeyboardNavigation?: boolean;

    /**
     * Добавляет эффект зебры к таблице
     */
    hasAlternatingColors?: boolean,

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
    className?: CssClassName,
    tableClassName?: string,
    style?: CustomStyle,
    forwardedRef?: any,
    disabled?: boolean,
    size?: Size,
    hasAlternatingColors?: boolean,
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

function FieldList(props: IFieldListProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();
    const context = useContext(FormContext);

    // Resolve model
    const modelAttributes = components.meta.getModel(props.model)?.attributes as ModelAttribute[];

    const isWithReduxForm = useSelector(state => _get(state, ['form', context.formId]) || null);

    const dispatch = context.provider.useDispatch();

    // Mapper for preserving the correct sequence of rows on the UI
    const [storeToRowIndexMap, setStoreToRowIndexMap] = useState(_range(props.input.value) || []);

    const addRowIndexes = useCallback((rowsCount) => {
        setStoreToRowIndexMap((prevMap) => {
            const lastIndex = !_isEmpty(prevMap) ? _last(prevMap) + 1 : 0;
            return _concat(prevMap, _range(lastIndex, lastIndex + rowsCount));
        });
    }, []);

    const removeRowIndex = useCallback((rowIndex) => {
        setStoreToRowIndexMap((prevMap) => [
            ...prevMap.slice(0, rowIndex),
            ...prevMap.slice(rowIndex + 1),
        ]);
    }, []);

    // Add and Remove handlers
    const onAdd = useCallback((rowsCount = 1) => {
        addRowIndexes(rowsCount);
        dispatch(formArrayAdd(context.formId, props.input.name, rowsCount, props.initialValues));
    }, [context.formId, dispatch, props.initialValues, props.input.name, addRowIndexes]);
    const onRemove = useCallback((rowIndex) => {
        removeRowIndex(rowIndex);
        dispatch(formArrayRemove(context.formId, props.input.name, rowIndex));
    }, [context.formId, dispatch, props.input.name, removeRowIndex]);

    // Add initial rows
    useMount(() => {
        if (!props.input.value) {
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
            .map(field => {
                if (typeof field === 'string') {
                    field = {attribute: field};
                }

                return {
                    ...(modelAttributes || []).find(attributeItem => attributeItem.attribute === field.attribute),
                    ...field,
                    disabled: _isBoolean(field.disabled) ? field.disabled : props.disabled,
                    size: field.size || props.size,
                };
            }),
        [modelAttributes, props.disabled, props.items, props.size],
    );

    const contextValue = useMemo(() => ({
        formId: props.formId,
        model: props.model,
        prefix: props.prefix,
        size: props.size,
        provider: context.provider,
        reducer: context.reducer,
    }), [context.provider, context.reducer, props.formId, props.model, props.prefix, props.size]);

    const commonProps = {
        showAdd: props.showAdd,
        showRemove: props.showRemove,
        size: props.size,
        disabled: props.disabled,
        required: props.required,
        className: props.className,
        tableClassName: props.tableClassName,
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
                hasAlternatingColors={props.hasAlternatingColors}
            >
                {!_isEmpty(storeToRowIndexMap) && _range(props.input.value || 0).map((index) => (
                    <FieldListItemView
                        {...props.itemViewProps}
                        {...commonProps}
                        key={isWithReduxForm ? storeToRowIndexMap[index] : index}
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

export default fieldWrapper<IFieldListProps>('FieldList', FieldList, {list: true});
