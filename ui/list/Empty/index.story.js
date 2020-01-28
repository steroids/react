import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {text} from '@storybook/addon-knobs/react';

import Empty from './Empty';

storiesOf('List', module)
    .add('Empty', context => (
        <div>
            {withInfo()(() => (
                <Empty
                    text={text('Empty Text', 'Записей не найдено')}
                    className={text('Class', '')}
                />
            ))(context)}
        </div>
    ));