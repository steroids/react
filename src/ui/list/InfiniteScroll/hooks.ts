import {RefObject, useEffect} from 'react';

interface IIntersectionObserverConfig {
    target: RefObject<any>,
    onIntersect: (...args: any[]) => void,
    threshold?: number,
    rootMargin?: string,
    enabled: boolean,
}

export const defaultConfig = {
    threshold: 0.4,
    rootMargin: '0px',
};

export const useIntersectionObserver = (config: IIntersectionObserverConfig) => {
    useEffect(() => {
        if (!config.enabled) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => entry.isIntersecting && config.onIntersect()),
            {
                ...defaultConfig,
                threshold: config.threshold,
                rootMargin: config.rootMargin,
            },
        );

        const el = config.target?.current;

        if (!el) {
            return;
        }

        observer.observe(el);

        // eslint-disable-next-line consistent-return
        return () => {
            observer.unobserve(el);
        };
    }, [config.target.current, config.enabled]);
};
