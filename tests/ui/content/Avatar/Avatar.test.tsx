import React from 'react';
import {getByTestId} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Avatar from '../../../../src/ui/content/Avatar/Avatar';
import AvatarView from './AvatarMockView';

describe.skip('Avatar tests', () => {
    const props = {
        alt: 'default image',
        src: 'https://www.dreamsart.it/wp-content/uploads/2019/04/image1-9.jpeg',
        title: 'Avatar',
        className: 'test',
        size: 'x-large',
        shape: 'circle',
        status: true,
        style: {width: '30px'},
        view: AvatarView,
    };

    const testId = 'avatar-test';

    it('should render right image', () => {
        const {container} = render(<Avatar
            data-testid={testId}
            {...props}
        />);

        expect(getByTestId(container, testId)).toBeInTheDocument();
    });
});
