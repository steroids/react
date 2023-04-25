import {useCallback, useMemo} from 'react';
import {useComponents, useSelector} from '../../../hooks';
import useDispatch from '../../../hooks/useDispatch';
import {toggleAll, toggleItem} from '../../../actions/list';
import {isSelected, isSelectedAll} from '../../../reducers/list';
import {IContentColumnViewProps} from '../Grid/Grid';

/**
 * CheckboxColumn
 * Колонка с чекбоксом, которая позволяет выбирать одну или все записи в таблице.
 */
export interface ICheckboxColumnProps {
    /**
     * Первичный ключ для доступа к идентификатору item
     */
    primaryKey?: string,

    /**
     * Элемент коллекции item
     */
    item?: any,

    /**
     * Свойства для CheckboxField
     */
    fieldProps?: any;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    [key: string]: any,
}

export interface ICheckboxColumnViewProps extends IContentColumnViewProps {
    fieldProps: Record<string, any>,
    input: {
        name: string,
        value: any,
        onChange: any,
    },
}

export default function CheckboxColumn(props: ICheckboxColumnProps): JSX.Element {
    const components = useComponents();

    const itemId = props.item?.[props.primaryKey];

    const dispatch = useDispatch();
    const value = useSelector(state => (
        props.item
            ? isSelected(state, props.listId, itemId)
            : isSelectedAll(state, props.listId)
    ));

    const onChange = useCallback(() => {
        dispatch(props.item ? toggleItem(props.listId, itemId) : toggleAll(props.listId));
    }, [dispatch, itemId, props.item, props.listId]);

    const input = useMemo(() => ({
        name: props.listId + '_checkbox',
        value,
        onChange,
    }), [onChange, props.listId, value]);

    return components.ui.renderView(props.view || 'list.CheckboxColumnView', {
        ...props,
        input,
    });
}

CheckboxColumn.defaultProps = {
    primaryKey: 'id',
};
