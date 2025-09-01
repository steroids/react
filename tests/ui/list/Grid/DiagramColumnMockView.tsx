import useBem from '../../../../src/hooks/useBem';
import {IColumnViewProps} from '../../../../src/ui/list/Grid/Grid';

const enum DiagramType {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
    CIRCLE = 'circle',
}

export default function DiagramColumnView(props: IColumnViewProps) {
    const bem = useBem('DiagramColumnView');

    const isHorizontal = props.diagram?.type === DiagramType.HORIZONTAL;
    const isVertical = props.diagram?.type === DiagramType.VERTICAL;
    const isCircle = props.diagram?.type === DiagramType.CIRCLE;

    const getItemData = (item: {color: string, percentageAttribute: string,}) => ({
        itemPercentage: props.item[item?.percentageAttribute],
        itemColor: item?.color,
    });

    const renderDiagram = (diagramItems, hasPercentSign: boolean, hasSubtitle: boolean, fillingProperty = '') => (
        <div className={bem(
            bem.block({
                size: props.size,
                type: props.diagram?.type,
            }),
        )}
        >
            <div className={bem.element('wrapper')}>
                <div className={bem.element('wrapper-diagrams')}>
                    {diagramItems.map((item, itemIndex) => {
                        const {itemColor, itemPercentage} = getItemData(item);

                        return (
                            <div
                                key={itemIndex}
                                className={bem.element('diagram', {
                                    type: props.diagram?.type,
                                })}
                            >
                                <span className={bem.element('diagram-percentage')}>
                                    {itemPercentage}
                                    {hasPercentSign && ' %'}
                                </span>
                                <div
                                    className={bem.element('diagram-filling', {
                                        color: itemColor,
                                    })}
                                    style={{[fillingProperty]: `${itemPercentage}%`}}
                                />
                            </div>
                        );
                    })}
                </div>
                {hasSubtitle && (
                    <span className={bem.element('subtitle')}>
                        {props.item[props.subtitleAttribute as string]}
                    </span>
                )}
            </div>
        </div>
    );

    if (isHorizontal) {
        return (
            renderDiagram(props.diagram?.items, true, false, 'width')
        );
    }

    if (isVertical) {
        return (
            renderDiagram(props.diagram?.items, true, false, 'height')
        );
    }

    if (isCircle) {
        return (
            renderDiagram(props.diagram?.items, false, !!props.subtitleAttribute)
        );
    }

    return null;
}
