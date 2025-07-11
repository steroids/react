import {createElement} from 'react';
import {useBem} from '../../../../src/hooks';
import {ITitleViewProps} from '../../../../src/ui/typography/Title/Title';

interface ITitleMockViewProps extends ITitleViewProps {
    testId: string,
}

const TYPE_MAPPING = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle: 'h6',
};

export default function TitleView(props: ITitleMockViewProps) {
    const bem = useBem('TitleView');
    const tag = props.tag || TYPE_MAPPING[props.type!] || 'h2';

    return createElement(
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
    );
}
