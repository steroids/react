import * as React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useCallback, useContext, useMemo, useRef, useState} from 'react';
import FieldLayout from '../FieldLayout';
import {goToRoute} from '../../../actions/router';
import {buildUrl, getRouteProp} from '../../../reducers/router';
import {useComponents, useForm} from '../../../hooks';
import {FormContext, IFormContext} from '../Form/Form';
import {mergeLayoutProp} from '../../../utils/form';

interface IButtonBadge {
    enable?: boolean,
    value?: number,
    color?: ColorName,
    className?: CssClassName,
}

/**
 * Button
 * Кнопка или ссылка. Используется в интерфейсе для выполнения какого-либо действия по клику (onClick),
 * смена страницы в рамках роутинга (goToRoute), переход по внешней ссылке (url) или отправки формы (submit form)
 */
export interface IButtonProps {
    /**
     * Текст кнопки или ссылки
     * @example Save
     */
    label?: string | any;

    /**
     * Подсказка, отображается при наведении (через тег title)
     * @example Save
     */
    hint?: string | any;

    /**
     * HTML Тип
     * @example submit
     */
    type?: 'button' | 'submit';

    /**
     * Цвет состояния
     * @example success
     */
    color?: 'basic' | 'primary' | 'secondary' | 'info' | 'warning' | 'danger' | 'success';

    /**
     * Отображать как ссылку?
     * @example true
     */
    link?: boolean;

    /**
     * Иконка
     */
    icon?: string;

    /**
     * Цифра (к примеру, новые сообщения)
     */
    badge?: number | IButtonBadge;

    /**
     * Отображать индикатор загрузки?
     * @example true
     */
    isLoading?: boolean;

    /**
     * Отобразить кнопку в состоянии неуспешного нажатия (например, при неуспешном ajax запросе)
     * @example true
     */
    isFailed?: boolean;

    /**
     * Через сколько миллисекунд должно исчезнуть состояние "failed"
     * @example 5000
     */
    resetFailedMs?: number,

    /**
     * Включает стиль `outline`, когда у кнопки остается только `border`, а цвет кнопки становится прозрачным
     * @example true
     */
    outline?: boolean;

    /**
     * HTML аттрибут `target`, доступен только для ссылок
     * @example _blank
     */
    target?: string;

    /**
     * Ссылка на внешнюю страницу, используется совместно с свойством `link`
     * @example https://ya.ru
     */
    url?: string;

    /**
     * При указании данного свойства, после нажатия на кнопку и до выполнения действия будет отображено нативное
     * окно с текстом подтверждения - `window.confirm('Ваш текст')`.
     * @example Удалить запись #512?
     */
    confirm?: string;

    /**
     * Обработчик события нажатия. Для асинхронных событий вовзращяйте в обработчике `Promise`, тогда кнопка
     * автоматически будет переключаться в режим загрузки (`loading`) на время выполнения `Promise`.
     * @param e => fetch(...)
     */
    onClick?: (e: Event | React.MouseEvent) => Promise<any> | any;

    /**
     * Переводит кнопку в состояние "не активна"
     * @example true
     */
    disabled?: boolean;

    /**
     * Включает стиль `block`, делая размер кнопки на 100% ширины блока
     * @example true
     */
    block?: boolean;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    /**
     * Дополнительный CSS-класс для кнопки или ссылки
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: React.ComponentType;

    /**
     * Вложенные элементы
     */
    children?: string | any,

    /**
     * ID роута, на который необходимо перейти, указанный в дереве `steroids` роутинга. Для передачи параметров
     * используйте свойство `toRouteParams`
     * @example profile
     */
    toRoute?: string;

    /**
     * Параметры роута, на который необходимо перейти, см. свойство `toRoute`.
     * @example {userId: 52}
     */
    toRouteParams?: Record<string, unknown>;

    /**
     * Выбор макета для распложения кнопки в форме. Если кнопка находится внутри `<Form>...</Form>`, то `layout` будет
     * взят из контекста формы и автоматически применен при отораженн. Для его отключения укажите `false`.
     * Данное свойство так же может принимать объект, если нужно прокинуть дополнительные свойства в шаблон макета.
     * Пример: `{layout: 'horizontal', cols: [2,6]}`
     * @example horizontal
     */
    layout?: FormLayout;

    /**
     * ID формы, для которой кнопка выполняет submit. При указании ID формы кнопка будет показывать состояние загрузки
     * при отправке формы.
     */
    formId?: string | boolean,

