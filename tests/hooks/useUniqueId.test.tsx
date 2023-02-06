import * as React from 'react';

import _uniqueId from 'lodash-es/uniqueId';
import useUniqueId from '../../src/hooks/useUniqueId';
import mountWithApp from '../mountWithApp';

const MockResultComponent = (props: any) => <div />;
const MockComponent = (prefix: string) => (
    <MockResultComponent uniqueId={useUniqueId(prefix)} />
);

jest.mock('lodash-es/uniqueId');

describe('useUniqueId hook', () => {
    it('default behavior', () => {
        const prefix = 'usefulHook_';
        const expectedUniqueId = `${prefix}1`;

        _uniqueId.mockImplementation(() => expectedUniqueId);
        const wrapper = mountWithApp(MockComponent, prefix);

        const uniqueId = wrapper.find('MockResultComponent').prop('uniqueId');
        expect(uniqueId).toBe(expectedUniqueId);
    });
});
