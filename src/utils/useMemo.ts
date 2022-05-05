const STORE: Record<string, {
    deps: any[],
    value: any
}> = {};

export const useMemo = <TValue>(factory: () => TValue, key: string, deps: any[] | false = false): TValue => {
    const needsGeneration = !STORE.hasOwnProperty(key) 
        || deps !== false && (deps.length > 0 && deps.find((val, ind) => (val !== STORE[key].deps[ind])) !== undefined);
    if(needsGeneration) {
        STORE[key] = {
            value: factory(),
            deps : deps as any,
        };
    }
    return STORE[key].value as TValue;
}