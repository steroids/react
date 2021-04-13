import useComponents from './useComponents';

export interface IBem {
    (...classes: any[]): string,
    element(...classes: any[]): string,
    block(...classes: any[]): string,
}

/**
 * Bem Hook
 * Возвращает утилиту `bem` для правильной генерации CSS классов по методологии БЭМ (блок, элемент, модификатор)
 */
export default function useBem(namespace: string): IBem {
    return useComponents().html.bem(namespace);
}