    /**
     * Выбор html-тэга, который будет вставлен в DOM
     * @example button
     */
    tag?: 'button' | 'a',

    /**
     * Размер
     */
    size?: Size,

    /**
     * Темная тема
     */
    dark?: boolean,

    /**
     * Цвет текста кнопки или ссылки
     */
    textColor?: any,

    /**
     * Толщина шрифта кнопки
     */
    fontThickness?: 'regular' | 'bold',

    [key: string]: any;
}

export interface IButtonViewProps extends IButtonProps {
    badge?: IButtonBadge,
    url?: string,
    formId?: string,
    layout?: string,
    disabled?: boolean,
    onClick?: any,
    submitting?: boolean,
}

function Button(props: IButtonProps): JSX.Element {
    const components = useComponents();
    const dispatch = useDispatch();

    // Badge
    const badge = useMemo(() => ({
        ...Button.defaultProps.badge,
        enable: !!props.badge || props.badge === 0,
        ...(typeof props.badge === 'object' ? props.badge : {value: props.badge}),
    }), [props.badge]);

    // Route -> url
    const routePath = useSelector(state => props.toRoute ? getRouteProp(state, props.toRoute, 'path') : null);
    const url = typeof props.url !== 'undefined'
        ? props.url
        : (routePath ? buildUrl(routePath, props.toRouteParams) : null);

    // Flags: isLoading, isFailed
    const [{isLoading, isFailed}, setStateFlags] = useState({isLoading: false, isFailed: false});
    React.useEffect(() => {
        setStateFlags({isLoading: props.isLoading, isFailed: props.isFailed});
    }, [props.isLoading, props.isFailed]);

    // Form submitting
    const context: IFormContext = useContext(FormContext);
    const form = useForm();
    // eslint-disable-next-line react/prop-types
    let submitting = !!props.submitting;
    if (form) {
        submitting = form.formSelector(state => state.isSubmitting);
    }

    const disabled = submitting || props.disabled;
    const tag = props.tag || (props.link || url ? 'a' : 'button');
    const layout = useMemo(() => mergeLayoutProp(context.layout, props.layout), [context.layout, props.layout]);

    const failedTimer = useRef(null);
    const onClick = useCallback((e) => {
        e.stopPropagation();

        if (process.env.IS_WEB && props.confirm && !window.confirm(props.confirm)) {
            e.preventDefault();
            return;
        }

        if (tag === 'a' && (props.toRoute || props.onClick)) {
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
                e.preventDefault();
            }
        }

        if (props.toRoute) {
            //TODO remove @ts-ignore
            //@ts-ignore
            dispatch(goToRoute(props.toRoute, props.toRouteParams));
        }

        if (props.onClick) {
            const result = props.onClick(e);
            if (result instanceof Promise) {
                setStateFlags({
                    isLoading: true,
                    isFailed: false,
                });

                if (failedTimer.current) {
                    clearTimeout(failedTimer.current);
                }

                result
                    .then(() => {
                        // timeout is set to assure that the user will see loading state
                        setTimeout(() => {
                            setStateFlags({
                                isLoading: false,
                                isFailed: false,
                            });
                        }, 500);
                    })
                    .catch(error => {
                        setStateFlags({
                            isLoading: false,
                            isFailed: props.resetFailedMs > 0,
                        });

                        if (props.resetFailedMs > 0) {
                            failedTimer.current = setTimeout(() => {
                                setStateFlags({
                                    isLoading: false,
                                    isFailed: false,
                                });
                            }, props.resetFailedMs);
                        }
                        throw error;
                    });
            }
        }
    }, [dispatch, props, tag]);

    const button = components.ui.renderView(props.view || 'form.ButtonView', {
        ...props,
        badge,
        layout,
        isFailed,
        isLoading,
        disabled,
        submitting,
        tag,
        formId: context?.formId || null,
        url: url || (tag === 'a' ? '#' : null),
        onClick: !disabled ? onClick : undefined,
        children: props.label || props.children,
    });

    if (layout) {
        return (
            <FieldLayout layout={layout}>
                {button}
            </FieldLayout>
        );
    }

    return button;
}

Button.defaultProps = {
    type: 'button',
    color: 'primary',
    outline: false,
    disabled: false,
    submitting: false,
    block: false,
    size: 'md',
    className: '',
    resetFailedMs: 2000,
    fontThickness: 'regular',
    badge: {
        enable: false,
        value: 0,
        color: 'secondary',
    },
};

export default Button;
