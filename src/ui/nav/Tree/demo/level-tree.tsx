import * as React from 'react';
import Tree from '../Tree'

export default () => (
    <>
        <Tree
            level={3}
            items={[
                {
                    id: 1,
                    label: 'label 1',
                    items: [
                        {
                            id: 2,
                            label: 'label 2.1',
                            items: [
                                {
                                    id: 3,
                                    label: 'label 3',
                                    items: [
                                        {
                                            id: 4,
                                            label: 'label 4',
                                            items: [
                                                {
                                                    id: 5,
                                                    label: 'label 5'
                                                }
                                            ]
                                        },
                                    ],
                                }
                            ],
                        },
                        {
                            id: 2.2,
                            label: 'label 2.2',
                        }
                    ],
                },
            ]}
        />
    </>
);