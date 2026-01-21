import Portal from '../../src/ui/layout/Portal';
import ModalPortal from '../../src/ui/modal/ModalPortal';

export function JSXWrapper<PropsType>(
    Component: any,
    props: PropsType,
    renderPortal = false,
    renderModalPortal = false,
) {
    return (
        <>
            <div>
                <Component
                    {...props}
                />
            </div>
            {renderPortal && <Portal />}
            {renderModalPortal && <ModalPortal />}
        </>
    );
}
