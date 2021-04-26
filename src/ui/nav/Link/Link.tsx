import * as React from 'react';
import Button from '../../form/Button';
import {IButtonProps, IButtonViewProps} from '../../form/Button/Button';

/**
 * Link
 * Ссылка
 */
export interface ILinkProps extends IButtonProps {
    [key: string]: any,
}

export type ILinkViewProps = IButtonViewProps

export default function Link(props: ILinkProps) {
    return (
        <Button
            tag='a'
            link
            {...props}
            formId={false}
        />
    );
}
