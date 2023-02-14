import React from 'react';
import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Avatar from '../../../../src/ui/content/Avatar/Avatar';
import AvatarView from './AvatarMockView';

describe('Avatar tests', () => {
    const props = {
        alt: 'default image',
        src: 'https://www.dreamsart.it/wp-content/uploads/2019/04/image1-9.jpeg',
        title: 'Avatar',
        className: 'test',
        size: 'x-large',
        shape: 'circle',
        status: true,
        style: {width: '30px'},
        testId: 'avatar-test',
        bodyTestId: 'body-test',
        view: AvatarView,
    };

    const JSXWrapper = (
        <div>
            <Avatar {...props} />
        </div>
    );

    it('avatar should be in the document', () => {
        const {getByTestId} = render(JSXWrapper);
        const avatar = getByTestId(props.testId);

        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveClass('AvatarView');
    });

    it('avatar should have right size, shape, status', () => {
        const {getByTestId} = render(JSXWrapper);
        const avatar = getByTestId(props.testId);

        expect(avatar).toHaveClass(`AvatarView_size_${props.size}`);
        expect(avatar).toHaveClass(`AvatarView_shape_${props.shape}`);
        expect(avatar).toHaveClass('AvatarView_has-status');
    });

    it('should render picture with right attributes', () => {
        const {getByRole} = render(JSXWrapper);
        const picture = getByRole('img');

        expect(picture).toBeInTheDocument();
        expect(picture).toHaveAttribute('alt', props.alt);
        expect(picture).toHaveAttribute('src', props.src);
        expect(picture).toHaveAttribute('title', props.title);
    });

    it('body should have right style', () => {
        const {getByTestId} = render(JSXWrapper);
        const body = getByTestId(props.bodyTestId);

        expect(body).toBeInTheDocument();
        expect(body).toHaveStyle(props.style);
    });
});
