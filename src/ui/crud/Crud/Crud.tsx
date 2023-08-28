import * as React from 'react';
import _get from 'lodash-es/get';
import _omit from 'lodash-es/omit';
import {ReactNode, useCallback, useEffect, useMemo} from 'react';
import {useUpdateEffect} from 'react-use';
import CrudModal from './CrudModal';
import {listRefresh} from '../../../actions/list';
import {closeModal, openModal} from '../../../actions/modal';
import {goToRoute} from '../../../actions/router';
import {IComponents} from '../../../providers/ComponentsProvider';
import useFetch from '../../../hooks/useFetch';
import CrudContent from './CrudContent';
import {
    CRUD_ACTION_INDEX,
    DEFAULT_PRIMARY_KEY,
    DEFAULT_QUERY_KEY,
    normalizeItems,
    pageControlsMap,
    routeInfoSelector,
} from './utils';
import {useComponents, useSelector} from '../../../hooks';
import useDispatch from '../../../hooks/useDispatch';
import {IFormProps} from '../../form/Form/Form';
import {IGridProps} from '../../list/Grid/Grid';
import {IControlItem} from '../../nav/Controls/Controls';

export interface IApiRest {
    index?: any,
    create?: any,
    update?: any,
    delete?: any,
    view?: any,
    [key: string]: any | undefined,
}

export interface ICrudItem extends Omit<IControlItem, 'visible' | 'confirm' | 'onClick'> {
    /**
    * Заголовок
    * @example 'Title'
    */
    title?: string,

    /**
    * Название для action
    * @example
    */
    actionName?: string,

    /**
    * Обязателен ли Personal Key
    * @example true
    */
    pkRequired?: boolean,

    /**
    * Режим отображения
    * @example 'modal'
    */
    mode?: 'page' | 'modal',

    /**
    * Компонент
    */
    component?: any,

    /**
    * Свойства компонента
    */
    componentProps?: any,

    /**
    * Коллекция Controls
    */
    controlsInclude?: string[],

    /**
    * Коллекция исключенных Controls
    */
    controlsExclude?: string[],

    /**
    * Управление отображением
    * @example true
    */
    visible?: boolean | ((item: any, crudItem: ICrudItem, isGrid: boolean) => boolean),

    /**
    * Сообщение о подтверждении
    */
    confirm?: string | ((e: any, props: ICrudClickProps) => any),

    /**
    * Функция обратного вызова, срабатывает после нажатия
    */
    onClick?: (e: Event | React.MouseEvent, props: ICrudClickProps) => any,
}

export interface ICrudClickProps {
    crudId?: string;
    mode?: 'page' | 'modal',
    restUrl?: string,
    restApi?: IApiRest,
    primaryKey?: 'id' | string,
    queryKey?: 'id' | string,
    routeId?: string,
    routeAction?: string,
    routeParams?: any,
    recordId?: PrimaryKey,
    record?: Record<string, unknown>,
    components: IComponents,
    goToAction: (nextAction: string) => any,
    errorHandler?: (error, dispatch: any) => void,
}

/**
 * Crud
 *
 * Компонент CRUD (Create, Read, Update, Delete) предоставляет интерфейс для выполнения операций создания,
 * чтения, обновления и удаления записей. Он позволяет создавать, просматривать, редактировать и удалять
 * записи из некоторой модели данных.
 */
export interface ICrudProps {
    /**
    * Id для Crud
    */
    crudId?: string;

    /**
    * Режим работы Crud
    */
    mode?: 'page' | 'modal',

    /**
    * Ссылка на rest
    */
    restUrl?: string,

    /**
    * Методы rest api
    * @example {}
    */
    restApi?: IApiRest,

    /**
    * Первичный ключ
    */
    primaryKey?: 'id' | string,

    /**
    * Ключ запроса
    * @example {}
    */
    queryKey?: 'id' | string,

    /**
    * Модель
    * @example {}
    */
    model?: string,

    /**
    * Модель используемая для поиска
    */
    searchModel?: string,

