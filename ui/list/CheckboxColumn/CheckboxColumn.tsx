import {useComponents, useSelector} from '@steroidsjs/core/hooks';
import {useCallback, useMemo} from 'react';
import useDispatch from '@steroidsjs/core/hooks/useDispatch';
import {toggleAll, toggleItem} from '../../../actions/list';
import {isChecked, isCheckedAll} from '../../../reducers/list';

export interface ICheckboxColumnProps {
    fieldProps?: any;
    view?: any;
    [key: string]: any,
}

export interface ICheckboxColumnViewProps {
    fieldProps: {
    },
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
