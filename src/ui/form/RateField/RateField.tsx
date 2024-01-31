import {useCallback, useMemo} from 'react';
import {useMount} from 'react-use';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../Field/fieldWrapper';
import {useComponents} from '../../../hooks';

export interface IRateFieldItem {
    id: number,
    value: number,
}

/**
 * RateField
 *
 * Поле для проставления рейтинга
 */
export interface IRateFieldProps extends IFieldWrapperInputProps, IUiComponent {
    /**
     * Максимальное количество звезд
     * @example 5
     */
    itemsCount?: number,

    /**
     * Количество звезд по умолчанию
     * @example 4
     */
    defaultValue?: number,

    /**
     * Возможность полностью сбрасывать рейтинг, при повторном нажатии на звезду
     * @example false
     */
    allowClear?: boolean,

    /**
    * Значок (бэйдж) с заголовком.
    */
    badge?: {
        title: string,
    },

    inputProps?: {
        [key: string]: any,
    },
}

export interface IRateFieldViewProps extends IRateFieldProps, IFieldWrapperOutputProps {
    items: IRateFieldItem[],
    selectedIds: (PrimaryKey | any)[],
    onItemSelect: (id: number) => void,

    value: number,
    onItemClick: (item: IRateFieldItem) => void,
}

function RateField(props: IRateFieldProps): JSX.Element {
    const components = useComponents();

    const items = useMemo(() => [...Array(props.itemsCount || 5)]
        .map((item, index) => ({
            id: index,
            value: index + 1,
        })),
    [props.itemsCount]);

    useMount(() => props.input.onChange(props.defaultValue || 0));

    const onItemClick = useCallback((item) => {
        let value = item.value;
        if (props.allowClear && props.input.value === item.value) {
            value = 0;
        }
        props.input.onChange(value);
    }, [props.allowClear, props.input]);

    const inputProps = useMemo(() => ({
        name: props.input.name,
        value: props.input.value,
        disabled: props.disabled,
        ...props.inputProps,
    }), [props.disabled, props.input, props.inputProps]);

    const viewProps = useMemo(() => ({
        inputProps,
        onItemClick,
        items,
        size: props.size,
        disabled: props.disabled,
        className: props.className,
        style: props.style,
        badge: props.badge,
    }), [inputProps, items, onItemClick, props.badge, props.className, props.disabled, props.size, props.style]);

    return components.ui.renderView(props.view || 'form.RateFieldView', viewProps);
}

RateField.defaultProps = {
    allowClear: false,
    itemsCount: 5,
    disabled: false,
};

export default fieldWrapper<IRateFieldProps>('RateField', RateField);
