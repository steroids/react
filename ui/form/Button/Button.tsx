import * as React from 'react';
import {connect} from 'react-redux';
import {isSubmitting} from 'redux-form';
import {push} from 'connected-react-router';
import {components} from '../../../hoc';
import FieldLayout from '../FieldLayout';
import {getNavUrl} from '../../../reducers/navigation';
import {FormContext, IFormContext} from '../../../hoc/form';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IConnectHocOutput} from '../../../hoc/connect';

/**
 * Button
 * Кнопка или ссылка. Используется в интерфейсе для выполнения какого-либо действия по клику onClick),
 * смена страницы в рамках роутинга (goToPage), переход по внешней ссылке (url) или отправки формы (submit form)
 */
export interface IButtonProps {
    /**
     * Название поля
     * @example Save
     */
    label?: string | any;

    /**
     * HTML Тип
     * @example submit
     */
    type?: 'button' | 'submit';

    /**
     * Размер
     * @example sm
     */
    size?: Size;

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
    icon?: any;

    /**
     * Отображать индикатор загрузки?
     * @example true
     */
    isLoading?: boolean;

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
     * Ссылка (`path`) на страницу в рамках роутера SPA приложения, будет вызвано действие `push`
     * @example /profile/51
     */
    to?: string;

    /**
     * При указании данного свойства, после нажатия на кнопку и до выполнения действия будет отображено нативное
     * окно с текстом подтверждения - `window.confirm('Ваш текст')`.
     * @example Удалить запись #512?
     */
    confirm?: string;

    /**
     * Обработчик события нажатия. Для асинхронных событий вовзращяйте в обработчике `Promise`, тогда кнопка автоматически
     * будет переключаться в режим загрузки (`loading`) на время выполнения `Promise`.
     * @param e => fetch(...)
     */
    onClick?: (e: Event) => Promise<any> | void;

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

    /**
     * Дополнительные CSS классы
     * @example my-block
     */
    className?: string;

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
     * @example horizontal
     */
    layout?: FormLayout;

    /**
     * Дополнительные свойства, необходимые для макета формы. См. также свойство `layout`.
     * @example {}
     */
    layoutProps?: any;
}

export interface IButtonViewProps extends IButtonProps {
    isLoading: boolean,
    url?: string,
    formId: string,
    layout?: string,
    layoutProps?: object,
    size?: string,
    disabled?: boolean,
    onClick?: (e: Event) => void,
}

interface IButtonPrivateProps extends IConnectHocOutput, IComponentsHocOutput {
    submitting?: boolean;
}

type ButtonState = {
    isLoading?: boolean
};

@connect((state: any, props: any) => ({
    submitting: props.formId
        ? isSubmitting(props.formId)(state)
        : !!props.submitting,
    to: props.toRoute
        ? getNavUrl(state, props.toRoute, props.toRouteParams)
        : props.to
}))
@components('ui')
export default class Button extends React.PureComponent<IButtonProps & IButtonPrivateProps, ButtonState> {
    _isMounted: any;

    static defaultProps = {
        type: 'button',
        color: 'primary',
        outline: false,
        disabled: false,
        submitting: false,
        block: false,
        className: '',
    };

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            isLoading: this.props.isLoading,
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
        const layout = this.props.layout || context.layout;
        const layoutProps = {
            ...context.layoutProps,
            ...this.props.layoutProps,
        };
        const button = (
            <ButtonView
                {...this.props}
                isLoading={this.state.isLoading}
                url={
                    this.props.link && !(this.props.url || this.props.to)
                        ? '#'
                        : this.props.url || this.props.to
                }
                formId={context.formId}
                layout={context.layout}
                layoutProps={layoutProps}
                size={this.props.size || context.size}
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
                    layoutProps={layoutProps}
                    size={this.props.size}
                >
                    {button}
                </FieldLayout>
            );
        }
        return button;
    }

    _onClick(e) {
        e.stopPropagation();
        if (this.props.confirm && !confirm(this.props.confirm)) {
            e.preventDefault();
            return;
        }
        if (this.props.to || this.props.to === '') {
            this._onLinkClick(e, this.props.to);
        }
        if (this.props.onClick) {
            const result = this.props.onClick(e);
            if (result instanceof Promise) {
                this.setState({isLoading: true});
                result
                    .then(() => {
                        if (this._isMounted) {
                            this.setState({isLoading: false});
                        }
                    })
                    .catch(e => {
                        if (this._isMounted) {
                            this.setState({isLoading: false});
                        }
                        throw e;
                    });
            }
        }
    }

    _onLinkClick(e, url) {
        if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
            e.preventDefault();
            this.props.dispatch(push(url));
        }
    }
}
