import '@testing-library/jest-dom';
import ProgressBar from '../../../../src/ui/layout/ProgressBar/ProgressBar';
import {JSXWrapper, getElementByClassName, render} from '../../../helpers';

describe('CircleProgressBar tests', () => {
    const props = {
        percent: 30,
        type: 'circle',
        showLabel: true,
        label: percent => `${percent}%`,
    };

    const expectedCircleProgressBarClassName = 'CircleProgressBarView';

    const wrapper = JSXWrapper(ProgressBar, props);

    it('should be in the document', async () => {
        const {container} = render(wrapper);
        const progressBar = getElementByClassName(container, expectedCircleProgressBarClassName);

        expect(progressBar).toBeInTheDocument();
    });

    it('should have label', () => {
        const expectedLabel = props.percent + '%';

        const {getByText} = render(wrapper);

        expect(getByText(expectedLabel)).toBeInTheDocument();
    });
});

describe('LineProgressBar tests', () => {
    const props = {
        percent: 30,
        type: 'line',
        showLabel: true,
        label: percent => `${percent}%`,
    };

    const expectedLineProgressBarClassName = 'LineProgressBarView';

    const wrapper = JSXWrapper(ProgressBar, props);

    it('should be in the document', async () => {
        const {container} = render(wrapper);
        const progressBar = getElementByClassName(container, expectedLineProgressBarClassName);

        expect(progressBar).toBeInTheDocument();
    });

    it('should have percent styles', () => {
        const progressLineClassName = 'LineProgressBarView__progressLine';
        const expectedStyles = {
            width: props.percent + '%',
        };

        const {container} = render(wrapper);

        const progress = getElementByClassName(container, progressLineClassName);

        expect(progress).toHaveStyle(expectedStyles);
    });

    it('should have label', () => {
        const expectedLabel = props.percent + '%';

        const {getByText} = render(wrapper);

        expect(getByText(expectedLabel)).toBeInTheDocument();
    });
});
