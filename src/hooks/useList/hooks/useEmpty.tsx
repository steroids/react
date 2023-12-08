import React from 'react';
import {normalizeEmptyProps} from '../../../ui/list/Empty/Empty';
import {IListConfig} from '../useList';

export default function useEmpty(config: IListConfig, list: any) {
    const Empty = require('../../../ui/list/Empty').default;
    const emptyProps = normalizeEmptyProps(config.empty);
    const renderEmpty = () => {
        if (!emptyProps.enable || list?.isLoading || list?.items?.length > 0) {
            return null;
        }
        return (
            <Empty
                list={list}
                {...emptyProps}
            />
        );
    };

    return {renderEmpty};
}
