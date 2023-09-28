import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import RateField, {IRateFieldProps} from '../../../../src/ui/form/RateField/RateField';

describe('RateField', () => {
    const expectedRateFieldClassName = 'RateFieldView';
    const externalClass = 'external-class';
    const externalStyle = {width: '30px'};

    const props: IRateFieldProps = {
        className: externalClass,
        style: externalStyle,
        size: 'lg',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(RateField, props));
        const rateField = getElementByClassName(container, expectedRateFieldClassName);
        expect(rateField).toBeInTheDocument();
    });

    it('should have correct size', () => {
        const {container} = render(JSXWrapper(RateField, props));
        const rateField = getElementByClassName(container, expectedRateFieldClassName);
        expect(rateField).toHaveClass(`${expectedRateFieldClassName}_size_${props.size}`);
    });

    it('should have external styles and class', () => {
        const {container} = render(JSXWrapper(RateField, props));

        const rateField = getElementByClassName(container, expectedRateFieldClassName);

        expect(rateField).toHaveClass(externalClass);
        expect(rateField).toHaveStyle(externalStyle);
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(RateField, {
            ...props,
            disabled: true,
        }));

        const rateField = getElementByClassName(container, expectedRateFieldClassName);
        expect(rateField).toHaveClass(`${expectedRateFieldClassName}_disabled`);
    });

    it('should work itemsCount', () => {
        const rateItemsCount = 2;

        const {container, debug} = render(JSXWrapper(RateField, {
            ...props,
            itemsCount: rateItemsCount,
        }));

        const rateItems = container.querySelectorAll(`.${expectedRateFieldClassName}__rate-item`);
        expect(rateItems.length).toBe(rateItemsCount);
    });

    it('should fill stars after click and clear it after second click', () => {
        const {container} = render(JSXWrapper(RateField, {
            ...props,
            allowClear: true,
        }));

        const rateItems = container.querySelectorAll(`.${expectedRateFieldClassName}__rate-item`);

        fireEvent.click(rateItems[rateItems.length - 1]);
        rateItems.forEach(rateItem => expect(rateItem).toHaveClass(`${expectedRateFieldClassName}__rate-item_is-full`));

        fireEvent.click(rateItems[rateItems.length - 1]);
        rateItems.forEach(rateItem => expect(rateItem).not.toHaveClass(`${expectedRateFieldClassName}__rate-item_is-full`));
    });

    it('should have badge', () => {
        const badgeTitle = 'Badge';

        const {container} = render(JSXWrapper(RateField, {
            ...props,
            badge: {
                title: badgeTitle,
            },
        }));

        const badge = getElementByClassName(container, `${expectedRateFieldClassName}__badge`);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent(badgeTitle);
    });

    it('should have default value', () => {
        const {container} = render(JSXWrapper(RateField, {
            ...props,
            itemsCount: 3,
            defaultValue: 2,
        }));

        const rateItems = container.querySelectorAll(`.${expectedRateFieldClassName}__rate-item`);
        const rateItemsArray = Array.from(rateItems);
        const unfilledRateItem = rateItemsArray.pop();

        rateItemsArray.forEach((rateItem) => expect(rateItem).toHaveClass(`${expectedRateFieldClassName}__rate-item_is-full`));
        expect(unfilledRateItem).not.toHaveClass(`${expectedRateFieldClassName}__rate-item_is-full`);
    });
});
