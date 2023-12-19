import * as React from 'react';
import {Text} from '../../../../../../../../../../src/ui/typography';

interface ILabelProps {
    content: string,
    className: string,
}

export default function Label(props: ILabelProps) {
    return (
        <Text
            type='body2'
            content={props.content}
            color="light-dark"
        />
    );
}
