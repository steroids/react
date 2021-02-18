import * as React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {initialize} from 'redux-form';
import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';
import * as queryString from 'qs';
import {useCallback, useMemo, useReducer} from 'react';
import {useEffectOnce, useMount, usePrevious, useUpdateEffect} from 'react-use';
import {IFormSubmitHocInput} from '../../../hoc/formSubmit';
import AutoSaveHelper from './AutoSaveHelper';
import SyncAddressBarHelper from './SyncAddressBarHelper';
import {IFieldProps} from '../Field/Field';
import {useComponents} from '../../../hooks';
import {formInitialize} from '../../../actions/form';
import {reducerItem} from '../../../reducers/form';

export interface IFormProps extends IFormSubmitHocInput {
    formId?: string;
    prefix?: string;
    model?: string | ((...args: any[]) => any) | any;

    /**
     * Url на который будет отправлена форма
     * @example api/v1/handle-form
     */
    action?: string;

    /**
     * Тип HTTP запроса (GET | POST | PUT | DELETE)
     * @example POST
     */
    actionMethod?: string;
    layout?: FormLayout;

    /**
     * Обработчик события отправки формы
     * @param args
     */
    onSubmit?: (...args: any[]) => any;
    validators?: any[];

    /**
     * Обработчик события перед отправкой формы
     * @param args
     */
    onBeforeSubmit?: (...args: any[]) => any;

    /**
     * Обработчик события после отправки формы
     * @param args
     */
    onAfterSubmit?: (...args: any[]) => any;

    /**
     * Обработчик события при каком-либо изменении в форме
     * @param args
     */
    onChange?: (...args: any[]) => any;

    /**
     * Обработчик успешного выполнения формы (без ошибок)
     * @param args
     */
    onComplete?: (...args: any[]) => any;

    /**
     * Автоматически стартовать 2fa аутентификацию (отправлять код)
     */
    autoStartTwoFactor?: boolean,

    /**
     * Обработчик, который вызывается при запросе 2FA
     */
    onTwoFactor?: (providerName: string, info?: any) => Promise<any> | any | void,

    autoSave?: boolean,

    /**
     * Начальные значения формы
     */
    initialValues?: any | any[];
    className?: CssClassName;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    view?: CustomView;
    fields?: (string | IFieldProps)[],

    /**
     * Использовать для данных глобальное хранилище (redux)
     * @example true
     */
    globalState?: boolean,

    /**
     * Надпись на конпке отправки формы
     * @example Submit
     */
    submitLabel?: string;
    syncWithAddressBar?: boolean;
    restoreCustomizer?: (...args: any[]) => any; // TODO Refactor it!
    useHash?: boolean; // TODO Refactor it!
    autoFocus?: boolean;

    [key: string]: any;
}

export interface IFormViewProps {
    submitLabel?: string;
    fields?: (string | IFieldProps)[],
    onSubmit: any,
    className?: CssClassName,
    layout?: {
        layout: FormLayoutName | boolean,
        className: CssClassName,
        label: boolean,
        cols: number[],
        [key: string]: any,
    },
    children?: React.ReactNode,
}

interface IFormReducerState {
    values: any,
    initialValues: any,
    errors: any,
    isInvalid: boolean,
    isSubmitting: boolean,
}

export interface IFormContext {
    formId?: string;
    model?: any;
    prefix?: string | boolean;
    layout?: FormLayout;
    globalState?: boolean,
    reducer?: any,
}

/* @formSubmit()*/

// Data providers
const reactReducerProvider = (initialValues = {}) => {
    // React reducer
    const initialState: IFormReducerState = useMemo(() => ({ // eslint-disable-line react-hooks/rules-of-hooks
        values: initialValues ? _cloneDeep(initialValues) : {},
        initialValues,
        errors: {},
        isInvalid: false,
        isSubmitting: false,
    }), [initialValues]);
    const reducer = useReducer(reducerItem, initialState); // eslint-disable-line react-hooks/rules-of-hooks

    const [state] = reducer;
    return {
        values: state.values,
        isInvalid: state.isInvalid,
        isSubmitting: state.isSubmitting,
        reducer,
    };
};
const reduxProvider = (formId, initialValues) => {
    const dispatch = useDispatch(); // eslint-disable-line react-hooks/rules-of-hooks
    useEffectOnce(() => { // eslint-disable-line react-hooks/rules-of-hooks
        dispatch(formInitialize(formId, initialValues));
    });
    return {
        ...useSelector(state => ({ // eslint-disable-line react-hooks/rules-of-hooks
            values: _get(state, ['form', formId, 'values']) || initialValues,
            isInvalid: _get(state, ['form', formId, 'isInvalid']),
            isSubmitting: _get(state, ['form', formId, 'isSubmitting']),
        })),
        reducer: null,
    };
};

