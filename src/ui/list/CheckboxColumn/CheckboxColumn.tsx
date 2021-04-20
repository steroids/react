import {useCallback, useMemo} from 'react';
import {useComponents, useSelector} from '../../../hooks';
import useDispatch from '../../../hooks/useDispatch';
import {toggleAll, toggleItem} from '../../../actions/list';
import {isChecked, isCheckedAll} from '../../../reducers/list';

export interface ICheckboxColumnProps {
    fieldProps?: any;
    view?: any;

    [key: string]: any,
}

export interface ICheckboxColumnViewProps {
    fieldProps: Record<string, any>,
    input: {
        name: string,
        value: any,
        onChange: any,
    },
}

export default function CheckboxColumn(props: ICheckboxColumnProps) {
    const components = useComponents();
    const itemId = props.item[props.primaryKey];

    const dispatch = useDispatch();
    const value = useSelector(state => ({
        isChecked: props.item
            ? isChecked(state, props.listId, itemId)
            : isCheckedAll(state, props.listId),
    }));

    const onChange = useCallback(() => {
        dispatch(props.item ? toggleItem(props.listId, itemId) : toggleAll(props.listId));
    }, [dispatch, itemId, props.item, props.listId]);

    const input = useMemo(() => ({
        name: props.listId + '_checkbox',
        value,
        onChange,
    }), [onChange, props.listId, value]);

    return components.ui.renderView(props.view || 'list.CheckboxColumnView', {
        input,
    });
}
