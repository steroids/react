import * as React from 'react';
import viewHoc from '../viewHoc';

interface IBooleanFormatterProps {
    value?: string | number | boolean;
}

@viewHoc()
export default class BooleanFormatter extends React.Component<IBooleanFormatterProps,
    {}> {
    render() {
        return this.props.value ? __('Да') : __('Нет');
    }
}
