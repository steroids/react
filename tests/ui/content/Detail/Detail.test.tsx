import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import {Detail, DetailItem} from '../../../../src/ui/content/Detail';
import {DetailLayoutEnum} from '../../../../src/ui/content/Detail/Detail';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    __: jest.fn(),
}));

describe('Detail tests', () => {
    const props = {};

    it('should be in the document', () => {
        const {container, debug} = render(
            <Detail
                title="Test"
                layout={DetailLayoutEnum.Vertical}
                controls={[{label: 'Edit'}]}
                responsive
            >
                <DetailItem label="Status" span={3} hasStatus>Running</DetailItem>
            </Detail>,
        );

        console.log(debug());
    });
});
