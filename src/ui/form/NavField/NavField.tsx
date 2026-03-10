import React, {useMemo} from 'react';

import {FieldEnum} from '../../../enums';
import {useDataProvider} from '../../../hooks';
import {IDataProviderConfig} from '../../../hooks/useDataProvider';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';
import Nav, {INavProps, INavItem} from '../../nav/Nav/Nav';

/**
 * NavField
 * Компонент навигации как часть формы.
 *
 * Этот компонент представляет собой навигационное меню, которое можно использовать
 * как часть формы для выбора различных элементов или вкладок.
 **/
export interface INavFieldProps extends IFieldWrapperInputProps, IFieldWrapperOutputProps, IDataProviderConfig, IUiComponent {
    /**
     * Свойства для компонента Nav
     */
    navProps?: INavProps,

    [key: string]: any,
}

function NavField(props: INavFieldProps): JSX.Element {
    const {items} = useDataProvider({
        items: props.items,
    });

    const navProps = useMemo(() => ({
        layout: props.navProps.layout,
        items: items as INavItem[],
        activeTab: props.input.value,
        onChange: props.onChange,
        disabled: props.disabled,
        className: props.className,
        view: props.view,
        size: props.size,
    }), [items, props.className, props.disabled, props.input.value, props.navProps.layout, props.onChange, props.size, props.view]);

    return (
        <Nav {...navProps} />
    );
}

NavField.defaultProps = {
    navProps: {
        layout: 'button',
    },
};

export default fieldWrapper<INavFieldProps>(FieldEnum.NAV_FIELD, NavField);
