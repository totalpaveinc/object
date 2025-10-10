
export class ObjectUtils {
    private constructor() {}

    public static toArray<T = any>(o: {[key: string]: T}): T[] {
        let arr: T[] = [];
        for (let i in o) {
            arr.push(o[i]);
        }
        return arr;
    }

    /**
     * Merges o2 into o1. Only does shallow merges.
     * o2 properties will overwrite o1 properties.
     * 
     * @param o1 The base object
     * @param o2 The merging object
     */
    public static merge<T1 = any, T2 = any>(o1: T1, o2: T2): Record<string, any> {
        return {
            ...o1,
            ...o2
        };
    }

    public static clone<T = any>(input: T): T {
        // T lacks the typings to allow us to generically just check for function existance and type check stuff. Typescript will complain a lot.
        // So we're going to hackishly make typescript ignore that stuff but expanding the type to any. 
        let o: any = input;

        // Check for pass-by-val types
        if (!o || o === true || typeof o === 'string' || typeof o === 'number') {
            return o;
        }

        if (typeof o.clone === 'function') {
            return o.clone();
        }

        if (o instanceof Date) {
            return new Date(o.getTime()) as T;
        }

        if (o instanceof Blob) {
            return new Blob([o], {"type": o.type}) as T;
        }

        let isArray: boolean = o instanceof Array;
        let obj: any = isArray ? [] : {};
        
        for (let i in o) {
            let value = o[i];

            if (!value || value === true || typeof value === 'string' || typeof value === 'number') { // typeof null === 'object'
                // Don't do anything for pass-by-val types
            }
            else if (value instanceof Array) {
                value = ObjectUtils.clone(value);
            }
            else if (value instanceof Date) {
                value = new Date(value.getTime());
            }
            else if (value instanceof Blob) {
                value = new Blob([value], {"type":value.type});
            }
            else if (typeof value === 'object') {
                if (value !== null && typeof value.clone === 'function') {
                    value = value.clone();
                }
                else if (value !== null) {
                    value = ObjectUtils.clone(value);
                }
            }

            obj[i] = value;
        }

        return obj;
    }

    /**
     * Returns true if the input object is null or undefined.
     * 
     * @param o 
     */
    public static isVoid<T = any>(o: T): boolean {
        return o === null || o === undefined;
    }

    /**
     * Recursively compares two objects to determine if they are the same
     * value wise. Will return true if the two objects
     * are referencing two different objects, but both
     * objects have the same keys and values.
     * 
     * If an object has a `compare()` method, it will be invoked via
     * `o1.compare(o2)`. See `IComparable` interface
     * 
     * @param o1 
     * @param o2 
     */
    public static compare(o1: any, o2: any): boolean {
        if (ObjectUtils.isVoid(o1) || ObjectUtils.isVoid(o2)) {
            return o1 === o2;
        }

        if (o1.toString() === 'NaN' && o2.toString() === 'NaN') {
            return true;
        }

        if (!o1 || o1 === true || typeof o1 === 'string' || typeof o1 === 'number') {
            return o1 === o2;
        }

        if (o1.compare) {
            return o1.compare(o2);
        }

        if (o1 instanceof Array) {
            if (o2 instanceof Array) {
                if (o1.length === o2.length) {
                    for (let i: number = 0; i < o1.length; i++) {
                        let o1v: any = o1[i];
                        let o2v: any = o2[i];
                        if (!ObjectUtils.compare(o1v, o2v)) {
                            return false;
                        }
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else if (o1 instanceof Date) {
            if (o2 instanceof Date) {
                return o1.toString() === o2.toString();
            }
            else {
                return false;
            }
        }
        else if (o1 instanceof Function) {
            if (o2 instanceof Function) {
                return o1.toString() === o2.toString();
            }
            else {
                return false;
            }
        }
        // These are react nodes
        if (o1.$$typeof) {
            return o1 === o2;
        }
        // If there are more types to test, you may want to follow the pattern above
        else if (typeof o1 === 'object') {
            if (typeof o2 === 'object') {
                if (Object.keys(o1).length === Object.keys(o2).length) {
                    for (let i in o1) {
                        let o1v: any = o1[i];
                        let o2v: any = o2[i];
                        if (!ObjectUtils.compare(o1v, o2v)) {
                            return false;
                        }
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }

        return true;
    }

    public static keySearch(o: any, regex: RegExp): string[] {
        if (!o) {
            return [];
        }

        if (!regex) {
            return [];
        }

        let keys = Object.keys(o);
        let results: string[] = [];

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (regex.test(key)) {
                results.push(key);
            }
        }

        return results;
    }

    /**
     * returns true if the object has at least 1 property
     * @param obj 
     * @returns 
     */
    public static hasProps(obj: any): boolean {
        for (let key in obj) {
            return true;
        }
        return false;
    }

    public static isEqual(objOne: any, objTwo: any): boolean {
        if (ObjectUtils.isVoid(objOne) || ObjectUtils.isVoid(objTwo)) {
            return objOne === objTwo;
        }
        
        if (Object.keys(objOne).length !== Object.keys(objTwo).length){
            return false;
        }

        for (let key in objOne) {
            if (objOne[key] !== objTwo[key]){
                return false;
            }
        }

        return true;
    }
}
