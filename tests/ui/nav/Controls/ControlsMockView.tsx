import * as React from 'react';
import Nav from '../../../../src/ui/nav/Nav/Nav';
import {useBem} from '../../../../src/hooks';
import {IBemHocOutput} from '../../../../src/hoc/bem';
import {IControlsViewProps} from '../../../../src/ui/nav/Controls/Controls';

export default function ControlsView(props: IControlsViewProps & IBemHocOutput) {
    const renderControls = (items) => {
        if (items.length === 0) {
            return null;
        }
        return (
            <Nav
                layout='button'
                {...props.navProps}
                items={items}
            />
        );
    };

    const bem = useBem('ControlsView');
    return (
        <div className={bem(bem.block(), props.className)}>
            {renderControls(props.items.filter(item => item.position !== 'right'))}
            {renderControls(props.items.filter(item => item.position === 'right'))}
        </div>
    );
}