    /**
    * Параметры для колонки index
    */
    index?: boolean | ICrudItem,

    /**
    * Параметры для колонки create
    */
    create?: boolean | ICrudItem,

    /**
    * Параметры для колонки update
    */
    update?: boolean | ICrudItem,

    /**
    * Представление
    */
    view?: boolean | ICrudItem,

    /**
    * Параметры для колонки delete
    */
    delete?: boolean | ICrudItem,

    /**
    * Коллекция элементов
    */
    items?: ICrudItem[] | { [key: string]: ICrudItem };

    /**
    * Параметры Grid
    */
    grid?: IGridProps | React.ReactNode,

    /**
    * Параметры формы
    */
    form?: IFormProps | React.ReactNode,

    /**
    * Параметры для колонки detail
    */
    detail?: any, //TODO IDetailProps,

    /**
    * Представление для Crud
    */
    crudView?: CustomView,

    /**
    * Функция-обработчик ошибок
    * @param error - ошибка
    * @param dispatch - диспатч
    */
    errorHandler?: (error, dispatch: any) => void,

    [key: string]: any,
}

export interface ICrudChildrenProps extends ICrudProps {
    item?: any,
    recordId?: PrimaryKey,
    action?: string,
    routeId?: string,
    controlsGetter?: any,
    restUrl?: string,
    restApi?: IApiRest,
    onComplete?: () => void,
    form?: IFormProps,
    grid?: IGridProps,
}

const MODE_PAGE = 'page';
const MODE_MODAL = 'modal';

export interface ICrudViewProps {
    className?: CssClassName,
    controls?: IControlItem[],
    title?: string,
    children?: ReactNode,
}

