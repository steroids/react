/* eslint-disable max-len */
import * as React from 'react';
import Collapse from '../Collapse';
import CollapseItem from '../CollapseItem';

/**
 * Custom icon
 * @order 5
 * @col 12
 */

export default () => (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '15px', minHeight: '255px'}}>
        <Collapse
            icon={(
                <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28 16.5C28 23.1274 22.6274 28.5 16 28.5C9.37258 28.5 4 23.1274 4 16.5C4 9.87258 9.37258 4.5 16 4.5C22.6274 4.5 28 9.87258 28 16.5Z" stroke="#39BBD8" strokeWidth="2" />
                    <path d="M16 13.5L16 23.5" stroke="#39BBD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 9.5L16 9.51" stroke="#39BBD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            activeKey={1}
        >
            <CollapseItem>Custom icon</CollapseItem>
            <CollapseItem>Custom icon</CollapseItem>
            <CollapseItem>Custom icon</CollapseItem>
        </Collapse>
        <Collapse activeKey={2}>
            <CollapseItem icon={(
                <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28 16.5C28 23.1274 22.6274 28.5 16 28.5C9.37258 28.5 4 23.1274 4 16.5C4 9.87258 9.37258 4.5 16 4.5C22.6274 4.5 28 9.87258 28 16.5Z" stroke="#64D03E" strokeWidth="2" />
                    <path d="M21 12.5L14.3333 20.5L11 17.3" stroke="#64D03E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            >
                Custom icon
            </CollapseItem>
            <CollapseItem icon={(
                <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28 16.5C28 23.1274 22.6274 28.5 16 28.5C9.37258 28.5 4 23.1274 4 16.5C4 9.87258 9.37258 4.5 16 4.5C22.6274 4.5 28 9.87258 28 16.5Z" stroke="#39BBD8" strokeWidth="2" />
                    <path d="M16 13.5L16 23.5" stroke="#39BBD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 9.5L16 9.51" stroke="#39BBD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            >
                Custom icon
            </CollapseItem>
            <CollapseItem icon={(
                <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28 16.5C28 23.1274 22.6274 28.5 16 28.5C9.37258 28.5 4 23.1274 4 16.5C4 9.87258 9.37258 4.5 16 4.5C22.6274 4.5 28 9.87258 28 16.5Z" stroke="#FFE457" strokeWidth="2" />
                    <path d="M16 19.5L16 9.5" stroke="#FFE457" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 23.5L16 23.49" stroke="#FFE457" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            >
                Custom icon
            </CollapseItem>
        </Collapse>
    </div>
);
