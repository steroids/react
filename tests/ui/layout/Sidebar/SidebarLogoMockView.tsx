import {memo, ReactElement} from 'react';
import useBem from '../../../../src/hooks/useBem';
import {Icon} from '../../../../src/ui/content';
import renderIcon from '../../../mocks/renderIconMock';

interface ISidebarLogoProps {
    icon: string | ReactElement,
    label: string,
    toggleSidebar: () => void,
}

function SidebarLogo(props: ISidebarLogoProps) {
    const bem = useBem('SidebarLogo');

    return (
        <div className={bem.block()}>
            <div
                className={bem.element('left')}
            >
                {renderIcon('mockIcon', {
                    className: bem.element('icon'),
                })}
                <h3 className={bem.element('label')}>
                    {props.label}
                </h3>
            </div>
            <Icon
                name='mockIcon'
                className={bem.element('right')}
                onClick={props.toggleSidebar}
            />
        </div>
    );
}

export default memo(SidebarLogo);