function Crud(props: ICrudProps): JSX.Element {
    const components = useComponents();
    const dispatch = useDispatch();

    const {
        routeId,
        routeTitle,
        routeAction,
        routeParams,
        recordId,
    } = useSelector(state => routeInfoSelector(state, props.queryKey));

    // Normalize items
    const items = useMemo(
        () => normalizeItems(props.items, {
            index: props.index || props.grid,
            create: props.create || props.form,
            update: props.update || props.form,
            view: props.view,
            delete: props.delete,
        }),
        [props.create, props.delete, props.form, props.grid, props.index, props.items, props.update, props.view],
    );

    // Get crud id and mode
    const crudId = props.crudId || routeId;
    const mode = _get(items.find(item => item.actionName === routeAction), 'mode') || props.mode;

    const goToAction = useCallback((nextAction) => {
        if (nextAction === CRUD_ACTION_INDEX) {
            dispatch(listRefresh(crudId));
        }
        if (routeAction !== nextAction) {
            if (mode === MODE_MODAL) {
                dispatch(closeModal(crudId));
            }

            dispatch(goToRoute(routeId, {
                ...routeParams,
                [props.queryKey]: null,
                [props.queryKey + 'Action']: null,
            }));
        }
    }, [crudId, dispatch, mode, props.queryKey, routeAction, routeId, routeParams]);

    // Fetch record
    const {data: record, isLoading} = useFetch(
        useMemo(
            () => {
                if (recordId && props.restUrl) {
                    return {
                        method: 'get',
                        id: crudId + '_' + recordId,
                        url: props.restUrl + '/' + recordId,
                    };
                }
                if (recordId && props.restApi?.view) {
                    return {
                        id: crudId + '_' + recordId,
                        url: props.restApi.view,
                        params: {
                            [props.primaryKey]: recordId,
                        },
                    };
                }

                return null;
            },
            [recordId, props.restUrl, props.restApi, props.primaryKey, crudId],
        ),
    );

    // Props for click/confirm handlers
    const clickProps: ICrudClickProps = useMemo(() => ({
        crudId: props.crudId,
        mode: props.mode,
        restUrl: props.restUrl,
        restApi: props.restApi,
        primaryKey: props.primaryKey,
        queryKey: props.queryKey,
        routeId,
        routeAction,
        routeParams,
        recordId,
        record,
        components,
        goToAction,
        errorHandler: props.errorHandler,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [components, goToAction, props.crudId, props.mode, props.primaryKey, props.queryKey,
        props.restApi, props.restUrl, record, recordId, routeAction, routeId, routeParams]);

    // Handler for convert control item to props for button
    const itemsToControls = useCallback((localRecord, localRecordId, sourceItems) => (sourceItems || [])
        .map((crudItem: ICrudItem) => {
            const button: IControlItem = {
                ..._omit(crudItem, ['actionName', 'pkRequired', 'component', 'componentProps', 'visible', 'onClick']),
                confirm: typeof crudItem.confirm === 'string' ? crudItem.confirm : null,
            };
            const localClickProps: ICrudClickProps = {
                ...localRecord,
                record: localRecord || clickProps.record,
                recordId: localRecordId || clickProps.recordId,
            };

            if (crudItem.onClick) {
                button.onClick = e => {
                    // Custom confirm
                    if (typeof crudItem.confirm === 'function') {
                        const value = crudItem.confirm(e, localClickProps);
                        if (value === false || !window.confirm(value)) {
                            e.preventDefault();
                            return;
                        }
                    }

                    crudItem.onClick(e, {...clickProps, ...localClickProps});
                };
            } else {
                button.toRoute = routeId;
                button.toRouteParams = {
                    ...routeParams,
                    [props.queryKey]: crudItem.pkRequired ? localClickProps.recordId : undefined,
                    [props.queryKey + 'Action']: crudItem.actionName !== CRUD_ACTION_INDEX
                        ? crudItem.actionName
                        : undefined,
                };
            }

            return button;
        }), [clickProps, props.queryKey, routeId, routeParams]);

    // Props for CrudContent component
    const contentProps = useMemo(() => ({
        crudId,
        queryKey: props.queryKey,
        primaryKey: props.primaryKey,
        model: props.model,
        restUrl: props.restUrl,
        restApi: props.restApi,
        grid: props.grid,
        form: props.form,
        goToAction,
        items,
        itemsToControls,
        record,
        recordId,
    }), [crudId, props.queryKey, props.primaryKey, props.model, props.restUrl, props.restApi, props.grid,
        props.form, goToAction, items, itemsToControls, record, recordId]);

    // Open modal on route change
    useEffect(() => {
        if (mode === MODE_MODAL && routeAction !== CRUD_ACTION_INDEX) {
            dispatch(openModal(CrudModal, {
                modalId: crudId,
                action: routeAction,
                ...contentProps,
            }));
        }
    }, [contentProps, crudId, dispatch, mode, routeAction]);

    // Close modal on change mode
    useUpdateEffect(() => {
        if (mode !== MODE_MODAL) {
            dispatch(closeModal(crudId));
        }
    }, [crudId, dispatch, mode]);

    // Get page controls
    const controlsAction = mode === MODE_MODAL ? CRUD_ACTION_INDEX : routeAction;
    const controls = useMemo(() => itemsToControls(
        record,
        recordId,
        items
            .filter(crudItem => crudItem.visible !== false)
            .filter(crudItem => pageControlsMap[controlsAction]
                ? pageControlsMap[controlsAction].includes(crudItem.actionName)
                : controlsAction === CRUD_ACTION_INDEX && !crudItem.pkRequired),
    ), [items, itemsToControls, record, recordId, controlsAction]);

    return components.ui.renderView(props.crudView || 'crud.CrudView', {
        title: routeTitle,
        controls,
        children: (controlsAction === CRUD_ACTION_INDEX || !isLoading) && (
            //@ts-ignore
            <CrudContent
                {...contentProps}
                action={controlsAction}
            />
        ),
    });
}

Crud.defaultProps = {
    primaryKey: DEFAULT_PRIMARY_KEY,
    queryKey: DEFAULT_QUERY_KEY,
    mode: MODE_PAGE,
};

export default Crud;
