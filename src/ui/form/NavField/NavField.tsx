import * as React from 'react';
import Nav, {INavProps, INavItem} from '../../nav/Nav/Nav';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';
import {useDataProvider} from '../../../hooks';

import {IDataProviderConfig} from '../../../hooks/useDataProvider';

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

    return (
        <Nav
            {...props.navProps}
            layout={props.navProps.layout}
            items={items as INavItem[]}
            activeTab={props.input.value}
            onChange={props.onChange}
            disabled={props.disabled}
        />
    );
}

NavField.defaultProps = {
    navProps: {
        layout: 'button',
    },
};

export default fieldWrapper<INavFieldProps>('NavField', NavField);
