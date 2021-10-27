import 'jest-enzyme';
import mountWithApp from '../../../../tests/mountWithApp';
import Avatar from './Avatar';

describe('Avatar tests', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(Avatar);
        expect(wrapper.find('Avatar')).not.toBeEmptyRender();
    });

    describe('Static props', () => {
        const props = {
            alt: 'default image',
            src: 'https://www.dreamsart.it/wp-content/uploads/2019/04/image1-9.jpeg',
            title: 'Avatar',
            className: 'test',
            size: 'x-large',
            shape: 'circle',
            status: 'true',
            style: {width: '30px'},
        };

        const wrapper = mountWithApp(Avatar, {...props});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('Avatar')).toHaveProp(props);
        });
        it('should render right image', () => {
            expect(wrapper.find('img')).toHaveProp('src', props.src);
        });
        it('should have right alternative', () => {
            expect(wrapper.find('img')).toHaveProp('alt', props.alt);
        });
        it('should have right title', () => {
            expect(wrapper.find('img')).toHaveProp('title', props.title);
        });

        it('should have right external className', () => {
            expect(wrapper.find('.AvatarView')).toHaveClassName(props.className);
        });
        it('should have right avatar size', () => {
            expect(wrapper.find('.AvatarView')).toHaveClassName(`.AvatarView_size_${props.size}`);
        });
        it('should have right avatar shape', () => {
            expect(wrapper.find('.AvatarView')).toHaveClassName(`AvatarView_shape_${props.shape}`);
        });
        it('should have right online status', () => {
            expect(wrapper.find('.AvatarView')).toHaveClassName(`AvatarView_has-status_${props.status}`);
        });
        it('should have right external style', () => {
            expect(wrapper.find('.AvatarView__body')).toHaveProp('style', props.style);
        });
    });
});
