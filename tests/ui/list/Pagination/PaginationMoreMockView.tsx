import * as React from 'react';

import Button from '../../../../src/ui/form/Button';
import {IPaginationViewProps} from '../../../../src/ui/list/Pagination/Pagination';
import {useBem} from '../../../../src/hooks';

export default function PaginationMoreView(props: IPaginationViewProps) {
    const bem = useBem('PaginationMoreView');
    return (
        <div className={bem(bem.block(), props.className)}>
            <Button
                color='secondary'
                outline
                disabled={props.disabled}
                label={__('Загрузить еще...')}
                {...props.buttonProps}
                onClick={props.onSelectNext}
            />
        </div>
    );
}
