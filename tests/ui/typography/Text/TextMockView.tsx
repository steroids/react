import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import {ITextViewProps} from '../../../../src/ui/typography/Text/Text';

interface ITextMockViewProps extends ITextViewProps {
    testId: string,
}

const TYPE_MAPPING = {
    body: 'p',
    span: 'span',
    boldSpan: 'span',
};

export default function TextView(props: ITextMockViewProps) {
    const bem = useBem('TextView');
    const tag = props.tag || TYPE_MAPPING[props.type!] || 'p';

    return (
        React.createElement(
            tag,
            {
                className: bem(
                    bem.block({
                        type: props.type,
                        color: props.color,
                    }),
                    props.className,
                ),
                style: props.style,
                'data-testid': props.testId,
            },
            <>
                {props.content}
                {props.children}
            </>,
        )
    );
}
