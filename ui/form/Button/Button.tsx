import * as React from 'react';
import _isNumber from 'lodash-es/isNumber';
import {connect} from 'react-redux';
import {isSubmitting} from 'redux-form';
import {components} from '../../../hoc';
import FieldLayout from '../FieldLayout';
import {FormContext, IFormContext, mergeLayoutProp} from '../../../hoc/form';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IConnectHocOutput} from '../../../hoc/connect';
import normalize from '../../../hoc/normalize';
import {goToRoute} from "../../../actions/router";
import {buildUrl, getRouteProp} from '../../../reducers/router';

interface IButtonBadge {
    enable?: boolean,
    value?: number,
    color?: ColorName,
    className?: CssClassName,
}

/**
 * Button
 * Кнопка или ссылка. Используется в интерфейсе для выполнения какого-либо действия по клику onClick),
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
     * Должна ли показываться надпись на кнопке в состоянии загрузки
     * @example true
     */
    showLabelOnLoading?: Boolean;

    /**
     * HTML Тип
     * @example submit
     */
    type?: 'button' | 'submit';

    /**
     * Цвет состояния
     * @example success
     */
    color?: ColorName;

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
    onClick?: (e: Event | React.MouseEvent) => Promise<any> | void;

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
    style?: object;

    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизациии отображения
     * @example MyCustomView
     */
    view?: React.ComponentType;

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
    toRouteParams?: object;

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
    formId?: string,

    tag?: 'button' | 'a',

    /**
     * Размер
     */
    size?: Size,

    /**
     * Темная тема
     */
    dark?: boolean,

    textColor?: any,
}

export interface IButtonViewProps extends IButtonProps {
    _badge?: IButtonBadge,
    url?: string,
    formId?: string,
    layout?: string,
    disabled?: boolean,
    onClick?: any,
    submitting?: boolean,
    showLabelOnLoading: boolean,
}

interface IButtonPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
    _badge?: IButtonBadge,
    submitting?: boolean;
}

type ButtonState = {
    isLoading?: boolean
    isFailed?: boolean
};

const defaultProps = {
    type: 'button',
    color: 'primary',
    outline: false,
    disabled: false,
    submitting: false,
    block: false,
    className: '',
    resetFailedMs: 2000,
    showLabelOnLoading: true,
    badge: {
        enable: false,
        value: 0,
        color: 'secondary',
    },
};

@connect(
    (state, props) => {
        let url;
        if (props.toRoute) {
            url = buildUrl(getRouteProp(state, props.toRoute, 'path'), props.toRouteParams)
        }

        return {
            url: typeof props.url !== 'undefined' ? props.url : url,
            submitting: props.formId
                ? isSubmitting(props.formId)(state)
                : !!props.submitting,
        };
    }
)
@normalize({
    fromKey: 'badge',
    toKey: '_badge',
    normalizer: badge => ({
        ...defaultProps.badge,
        enable: !!badge || badge === 0,
        ...(_isNumber(badge) ? {value: badge} : badge),
    }),
})
@components('ui')
export default class Button extends React.PureComponent<IButtonProps & IButtonPrivateProps, ButtonState> {

    static defaultProps = defaultProps;

    _isMounted: any;
    _failedTimer: any;

    constructor(props) {
        super(props);

        this._isMounted = false;
        this._failedTimer = null;

        this.state = {
            isLoading: this.props.isLoading,
            isFailed: this.props.isFailed,
        };

        this._onClick = this._onClick.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate(prevProps: Readonly<IButtonProps & IButtonPrivateProps>) {
        if (prevProps.isLoading !== this.props.isLoading) {
            this.setState({isLoading: this.props.isLoading});
        }
        if (prevProps.isFailed !== this.props.isFailed) {
            this.setState({isFailed: this.props.isFailed});
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <FormContext.Consumer>
                {context => this.renderContent(context)}
            </FormContext.Consumer>
        );
    }

    renderContent(context: IFormContext) {
        const ButtonView = this.props.view || this.props.ui.getView('form.ButtonView');
        const disabled = this.props.submitting || this.props.disabled || this.state.isLoading;
        const layout = mergeLayoutProp(context.layout, this.props.layout);
        const tag = this.props.tag || (this.props.link || this.props.url ? 'a' : 'button');

        const button = (
            <ButtonView
                {...this.props}
                tag={tag}
                isFailed={this.state.isFailed}
                isLoading={this.state.isLoading || this.props.submitting}
                url={this.props.url || (tag === 'a' ? '#' : null)}
                formId={context.formId}
                layout={layout}
                disabled={disabled}
                onClick={!disabled ? this._onClick : undefined}
            >
                {this.props.label || this.props.children}
            </ButtonView>
        );

        if (context.formId && layout !== false) {
            return (
                <FieldLayout
                    {...this.props}
                    label={null}
                    layout={layout}
                >
                    {button}
                </FieldLayout>
            );
        }
        return button;
    }

    _onClick(e) {
        e.stopPropagation();
        if (process.env.PLATFORM === 'web' && this.props.confirm && !confirm(this.props.confirm)) {
            e.preventDefault();
            return;
        }
        if (this.props.toRoute) {
            this._onLinkClick(e);
        }
        if (this.props.onClick) {
            const result = this.props.onClick(e);
            if (result instanceof Promise) {
                this.setState({
                    isLoading: true,
                    isFailed: false,
                });
                if (this._failedTimer) {
                    clearTimeout(this._failedTimer);
                }

                result
                    .then(() => {
                        if (this._isMounted) {
                            // timeout is set to assure that the user will see loading state
                            setTimeout(() => this.setState({isLoading: false}), 800);
                        }
                    })
                    .catch(e => {
                        if (this._isMounted) {
                            this.setState({
                                isLoading: false,
                                isFailed: this.props.resetFailedMs > 0,
                            });

                            if (this.props.resetFailedMs > 0) {
                                this._failedTimer = setTimeout(() => {
                                    this.setState({isFailed: false});
                                }, this.props.resetFailedMs);
                            }
                        }
                        throw e;
                    });
            }
        }
    }

    _onLinkClick(e) {
        if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
            e.preventDefault();
            this.props.dispatch(goToRoute(this.props.toRoute, this.props.toRouteParams));
        }
    }
}
