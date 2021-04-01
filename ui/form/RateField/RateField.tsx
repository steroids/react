import * as React from 'react';
import fieldWrapper from '@steroidsjs/core/ui/form/Field/fieldWrapper';
import {useComponents} from '@steroidsjs/core/hooks';
import {useCallback, useMemo, useState} from 'react';

interface IRateFieldProps {
    itemsCount?: number,
    defaultValue?: number,
    view?: CustomView,
    className?: CssClassName,
}

export interface IRateFieldViewProps extends IRateFieldProps {
    items: {
        id: number,
    }[],
    value: number,
    handleItemClick: (value: number) => void,
}

function RateField(props: IRateFieldProps) {
    const components = useComponents();

    const [value, setValue] = useState<number>(props.defaultValue || 0);

    const items = useMemo(() => [...Array(props.itemsCount || 5)].map((item, index) => ({id: index + 1})),
        [props.itemsCount]);

    const handleItemClick = useCallback(newValue => setValue(newValue), []);

    return components.ui.renderView(props.view || 'form.RateFieldView', {
        ...props,
        items,
        value,
        handleItemClick,
    });
}

RateField.defaultProps = {
    itemsCount: 5,
};

export default fieldWrapper('RateField', RateField);
