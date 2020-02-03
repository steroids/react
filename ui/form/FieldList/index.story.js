import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {withReadme} from 'storybook-readme';
import {text, object, select, boolean} from '@storybook/addon-knobs/react';

import FieldList from './FieldList';
import Form from '../Form';
import InputField from '../InputField';
import NumberField from '../NumberField';
import FieldLayout from '../FieldLayout';

import README from './README.md';

// const items = [
//     {
//         label: 'Name',
//         attribute: 'name',
//         component: InputField,
//     },
//     {
//         label: 'Amount',
//         attribute: 'amount',
//         component: NumberField,
//     },
// ];

const layouts = {
    default: 'Default',
    horizontal: 'Horizontal',
    inline: 'Inline',
};

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('FieldList', context => (
        <div>
            {withInfo()(() => (
                <Form
                    formId='FieldListForm'
                    layout={select('Layout', layouts, FieldLayout.defaultProps.layout)}
                    layoutProps={object('Layout columns', FieldLayout.defaultProps.layoutProps)}
                >
                    <FieldList
                        disabled={boolean('Disabled', FieldList.defaultProps.disabled)}
                        required={boolean('Required', FieldList.defaultProps.required)}
                        className={text('Class', FieldList.defaultProps.className)}
                        size={select('Size', sizes, FieldList.defaultProps.size)}
                        attribute='items'
                        label={text('Label', 'Items')}
                        showAdd={boolean('Show Add', FieldList.defaultProps.showAdd)}
                        showRemove={boolean('Show Remove', FieldList.defaultProps.showRemove)}
                        // items={object('Items', items)}

                        items={[
                            {
                                label: 'Name',
                                attribute: 'name',
                                component: InputField,
                            },
                            {
                                label: 'Amount',
                                attribute: 'amount',
                                component: NumberField,
                            },
                        ]}
                    />
                </Form>
            ))(context)}
        </div>
    ));
