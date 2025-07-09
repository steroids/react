/* eslint-disable consistent-return */
import * as React from 'react';
import {Link} from '../../../../src/ui/nav';
import {IHeaderViewProps} from '../../../../src/ui/layout/Header/Header';
import Nav from '../../../../src/ui/nav/Nav';
import {useBem, useDispatch} from '../../../../src/hooks';
import {Button} from '../../../../src/ui/form';
import Text from '../../../../src/ui/typography/Text/Text';
import Avatar from '../../../../src/ui/content/Avatar/Avatar';
import Icon from '../../../../src/ui/content/Icon/Icon';
import Menu from '../../../../src/ui/content/Menu/Menu';
import {openModal} from '../../../../src/actions/modal';
import {ILinkProps} from '../../../../src/ui/nav/Link/Link';

export default function HeaderView(props: IHeaderViewProps) {
    const bem = useBem('HeaderView');
    const dispatch = useDispatch();

    const renderAuthBlock = React.useCallback(() => (
        <Button
            outline
            color='basic'
            toRoute={props.auth}
            className={bem.element('auth-btn')}
            size={props.size}
            onClick={() => dispatch(openModal(props.authParams?.modal))}
        >
            {__('Войти')}
        </Button>

    ), [bem, dispatch, props.auth, props.authParams?.modal, props.size]);

    const renderUserBlock = React.useCallback(() => {
        if (!props.user) {
            return;
        }

        return (
            <div className={bem.element('menu')}>
                <Text className={bem.element('menu-name')}>{props.user?.name}</Text>
                <Menu
                    icon={(
                        <Avatar
                            size={props.size}
                            className={bem.element('menu-avatar')}
                            {...props.user?.avatar}
                        />
                    )}
                    {...props.user?.menu}
                />
            </div>
        );
    }, [bem, props.size, props.user]);

    const renderBurger = React.useCallback(() => (
        <div className={bem.element('burger')}>
            <Icon
                name={!props.isBurgerOpened ? 'burger' : 'cross_12x12'}
                className={bem.element('burger-icon')}
                onClick={props.toggleBurger}
            />
            <div className={bem.element('burger-menu', {
                isVisible: props.isBurgerOpened,
            })}
            >
                <ul className={bem.element('burger-list')}>
                    {props.burgerMenu?.links?.map((linkProps: ILinkProps, linkIndex) => (
                        <li
                            key={linkIndex}
                            className="burger-item"
                        >
                            <Link {...linkProps} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    ), [bem, props.burgerMenu?.links, props.isBurgerOpened, props.toggleBurger]);

    return (
        <header
            className={bem(
                bem.block({
                    size: props.size,
                }),
                props.className,
            )}
            style={props.style}
        >
            {props.logo && (
                <Link
                    className={bem.element('logo')}
                    toRoute='root'
                    size={props.size}
                    {...props.logo.linkProps}
                >
                    {props.logo.icon && (
                        <Icon
                            name="mockIcon"
                            className={bem.element('logo-image')}
                        />
                    )}
                    <span className={bem.element('logo-title')}>
                        {props.logo.title || ''}
                    </span>
                </Link>
            )}
            {props.nav && (
                <Nav
                    size={props.size}
                    layout='navbar'
                    className={bem.element('nav')}
                    {...props.nav}
                />

            )}
            <div className={bem.element('interaction')}>
                {props?.authParams?.isAuth ? renderAuthBlock() : renderUserBlock()}
                {props.burgerMenu && renderBurger()}
            </div>
            {props.children}
        </header>
    );
}
