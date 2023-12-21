import {ICheckboxListFieldProps} from 'src/ui/form/CheckboxListField/CheckboxListField';
import {IButtonGroupProps} from 'src/ui/nav/ButtonGroup/ButtonGroup';
import {useComponents} from '../../../hooks';

/**
 * Chart
 * Этот компонент позволяет создавать в проекте графики разных типов, используя библиотеки nivo, react-vis и другие.
 *  Под капотом для графиков могут использоваться различные библиотеки в зависимости от предпочтений и потребностей проекта.
 *  Для работы с nivo графиками, необходимо установить в проекте зависимости @nivo/core и соответствующий пакет графика, например @nivo/line.
 *  Компонент графика, независимо от выбранной библиотеки, нужно передать в пропс chartComponent.
 */
export interface IChartProps extends IUiComponent {
    /**
     * Компонент графика из библиотеки nivo
     * @example ResponsiveLine
     */
    chartComponent: any,

    /**
     * Данные для графика
     * @example
     * [
     *  {id: 1, value: 15},
     *  {id: 2, value: 30}
     * ]
     */
    data?: Record<string, any>[],

    /**
     * Конфигурация, настройки отображения графика
     * @example
     * {
     *  lineWidth: 3,
     *  pointSize: 10
     * }
     */
    config?: Record<string, any>,

    /**
     * Фиксированная высота обертки в пикселях
     * @example 500
     */
    wrapperHeight?: number,

    /**
     * Фиксированная высота обертки в пикселях
     * @example 500
     */
    chartHeight?: number,

    /**
    * Чекбоксы
    * Могут служить в качестве настаиваемых контроллов для создания функционала
    */
    checkboxes?: ICheckboxListFieldProps,

    /**
    * Кнопки
    * Могут служить в качестве настаиваемых контроллов для создания функционала
    */
    buttonGroup?: IButtonGroupProps,

    /**
    * Заголовок графика
    */
    title?: string,

    /**
     * Использовать ли дефолтную конфигурацию для графика типа line
     * @example ResponsiveLine
     */
    useDefaultLineChartConfig?: boolean,

    [key: string]: any,
}

export type IChartViewProps = IChartProps;

export default function Chart(props: IChartProps): JSX.Element {
    const components = useComponents();

    return components.ui.renderView(props.view || 'content.ChartView', {
        ...props,
    });
}
