import * as React from 'react';
import Button from '../../form/Button';
import {IButtonProps, IButtonViewProps} from '../../form/Button/Button';

/**
 * Link
 *
 * С помощью компонента `Link` вы можете легко настраивать цветовую схему элементов ссылок.
 */
export interface ILinkProps extends IButtonProps {
    [key: string]: any,
}

export type ILinkViewProps = IButtonViewProps

export default function Link(props: ILinkProps): JSX.Element {
    return (
        <Button
            tag='a'
            link
            color='link'
            {...props}
            formId={false}
        />
    );
}
