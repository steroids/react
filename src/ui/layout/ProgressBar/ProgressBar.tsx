import * as React from 'react';
import Icon from '../../content/Icon/Icon';
import {useComponents} from '../../../hooks';

export interface IProgressBarViewProps {
    percent: number,
    status?: 'normal' | 'success' | 'exception',
    size?: 'small' | 'medium' | 'large',
    label?: string | React.ReactNode,
}

/**
 * ProgressBar
 * Progress bar. Отображает текущий прогресс какой-либо операции
 */
export interface IProgressBarProps {
    /**
     * Прогресс в процентах
     */
    percent: number,
    /**
     * Статус компонента
     */
    status?: 'normal' | 'success' | 'exception',
    /**
     * Размер компонента
     */
    size?: 'small' | 'medium' | 'large',
    /**
     * Тип компонента - круг или линия
     */
    type?: 'line' | 'circle',
    /**
     * Флаг, определяющий показывать ли лейбл
     */
    showLabel?: boolean,
    /**
     * Функция, позволяющая изменить генерацию лейбла
     * @param percent Прогресс в процентах
     */
    label?: (percent: number) => string,
    /**
     * Функция, позволяющая задавать собственные иконки в зависимости от прогресса и статуса
     * @param status Статус компонента
     * @param percent Прогресс в процентах
     */
    icon?: (status: string, percent: number) => React.ReactNode,
}

function ProgressBar(props: IProgressBarProps): JSX.Element {
    const components = useComponents();

    const getLabel = (() => {
        if (!props.showLabel) {
            return null;
        }
        if (props.icon) {
            return props.icon(props.status, props.percent);
        }
        if (props.status === 'success') {
            return <Icon name="check" />;
        }
        if (props.status === 'exception') {
            return <Icon name="times" />;
        }
        return props.label(props.percent);
    });

    if (props.type === 'line') {
        return components.ui.renderView('layout.LineProgressBarView', {
            percent: props.percent,
            status: props.status,
            size: props.size,
            label: getLabel()});
    }
    return components.ui.renderView('layout.CircleProgressBarView', {
        percent: props.percent,
        status: props.status,
        size: props.size,
        label: getLabel()});
}

ProgressBar.defaultProps = {
    status: 'normal',
    size: 'medium',
    type: 'line',
    showLabel: true,
    label: percent => `${percent}%`,
};

export default ProgressBar;
