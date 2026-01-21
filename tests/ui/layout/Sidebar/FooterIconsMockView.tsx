import {memo} from 'react';
import Icon, {IIconProps} from '../../../../src/ui/content/Icon/Icon';
import useBem from '../../../../src/hooks/useBem';
import renderIcon from '../../../mocks/renderIconMock';

interface IFooterIconsProps {
    footerIcons?: IIconProps[],
    isShink?: boolean,
}

function FooterIcons(props: IFooterIconsProps) {
    const bem = useBem('FooterIcons');

    return (
        <ul className={bem(bem.block(
            {
                isShrink: props.isShink,
            },
        ))}
        >
            {props.isShink
                ? (
                    <Icon
                        name='mockIcon'
                        className={bem.element('item')}
                    />
                )
                : props.footerIcons?.map((icon, iconIndex) => (
                    <li
                        key={iconIndex}
                        className={bem.element('item')}
                    >
                        {renderIcon(icon?.name as string, {
                            ...icon,
                        })}
                    </li>
                ))}
        </ul>
    );
}

export default memo(FooterIcons);