export const normalizeLayout = layout => (typeof layout === 'object' ? layout : {layout});

export default function Form(props: IFormProps) {
    // Get components and dispatch method
    const components = useComponents();
    const dispatch = useDispatch();

    let initialValues = props.initialValues;

    // Dev validation. You cannot change data provider (formId, globalState)
    if (process.env.NODE_ENV !== 'production') {
        const prevFormId = usePrevious(props.formId); // eslint-disable-line react-hooks/rules-of-hooks
        const prevGlobalState = usePrevious(props.globalState); // eslint-disable-line react-hooks/rules-of-hooks
        if ((prevFormId && props.formId !== prevFormId) || (prevGlobalState && props.globalState !== prevGlobalState)) {
            throw new Error('Props formId and globalState cannot be changed dynamically! Its related to data provider');
        }
    }

    // Restore initial state from address bar
    const locationSearch = useSelector(state => _get(state, 'router.location.search', ''));
    if (props.syncWithAddressBar) {
        initialValues = SyncAddressBarHelper.restore(
            {
                ...props.initialValues,
                ...SyncAddressBarHelper.cleanValues(queryString.parse(locationSearch)),
            },
            props.restoreCustomizer,
        );
    }

    // Resolve data provider
    const {
        values,
        isInvalid,
        isSubmitting,
        reducer,
    } = props.globalState
        ? reduxProvider(props.formId, initialValues)
        : reactReducerProvider(initialValues);

    // Sync with address bar
    useUpdateEffect(() => {
        if (props.syncWithAddressBar) {
            const page = Number(_get(values, 'page', 1));
            SyncAddressBarHelper.save(
                components.store,
                SyncAddressBarHelper.cleanValues({
                    ...values,
                    page: page > 1 && page,
                }),
                props.useHash,
            );
        }
    }, [props.syncWithAddressBar, props.useHash, values]);

    // Normalize layout
    const layout = useMemo(() => normalizeLayout(props.layout), [props.layout]);

    // Auto focus
    useMount(() => {
        if (props.autoFocus && process.env.IS_WEB) {
            // TODO
            /*const element: any = findDOMNode(this);
            const inputEl = element.querySelector('input:not([type=hidden])');
            setTimeout(() => {
                if (inputEl && inputEl.focus) {
                    inputEl.focus();
                }
            }, 10);*/
        }
    });

    // Auto save
    useMount(() => {
        // Restore values from query, when autoSave flag is set
        if (props.autoSave) {
            const restoreValues = AutoSaveHelper.restore(
                props.clientStorage,
                props.formId,
                props.initialValues,
            );
            if (restoreValues) {
                dispatch(initialize(props.formId, restoreValues));
            }
        }
    });
    useUpdateEffect(() => {
        if (props.autoSave && values) {
            AutoSaveHelper.save(components.clientStorage, props.formId, values);
        }
    }, [props.autoSave, values]);

    // OnChange handler
    useUpdateEffect(() => {
        if (props.onChange) {
            props.onChange(values);
        }
    }, [values]);

    // OnSubmit handler
    const onSubmit = useCallback(() => {
        // TODO
    }, []);

    // Render context and form
    let content = useMemo(() => (
        <FormContext.Provider
            value={{
                formId: props.formId,
                model: props.model,
                prefix: props.prefix,
                layout: props.layout,
                globalState: props.globalState,
            }}
        >
            {components.ui.renderView(props.view || 'form.FormView', {
                isInvalid,
                isSubmitting,
                layout,
                onSubmit,
                children: props.children,
            })}
        </FormContext.Provider>
    ), [
        props.view,
        props.children,
        props.model,
        props.prefix,
        props.layout,
        isInvalid,
        isSubmitting,
        layout,
        onSubmit,
    ]);

    // Wrap with reducer provider, if need
    if (!props.globalState) {
        content = (
            <FormReducerContext.Provider value={reducer}>
                {content}
            </FormReducerContext.Provider>
        );
    }
    return content;
}
