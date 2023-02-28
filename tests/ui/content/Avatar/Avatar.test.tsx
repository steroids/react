import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Avatar from '../../../../src/ui/content/Avatar/Avatar';
import AvatarView from './AvatarMockView';
import {JSXWrapper} from '../../../helpers';

describe('Avatar tests', () => {
    const defaultProps = {
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
    const wrapper = JSXWrapper(Avatar, defaultProps);

    it('avatar should be in the document', () => {
        const {getByTestId} = render(wrapper);
        const avatar = getByTestId(defaultProps.testId);

        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveClass(expectedAvatarClass);
        expect(avatar).toHaveClass(defaultProps.className);
    });

    it('avatar should have right size, shape, status', () => {
        const {getByTestId} = render(wrapper);
        const avatar = getByTestId(defaultProps.testId);

        expect(avatar).toHaveClass(`${expectedAvatarClass}_size_${defaultProps.size}`);
        expect(avatar).toHaveClass(`${expectedAvatarClass}_shape_${defaultProps.shape}`);
        expect(avatar).toHaveClass(`${expectedAvatarClass}_has-status`);
    });

    it('should render picture with right attributes', () => {
        const {getByRole} = render(wrapper);
        const picture = getByRole('img');

        expect(picture).toBeInTheDocument();
        expect(picture).toHaveAttribute('alt', defaultProps.alt);
        expect(picture).toHaveAttribute('src', defaultProps.src);
        expect(picture).toHaveAttribute('title', defaultProps.title);
    });

    it('body should have right style', () => {
        const {getByTestId} = render(wrapper);
        const body = getByTestId(defaultProps.bodyTestId);

        expect(body).toBeInTheDocument();
        expect(body).toHaveStyle(defaultProps.style);
    });
});
