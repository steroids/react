import {MaskitoOptions, MaskitoPlugin} from '@maskito/core';

export const timeToMinutes = (value: string): number => {
    const [h, m] = value.split(':').map(Number);

    return h * 60 + m;
};

const isCompleteTime = (value: string) => /^\d{2}:\d{2}$/.test(value);

export const minutesToTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const createTimeRangePlugin = (
    from?: string,
    to?: string,
): MaskitoPlugin => {
    const fromMin = from ? timeToMinutes(
        /^\d:\d{2}$/.test(from) ? `0${from}` : from,
    ) : 0;

    const toMin = to ? timeToMinutes(
        /^\d:\d{2}$/.test(to) ? `0${to}` : to,
    ) : 24 * 60 - 1;

    return element => {
        element.addEventListener('input', () => {
            const value = element.value;

            if (!isCompleteTime(value)) {
                return;
            }

            let minutes = timeToMinutes(value);

            if (minutes < fromMin) {
                minutes = fromMin;
            }

            if (minutes > toMin) {
                minutes = toMin;
            }

            const normalized = minutesToTime(minutes);

            if (normalized !== value) {
                element.value = normalized;
            }
        });
    };
};

export const createTimeMask = (
    options?: {
        from?: string,
        to?: string,
        minuteStep?: number,
    },
): MaskitoOptions => ({
    mask: [/\d/, /\d/, ':', /\d/, /\d/],
    preprocessors: [
        ({elementState}) => {
            let {value} = elementState;

            // авто-добавление ведущего нуля
            if (/^\d:\d\d$/.test(value)) {
                value = `0${value}`;
            }

            return {
                elementState: {...elementState,
                    value},
            };
        },
    ],
    postprocessors: [
        ({value, selection}) => {
            if (!/^\d{2}:\d{2}$/.test(value)) {
                return {value,
                    selection};
            }

            let [h, m] = value.split(':').map(Number);

            if (Number.isNaN(h) || Number.isNaN(m)) {
                return {value,
                    selection};
            }

            // Ограничение часов
            if (h > 23) {
                h = 23;
            }

            // Ограничение минут
            if (m > 59) {
                m = 59;
            }

            // Шаг минут
            if (options?.minuteStep && options.minuteStep > 1) {
                m = Math.floor(m / options.minuteStep)
                    * options.minuteStep;
            }

            const nextValue = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

            return {
                value: nextValue,
                // курсор оставляем как есть
                selection,
            };
        },
    ],
    plugins: [
        createTimeRangePlugin(options?.from, options?.to),
    ],
});
