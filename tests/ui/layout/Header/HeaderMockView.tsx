import * as React from 'react';

import {Link} from '../../../../src/ui/nav';
import {IHeaderViewProps} from '../../../../src/ui/layout/Header/Header';
import Nav from '../../../../src/ui/nav/Nav';
import {useBem} from '../../../../src/hooks';
import {Button} from '../../../../src/ui/form';
import Text from '../../../../src/ui/typography/Text/Text';
import Avatar from '../../../../src/ui/content/Avatar/Avatar';
import Icon from '../../../../src/ui/content/Icon/Icon';

export default function HeaderView(props: IHeaderViewProps) {
    const bem = useBem('HeaderView');
    return (
        <header
            className={bem(
                bem.block(),
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
                            name='mockIcon'
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
                    {...props.nav}
                />
            )}
            {props.auth && (typeof props.auth === 'string'
                ? (
                    <Button
                        outline
                        color='basic'
                        toRoute={props.auth}
                        className={bem.element('auth-btn')}
                        size={props.size}
                    >
                        {__('Войти')}
                    </Button>
                )
                : (
                    <div className={bem.element('user')}>
                        <Text className={bem.element('user-name')}>{props.auth?.username}</Text>
                        <Avatar
                            {...props.auth?.userAvatar}
                            className={bem.element('user-avatar')}
                            size={props.size}
                        />
                    </div>
                ))}
            {props.children}
        </header>
    );
}
