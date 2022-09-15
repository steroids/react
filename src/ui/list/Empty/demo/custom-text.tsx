import * as React from 'react';

import Empty from '../Empty';

/**
 * With custom view
 * @order 2
 * @col 6
 */
export default () => (
    <>
        <Empty
            text='К сожалению, ничего не найдено'
            // @ts-ignore
            view={(props: any) => (
                <div className='alert alert-primary' role='alert'>
                    {props.text}
                </div>
            )}
        />
    </>
);
