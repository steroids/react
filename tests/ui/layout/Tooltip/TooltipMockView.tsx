import * as React from 'react';
import {useEffect, useRef} from 'react';
import {ITooltipViewProps} from '../../../../src/ui/layout/Tooltip/Tooltip';
import {useBem} from '../../../../src/hooks';

interface ITooltipMockViewProps extends ITooltipViewProps {
    testId: string,
}

export default function TooltipView(props: ITooltipMockViewProps) {
    const tooltipRef = useRef(null);
    const arrowRef = useRef(null);

    useEffect(() => {
        //@ts-ignore
        props.calculatePosition(
            //@ts-ignore
            tooltipRef.current.getBoundingClientRect(),
            //@ts-ignore
            arrowRef.current.getBoundingClientRect(),
        );
    }, [props.calculatePosition]);

    const bem = useBem('TooltipView');
    return (
        <div
            data-testid='tooltip-test'
            ref={tooltipRef}
            className={bem.block({
                show: props.isTooltipVisible,
                position: props.position,
            })}
            style={props.style}
        >
            <div
                ref={arrowRef}
                className={bem.element(
                    'arrow',
                    {position: props.position},
                )}
                style={props.arrowPosition}
            />
            <div className={bem.element('content')}>
                <span>{props.content}</span>
            </div>
        </div>
    );
}
