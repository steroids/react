import * as React from 'react';
import {useComponents} from '@steroidsjs/core/hooks';

export interface IBooleanFormatterProps {
    value?: string | number | boolean;
    view?: CustomView;

    [key: string]: any;
}

export interface IBooleanFormatterPropsView {
    value?: string | number | boolean;
    children?: React.ReactNode,
}

export default function BooleanFormatter(props: IBooleanFormatterProps) {
    return useComponents().ui.renderView(props.view || 'format.BooleanFormatterView', {
        value: props.value,
    });
}
