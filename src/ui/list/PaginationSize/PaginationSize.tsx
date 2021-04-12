import {useCallback, useMemo} from 'react';
import _get from 'lodash-es/get';
import * as React from 'react';
import {useComponents} from '../../../hooks';
import useForm from '../../../hooks/useForm';
import {formChange} from '../../../actions/form';
import {ListControlPosition} from '../../../hooks/useList';

export interface IPaginationSizeProps {
    enable?: boolean,
    attribute?: string,
    sizes?: number[];
    position?: ListControlPosition,
    className?: CssClassName;
    size?: Size;
    view?: CustomView,
    onChange?: (value: number) => void,
    [key: string]: any,
}

export interface IPaginationSizeViewProps extends IPaginationSizeProps {
    items: {
        size: number,
        label: string | number,
        isActive: boolean,
    }[],
    onSelect: (size: number) => void,
}

function PaginationSize(props: IPaginationSizeProps) {
    const components = useComponents();

    if (!props.list) {
        return null;
    }

    const items = useMemo(() => props.sizes.map(size => ({
        size,
        label: size,
        isActive: props.list.pageSize === size,
    })), [props.list.pageSize, props.sizes]);

    const {formId, formDispatch} = useForm();
    const onSelect = useCallback((newPage) => {
        formDispatch && formDispatch(formChange(formId, props.attribute, newPage));
        if (props.onChange && newPage) {
            props.onChange.call(null, newPage);
        }
    }, [formDispatch, formId, props.attribute, props.onChange]);

    if (!props.list.items?.length) {
        return null;
    }

    return components.ui.renderView(props.view || 'list.PaginationSizeView', {
        ...props,
        items,
        onSelect,
    });
}

PaginationSize.defaultProps = {
    enable: false,
    attribute: 'pageSize',
    sizes: [30, 50, 100],
    defaultValue: 50,
    position: 'top',
};

export const normalizePaginationSizeProps = props => ({
    ...PaginationSize.defaultProps,
    enable: !!props,
    defaultValue: _get(props, 'sizes.0') || PaginationSize.defaultProps.defaultValue,
    ...(typeof props === 'boolean' ? {enable: props} : props),
});

export default React.memo(PaginationSize);
