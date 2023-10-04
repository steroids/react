import _upperFirst from 'lodash-es/upperFirst';
import {useComponents} from '../../../hooks';

/**
 * Chart
 * Этот компонент позволяет создавать в проекте графики разных типов. Под капотом для графиков используется библиотека nivo.
 * Для работы этого компонента необходимо установить в проекте зависимости @nivo/core и пакет конкретного графика nivo, например @nivo/line.
 * Компонент графика nivo нужно передать в пропс chartComponent
 */
export interface IChartProps extends IUiComponent {
    /**
     * Компонент графика из библиотеки nivo
     * @example ResponsiveLine
     */
    chartComponent: any;

    /**
     * Данные для графика
     * @example [{id: 1, value: 15}, {id: 2, value: 30}]
     */
    data: Record<string, any>[],

    /**
     * Конфигурация, настройки отображения графика
     * @example {lineWidth: 3, pointSize: 10}
     */
    config?: Record<string, any>,

    /**
     * Фиксированная высота графика в пикселях
     * @example 500
     */
    height?: number,

    /**
     * Использовать ли дефолтную конфигурацию для графика типа line
     * @example ResponsiveLine
     */
    useDefaultLineChartConfig?: boolean;

    [key: string]: any,
}

export type IChartViewProps = IChartProps;

export default function Chart(props: IChartProps): JSX.Element {
    const components = useComponents();

    return components.ui.renderView(props.view || 'content.ChartView', {
        ...props,
    });
}
