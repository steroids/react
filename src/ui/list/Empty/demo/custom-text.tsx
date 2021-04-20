import * as React from 'react';

import Empty from '../Empty';

export default () => (
    <>
        <Empty
            text='К сожалению, ничего не найдено'
            view={(props: any) => (
                <div className='alert alert-primary' role='alert'>
                    {props.text}
                </div>
            )}
        />
    </>
);
