import React from 'react';
import {useBem} from '../../../../src/hooks';
import {ICardViewProps} from '../../../../src/ui/content/Card/Card';
import {Button} from '../../../../src/ui/form';
import Avatar from '../../../../src/ui/content/Avatar/Avatar';
import Icon from '../../../../src/ui/content/Icon';
import IconMockView from '../Icon/IconMockView';

export default function CardView(props: ICardViewProps) {
    const bem = useBem('CardView');

    const hasContent = props.title || props.buttons || props.links || props.description;

    return (
        <div
            className={bem(bem.block(),
                props.className)}
            style={props.style}
        >
            {props.header && (
                <div className={bem.element('header')}>
                    <div className={bem.element('header-data')}>
                        {props.header.avatar && <Avatar {...props.header.avatar} />}
                        <div className={bem.element('header-text-content')}>
                            <h3 className={bem.element('header-head')}>
                                {props.header.head}

                            </h3>
                            <div className={bem.element('header-subhead')}>
                                {props.header.subhead}

                            </div>
                        </div>
                    </div>
                    {props.header.menu && (
                        <div
                            className={bem.element('header-menu')}
                            role='button'
                        >
                            <Icon
                                view={IconMockView}
                                name='mockIcon'
                                className={bem.element('header-dots')}
                            />
                        </div>
                    )}
                </div>
            )}
            {props.cover && (
                <div className={bem.element('cover')}>
                    <img
                        src={props.cover}
                        alt='Card cover img'
                    />
                </div>
            )}
            {hasContent && (
                <div className={bem.element('content')}>
                    {props.title && (
                        <h3 className={bem.element('title')}>
                            {props.title}
                        </h3>
                    )}
                    <div className={bem.element('content-inner')}>
                        {props.description && (
                            <div className={bem.element('description')}>
                                {props.description}
                            </div>
                        )}
                        {props.buttons && (
                            <div className={bem.element('buttons')}>
                                {props.buttons.map((button, buttonIndex) => (
                                    <Button
                                        {...button}
                                        key={buttonIndex}
                                    />
                                ))}
                            </div>
                        )}
                        {props.links && (
                            <div className={bem.element('links')}>
                                {props.links.map((link, linkIndex) => (
                                    <Button
                                        link
                                        key={linkIndex}
                                        url={link.url}
                                        label={link.text}
                                        target={link.target}
                                        hint={link.title}
                                        className={bem.element('links-item')}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {props.footer && (
                <div className={bem.element('footer')}>
                    <h3 className={bem.element('footer-head')}>{props.footer.head}</h3>
                    <div className={bem.element('footer-subhead')}>{props.footer.subhead}</div>
                </div>
            )}
        </div>
    );
}
