import {PropsWithChildren} from 'react';
import {useBem} from '../../src/hooks';
import useLayout, {STATUS_LOADING, STATUS_OK} from '../../src/hooks/useLayout';
import Portal from '../../src/ui/layout/Portal';

export default function Layout(props: PropsWithChildren<any>) {
    const bem = useBem('Layout');

    const {status} = useLayout();

    if (status !== STATUS_OK) {
        return status !== STATUS_LOADING ? status : null;
    }

    return (
        <div className={bem.block()}>
            <div className={bem.element('content')}>
                {props.children}
                <Portal />
            </div>
        </div>
    );
}
