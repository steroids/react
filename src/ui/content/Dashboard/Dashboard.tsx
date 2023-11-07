import React from 'react';
import FlexGrid, {IFlexGridItem, IFlexGridProps} from '../../../ui/list/FlexGrid/FlexGrid';
import {useComponents} from '../../../hooks';

export interface IDashboardItem extends IFlexGridItem {
    /**
    * Заголовок для элемента
    */
    title?: string,

    /**
     * Иконка, которая отобразится слева от заголовка
     */
    iconName?: string,
}

/**
 * Dashboard
 *
 * Компонент в котором можно расположить различные элементы, например графики, таблицы на доске
 */
export interface IDashboardProps extends IUiComponent, IFlexGridProps {
    /**
     * Элементы дашборда
     */
    items: IDashboardItem[],

    /**
     * Кастомная вьюшка для элемента
     */
    itemView?: CustomView,
}

export interface IDashboardItemViewProps extends Pick<IDashboardItem, 'title' | 'iconName'> {
    children: React.ReactNode,
}

function Dashboard(props: IDashboardProps): JSX.Element {
    const components = useComponents();

    const DashboardItemView = props.itemView || components.ui.getView('content.DashboardItemView');

    const flexGridItems = React.useMemo(() => props.items.map(item => ({
        ...item,
        content: (
            <DashboardItemView title={item.title} iconName={item.iconName}>
                {item.content}
            </DashboardItemView>
        ),
    })), [DashboardItemView, props.items]);

    return (
        <FlexGrid
            {...props}
            items={flexGridItems}
        />
    );
}

export default Dashboard;
