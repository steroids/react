import useComponents from './components';

export interface IBemHookOutput {
    (...classes: any[]): string,
    element(...classes: any[]): string,
    block(...classes: any[]): string,
}

/**
 * Bem Hook
 * Возвращает утилиту `bem` для правильной генерации CSS классов по методологии БЭМ (блок, элемент, модификатор)
 */
export default function (namespace: string): IBemHookOutput {
    return useComponents().html.bem(namespace);
}
