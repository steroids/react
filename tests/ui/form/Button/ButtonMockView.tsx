import * as React from 'react';
import _isString from 'lodash-es/isString';

import Icon from '../../../../src/ui/content/Icon';
import {IButtonViewProps} from '../../../../src/ui/form/Button/Button';
import {useBem} from '../../../../src/hooks';
import {IBemHocOutput} from '../../../../src/hoc/bem';
import IconMockView from '../../content/Icon/IconMockView';

export default function ButtonView(props: IButtonViewProps & IBemHocOutput) {
    const bem = useBem('ButtonView');

    const renderLabel = () => {
        const title = props.label && _isString(props.label)
            ? props.label
            : (props.hint || null);

        return (
            <>
                {props.isLoading && (
                    <Icon
                        view={IconMockView}
                        className={bem.element('loader')}
                        name='mockIcon'
                    />
                )}
                {!props.isLoading && (
                    <span
                        className={bem.element('label')}
                    >
                        {props.icon && (
                            <Icon
                                view={IconMockView}
                                name={props.icon}
                                title={title}
                                className={bem.element('icon', !props.label && 'without-label')}
                            />
                        )}
                        {props.children}
                    </span>
                )}
            </>
        );
    };

    const renderBadge = () => {
        if (!props.badge || !props.badge.enable) {
            return null;
        }

        return (
            <span
                className={bem(
                    'badge',
                    props.badge.color && `badge-${props.badge.color}`,
                    bem.element('badge'),
                    props.badge.className,
                )}
            >
                {props.badge.value}
            </span>
        );
    };

    const className = bem(
        bem.block({
            button: !props.link,
            [`color_${props.color}`]: props.color && !props.outline,
            [`outline_${props.color}`]: props.outline,
            outline: props.outline,
            size: props.size,
            disabled: props.disabled,
            submitting: props.submitting,
            loading: !!props.isLoading,
            failed: props.isFailed,
            link: props.tag === 'a',
            thickness: props.fontThickness,
        }),
        props.block && 'btn-block',
        props.link && 'btn-link',
        props.className,
    );

    if (props.tag === 'a') {
        return (
            <a
                className={className}
                href={props.url}
                onClick={props.onClick}
                style={props.style}
                target={props.target}
            >
                {renderLabel()}
                {renderBadge()}
            </a>
        );
    }

    return (
        <button
            title={props.hint}
            type={props.type}
            disabled={props.disabled}
            onClick={props.onClick}
            style={props.style}
            className={className}
        >
            {renderLabel()}
            {renderBadge()}
        </button>
    );
}
