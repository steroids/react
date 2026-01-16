import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import {IAccordionViewProps} from '../../../../src/ui/content/Accordion/Accordion';

export default function AccordionView(props: IAccordionViewProps) {
    const bem = useBem('AccordionView');
    return (
        <div className={bem(bem.block(), props.className)}>
            {props.children}
        </div>
    );
}
