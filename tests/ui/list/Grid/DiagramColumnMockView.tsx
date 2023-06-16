import React from 'react';
import useBem from '../../../../src/hooks/useBem';
import {IColumnViewProps} from '../../../../src/ui/list/Grid/Grid';

const HORIZONTAL_DIAGRAM_INDEX = 0;

export default function DiagramColumnView(props: IColumnViewProps) {
    const bem = useBem('DiagramColumnView');

    const isHorizontal = props.diagrams?.type === 'horizontal';
    const isVertical = props.diagrams?.type === 'vertical';
    const isCircle = props.diagrams?.type === 'circle';

    const renderDiagrams = (content: React.ReactElement) => (
        <div className={bem(
            bem.block({
                size: props.size,
                isHorizontal,
                isVertical,
                isCircle,
            }),
        )}
        >
            {content}
        </div>
    );

    const getItemData = (item: {colorAttribute: string, percentageAttribute: string}) => ({
        itemPercentage: props.item[item?.percentageAttribute],
        itemColor: props.item[item?.colorAttribute],
    });

    if (isHorizontal) {
        return (
            renderDiagrams(
                <>
                    {[props.diagrams?.items[HORIZONTAL_DIAGRAM_INDEX]].map((item, itemIndex) => {
                        const {itemColor, itemPercentage} = getItemData(item as any);

                        return (
                            <div
                                key={itemIndex}
                                className={bem.element('diagram', {
                                    isHorizontal,
                                })}
                            >
                                <span className={bem.element('diagram-percentage')}>
                                    {itemPercentage}
                                    %
                                </span>
                                <div
                                    className={bem.element('diagram-filling', {
                                        color: itemColor,
                                    })}
                                    style={{width: `${itemPercentage}%`}}
                                />
                            </div>
                        );
                    })}
                </>,
            )
        );
    }

    if (isVertical) {
        return (
            renderDiagrams(
                <>
                    {
                        props.diagrams?.items.map((item, itemIndex) => {
                            const {itemColor, itemPercentage} = getItemData(item);

                            return (
                                <div
                                    className={bem.element('diagram', {
                                        isVertical,
                                    })}
                                    key={itemIndex}
                                >
                                    <span className={bem.element('diagram-percentage')}>
                                        {itemPercentage}
                                        %
                                    </span>
                                    <div
                                        className={bem.element('diagram-filling', {
                                            color: itemColor,
                                        })}
                                        style={{height: `${itemPercentage}%`}}
                                    />
                                </div>
                            );
                        })
                    }
                </>,
            )
        );
    }

    if (isCircle) {
        return (
            renderDiagrams(
                <div className={bem.element('wrapper')}>
                    <div className={bem.element('wrapper-diagrams')}>
                        {
                            props.diagrams?.items.map((item, itemIndex) => {
                                const {itemColor, itemPercentage} = getItemData(item);

                                return (
                                    <div
                                        className={bem.element('diagram', {
                                            isCircle,
                                            color: itemColor,
                                        })}
                                        key={itemIndex}
                                    >
                                        <span className={bem.element('diagram-percentage')}>
                                            {itemPercentage}
                                        </span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    {props.subtitleAttribute && <span className={bem.element('subtitle')}>{props.item[props.subtitleAttribute]}</span>}
                </div>,
            )
        );
    }

    return null;
}
