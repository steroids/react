import {useCallback} from 'react';

import {IPaginationViewProps} from '../../../../src/ui/list/Pagination/Pagination';
import {useBem} from '../../../../src/hooks';
import {Icon} from '../../../../src/ui/content';
import IconMockView from '../../content/Icon/IconMockView';

export default function PaginationButtonView(props: IPaginationViewProps) {
    const bem = useBem('PaginationButtonView');

    const renderArrowStep = useCallback((
        onClick: () => void,
        iconName: string,
        rotate = false,
        rounding?: {
            left?: boolean,
            right?: boolean,
        },
        disabledStatement?: boolean,
    ) => (
        <li className={bem.element('page', {
            'rounding-left': !!rounding?.left,
            'rounding-right': !!rounding?.right,
            hasIcon: true,
            disabled: disabledStatement,
        })}
        >
            <button
                className={bem.element('page-button',
                    {
                        hasIcon: true,
                    })}
                onClick={() => onClick()}
            >
                <Icon
                    view={IconMockView}
                    tabIndex={-1}
                    className={bem.element('page-icon', {
                        rotate,
                    })}
                    name="mockIcon"
                />
            </button>
        </li>
    ), [bem]);

    return (
        <ul
            className={bem(
                bem.block({
                    size: props.size,
                }),
                props.className,
            )}
        >
            {props.showEdgeSteps
                && renderArrowStep(props.onSelectFirst, 'double-arrow-left', false, {left: true}, props.isFirstPage)}
            {props.showSteps
                && renderArrowStep(props.onSelectPrev, 'arrow-left', false, {}, props.isFirstPage)}
            {props.pages.map((item, index) => (
                <li
                    key={index}
                    className={bem.element('page', {
                        hidden: !item.page,
                        active: item.isActive,
                    })}
                >
                    <button
                        className={bem.element('page-button', {
                            hidden: !item.page,
                        })}
                        onClick={() => props.onSelect(item.page as number)}
                    >
                        {item.label}
                    </button>
                </li>
            ))}
            {props.showSteps
                && renderArrowStep(props.onSelectNext, 'arrow-left', true, {}, props.isLastPage)}
            {props.showEdgeSteps
                && renderArrowStep(props.onSelectFirst, 'double-arrow-left', true, {right: true}, props.isLastPage)}
        </ul>
    );
}
