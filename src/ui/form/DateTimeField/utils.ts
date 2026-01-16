import {MaskitoOptions} from '@maskito/core';
import {maskitoDateTimeOptionsGenerator} from '@maskito/kit';
import {minutesToTime, timeToMinutes} from '@steroidsjs/core/ui/form/TimeField/utils';

const TIME_REGEXP = /(\d{2}:\d{2})$/;

const clampTime = (
    minutes: number,
    fromMin: number,
    toMin: number,
    step?: number,
) => {
    // Жёсткие границы
    if (minutes <= fromMin) {
        return fromMin;
    }

    if (minutes >= toMin) {
        return toMin;
    }

    if (!step || step <= 1) {
        return minutes;
    }

    // Округление относительно from
    const diff = minutes - fromMin;

    return fromMin + Math.floor(diff / step) * step;
};

export const createDateTimeMask = (options?: {
    from?: string,
    to?: string,
    minuteStep?: number,
    min?: Date,
    dateTimeSeparator?: string,
}): MaskitoOptions => {
    const baseMask = maskitoDateTimeOptionsGenerator({
        dateMode: 'dd/mm/yyyy',
        timeMode: 'HH:MM',
        dateSeparator: '.',
        min: options.min,
        dateTimeSeparator: options.dateTimeSeparator,
    });

    return {
        ...baseMask,
        postprocessors: [
            ...(baseMask.postprocessors ?? []),
            ({value, selection}) => {
                if (!value) {
                    return {value,
                        selection};
                }

                const match = value.match(TIME_REGEXP);
                if (!match) {
                    return {value,
                        selection};
                }

                const time = match[1];
                const minutes = timeToMinutes(time);

                const fromMin = options?.from
                    ? timeToMinutes(options.from.padStart(5, '0'))
                    : 0;

                const toMin = options?.to
                    ? timeToMinutes(options.to.padStart(5, '0'))
                    : 24 * 60 - 1;

                const clamped = clampTime(
                    minutes,
                    fromMin,
                    toMin,
                    options?.minuteStep,
                );

                const normalizedTime = minutesToTime(clamped);

                if (normalizedTime === time) {
                    return {value,
                        selection};
                }

                return {
                    value: value.replace(TIME_REGEXP, normalizedTime),
                    selection,
                };
            },
        ],
    };
};
