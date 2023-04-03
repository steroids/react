/* eslint-disable valid-typeof */
import React from 'react';
import Icon, {IIconProps} from '../../src/ui/content/Icon/Icon';
import IconMockView from '../ui/content/Icon/IconMockView';

/**
* Функция которая проверяет соответствует ли typeof icon === 'string', если да - то вернет компонент Icon
* с переданным в него iconProps, если нет то вернется span с классом iconProps.className со вложенным {icon}
* @example renderIcon(props.leadIcon, {className, tabIndex: -1})
*/
const renderIcon = (
    icon: string | React.ReactElement,
    iconProps: IIconProps,
) => typeof icon === 'string'
    ? (
        <Icon
            view={IconMockView}
            name={icon}
            {...iconProps}
        />
    ) : (
        <span className={iconProps.className}>
            {icon}
        </span>
    );

export default renderIcon;
