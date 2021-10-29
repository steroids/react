import 'jest-enzyme';
import mountWithApp from '../../../../tests/mountWithApp';
import ProgressBar from './ProgressBar';

describe('ProgressBar tests', () => {
    it('should render something without props and views', () => {
        const wrapper = mountWithApp(ProgressBar);
        expect(wrapper.find('ProgressBar')).not.toBeEmptyRender();
    });

    describe('CircleProgressBar tests', () => {
        const props = {
            percent: 30,
            status: 'success',
            type: 'circle',
            showLabel: false,
        };

        const wrapper = mountWithApp(ProgressBar, {...props});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('ProgressBar')).toHaveProp(props);
        });
        it('should be circle', () => {
            expect(wrapper.find('.CircleProgressBarView')).toExist();
        });
    });

    describe('LineProgressBar tests', () => {
        const props = {
            percent: 30,
            status: 'success',
            type: 'line',
            showLabel: true,
            label: percent => `${percent}%`,
        };

        const wrapper = mountWithApp(ProgressBar, {...props});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('ProgressBar')).toHaveProp(props);
        });
        it('should be line', () => {
            expect(wrapper.find('.LineProgressBarView')).toExist();
        });
    });
});
