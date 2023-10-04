import '@testing-library/jest-dom';
import {JSXWrapper, render} from '../../../helpers';
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

    const expectedAvatarClass = 'AvatarView';
    const wrapper = JSXWrapper(Avatar, props);

    it('avatar should be in the document', () => {
        const {getByTestId} = render(wrapper);
        const avatar = getByTestId(props.testId);

        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveClass(expectedAvatarClass);
        expect(avatar).toHaveClass(props.className);
    });

    it('avatar should have right size, shape, status', () => {
        const {getByTestId} = render(wrapper);
        const avatar = getByTestId(props.testId);

        expect(avatar).toHaveClass(`${expectedAvatarClass}_size_${props.size}`);
        expect(avatar).toHaveClass(`${expectedAvatarClass}_shape_${props.shape}`);
        expect(avatar).toHaveClass(`${expectedAvatarClass}_has-status`);
    });

    it('should render picture with right attributes', () => {
        const {getByRole} = render(wrapper);
        const picture = getByRole('img');

        expect(picture).toBeInTheDocument();
        expect(picture).toHaveAttribute('alt', props.alt);
        expect(picture).toHaveAttribute('src', props.src);
        expect(picture).toHaveAttribute('title', props.title);
    });

    it('body should have right style', () => {
        const {getByTestId} = render(wrapper);
        const body = getByTestId(props.bodyTestId);

        expect(body).toBeInTheDocument();
        expect(body).toHaveStyle(props.style);
    });
});
