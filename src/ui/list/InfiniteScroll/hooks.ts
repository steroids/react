import {RefObject, useEffect} from 'react';

interface IIntersectionObserverConfig {
    target: RefObject<any>,
    onIntersect: (...args: any[]) => void,
    enabled: boolean,
}

export const defaultConfig = {
    threshold: 0,
    rootMargin: '0px',
};

export const useIntersectionObserver = (config: IIntersectionObserverConfig) => {
    useEffect(() => {
        if (!config.enabled) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    config.onIntersect();
                }
            },
            {
                ...defaultConfig,
            },
        );

        const ref = config.target;

        if (!ref.current) {
            return;
        }

        observer.observe(ref.current);

        // eslint-disable-next-line consistent-return
        return () => {
            observer.unobserve(ref.current);
        };
    }, [config.target.current, config.enabled]);
};
