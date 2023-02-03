import 'jest-enzyme';
import mountWithApp from '../../../../tests/mountWithApp';
import Card from './Card';

describe.skip('Card tests', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(Card);
        // expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('Card')).not.toBeEmptyRender();
    });

    describe('Static props', () => {
        const props = {
            header: 'test data',
            title: 'Main Card',
            description: 'Scroll to see more',
            footer: 'test data2',
            borderColor: 'success',
            color: 'success',
            shape: 'square',
            orientation: 'vertical-reverse',
            className: 'test',
            style: {width: '45%'},
            cover: 'https://www.publicdomainpictures.net/pictures/50000/velka/abstract-art-face.jpg',
        };

        const wrapper = mountWithApp(Card, {...props});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('Card')).toHaveProp(props);
        });
        it('should render right header', () => {
            expect(wrapper.find('.CardView__header')).toHaveText(props.header);
        });
        it('should render right title', () => {
            expect(wrapper.find('.CardView__title')).toHaveText(props.title);
        });
        it('should render right description', () => {
            expect(wrapper.find('.CardView__description')).toHaveText(props.description);
        });
        it('should render right footer', () => {
            expect(wrapper.find('.CardView__footer')).toHaveText(props.footer);
        });

        it('should have right border color', () => {
            expect(wrapper.find('.CardView')).toHaveClassName(`.CardView_border_${props.borderColor}`);
        });
        it('should have right color', () => {
            expect(wrapper.find('.CardView')).toHaveClassName(`.CardView_color_${props.color}`);
        });
        it('should have right shape', () => {
            expect(wrapper.find('.CardView')).toHaveClassName(`.CardView_shape_${props.shape}`);
        });
        it('should have right orientation', () => {
            expect(wrapper.find('.CardView')).toHaveClassName(`.CardView_orientation_${props.orientation}`);
        });

        it('should have right external className', () => {
            expect(wrapper.find('.CardView')).toHaveClassName(props.className);
        });
        it('should have right external style', () => {
            expect(wrapper.find('.CardView')).toHaveProp('style', props.style);
        });

        it('should have right image cover', () => {
            expect(wrapper.find('img')).toHaveProp('src', props.cover);
        });
    });
});
