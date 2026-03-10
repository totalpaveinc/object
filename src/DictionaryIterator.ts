
import {Iterator} from './Iterator';
import {ObjectUtils} from './ObjectUtils';

export class DictionaryIterator<T extends object = any> extends Iterator<any> {
    private $dict: T;

    constructor(data: T) {
        super(Object.keys(ObjectUtils.clone<T>(data)));
        this.$dict = data;
    }

    public override next(): {key: keyof T; value: T[keyof T]} {
        let key = super.next();
        return {
            key: key,
            value : (this.$dict as any)[key]
        };
    }

    public override previous(): {key: keyof T; value: T[keyof T]} {
        let key = super.previous();
        return {
            key: key,
            value: (this.$dict as any)[key]
        };
    }
}
