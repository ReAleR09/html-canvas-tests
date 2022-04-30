const STORE: Record<string, {
    deps: any[],
    value: any
}> = {};

export const useMemo = <TValue>(factory: () => TValue, key: string, deps: any[]): TValue => {
    const needsGeneration = !STORE.hasOwnProperty(key) || deps.find((val, ind) => {
        const differs = val !== STORE[key].deps[ind];
        return differs;
    }) !== undefined;
    if(needsGeneration) {
        STORE[key] = {
            value: factory(),
            deps,
        };
    }
    return STORE[key].value as TValue;
}