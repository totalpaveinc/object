
import {ObjectUtils} from './ObjectUtils';
import {DictionaryIterator} from './DictionaryIterator';

export class Immutable<T extends object> {
    private $data: T;

    public constructor(data: T) {
        this.$data = data;
    }

    public set(key: keyof T, value: T[keyof T]): Immutable<T> {
        let data = ObjectUtils.clone(this.$data);
        data[key] = value;
        return new Immutable(data);
    }

    public remove(key: keyof T): Immutable<T> {
        let data = ObjectUtils.clone(this.$data);
        delete data[key];
        return new Immutable(data);
    }

    public get(key: keyof T): T[keyof T] {
        return this.$data[key];
    }

    public clone(): Immutable<T> {
        return new Immutable(ObjectUtils.clone(this.$data));
    }

    public iterator(): DictionaryIterator {
        return new DictionaryIterator(this.$data);
    }

    public keyLength(): number {
        return Object.keys(this.$data).length;
    }
}
