const STORE: Record<string, {
    deps: any[],
    value: any
}> = {};

export const useMemo = <TValue>(key: string,  deps: any[], factory: () => TValue): TValue => {
    const needsGeneration = !STORE.hasOwnProperty(key) || deps.find((val, ind) => val !== STORE[key].deps[ind]);
    if(needsGeneration) {
        STORE[key] = {
            value: factory(),
            deps,
        };
    }
    return STORE[key].value as TValue;
}