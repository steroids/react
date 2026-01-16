import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import {IListViewProps} from '../../../../src/ui/list/List/List';

export default function ListView(props: IListViewProps) {
    const bem = useBem('ListView');

    if (!props.list) {
        return null;
    }

    const renderPagination = (pagination, paginationSize, layout) => {
        if (!pagination && !paginationSize && !layout) {
            return null;
        }

        return (
            <div className={bem.element('pagination')}>
                {pagination && (
                    <div className={bem.element('pagination-button')}>
                        {pagination}
                    </div>
                )}
                {paginationSize && (
                    <div className={bem.element('pagination-sizes')}>
                        {paginationSize}
                    </div>
                )}
                {layout && (
                    <div className={bem.element('pagination-layout')}>
                        {layout}
                    </div>
                )}
            </div>
        );
    };

    return props.renderList(
        <div className={bem(bem.block({loading: props.isLoading || props.list.isLoading}), props.className)}>
            {props.renderSearchForm()}
            {renderPagination(
                ['top', 'both'].includes(props.paginationPosition) && props.renderPagination(),
                ['top', 'both'].includes(props.paginationSizePosition) && props.renderPaginationSize(),
                ['top', 'both'].includes(props.layoutNamesPosition) && props.renderLayoutNames(),
            )}
            <div className={bem(bem.element('content'), props.contentClassName)}>
                {props.content}
            </div>
            {renderPagination(
                ['bottom', 'both'].includes(props.paginationPosition) && props.renderPagination(),
                ['bottom', 'both'].includes(props.paginationSizePosition) && props.renderPaginationSize(),
                ['bottom', 'both'].includes(props.layoutNamesPosition) && props.renderLayoutNames(),
            )}
            {props.renderEmpty()}
        </div>,
    );
}
