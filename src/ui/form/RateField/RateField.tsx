import * as React from 'react';
import {useCallback, useMemo} from 'react';
import {useMount} from 'react-use';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../Field/fieldWrapper';
import {useComponents} from '../../../hooks';

interface IRateFieldItem {
    id: number,
    value: number,
}

interface IRateFieldProps extends IFieldWrapperInputProps {
    itemsCount?: number,
    defaultValue?: number,
    allowClear?: boolean,
    view?: CustomView,
    className?: CssClassName,

    inputProps: {
        value: number,
        disabled?: boolean,
        onChange: (value: string | React.ChangeEvent) => void,
    },
}

export interface IRateFieldViewProps extends IRateFieldProps, IFieldWrapperOutputProps {
    items: IRateFieldItem[],
    selectedIds: (PrimaryKey | any)[],
    onItemSelect: (id: number) => void,

    value: number,
    onItemClick: (item: IRateFieldItem) => void,
}

function RateField(props: IRateFieldProps) {
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

    return components.ui.renderView(props.view || 'form.RateFieldView', {
        ...props,
        inputProps,
        onItemClick,
        items,
    });
}

RateField.defaultProps = {
    allowClear: false,
    itemsCount: 5,
    disabled: false,
};

export default fieldWrapper('RateField', RateField);
