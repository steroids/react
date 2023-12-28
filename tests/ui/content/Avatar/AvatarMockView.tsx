import React from 'react';
import {IAvatarViewProps} from '../../../../src/ui/content/Avatar/Avatar';
import {useBem} from '../../../../src/hooks';

interface IAvatarProps extends IAvatarViewProps {
    formattedTitle: any,
    testId: string,
    bodyTestId: string,
}

export default function Avatar(props: IAvatarProps) {
    const bem = useBem('AvatarView');

    const customSize: React.CSSProperties = typeof props.size === 'number'
        ? {
            width: props.size,
            height: props.size,
            lineHeight: `${props.size}px`,
            fontSize: props.size / 2,
        }
        : {};

    const renderImage = () => (
        (props.isError && (
            <span>
                {props.formattedTitle}
            </span>
        )) || (
            <img
                alt={props.alt}
                src={props.src}
                title={props.title}
                srcSet={props.srcSet}
                onError={props.onError}
            />
        )
    );

    return (
        <div
            data-testid={props.testId}
            className={bem(bem.block({
                size: props.size,
                shape: props.shape,
                'has-image': !!props.src && !props.isError,
                'has-status': props.status,
                'has-border': props.hasBorder,
                'has-custom-status': props.status && !!customSize.width,
            }), props.className)}
        >
            <span
                className={bem.element('body')}
                style={{
                    ...props.style,
                    ...customSize,
                }}
                data-testid={props.bodyTestId}
            >
                {(props.src && renderImage()) || (
                    <span>
                        {props.formattedTitle}
                        {props.children}
                    </span>
                )}
            </span>
        </div>
    );
}
