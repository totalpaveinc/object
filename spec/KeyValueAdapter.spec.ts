
import {KeyValueAdapter} from '../src/KeyValueAdapter';

describe('KeyValueAdapter', () => {
    it('adapt', () => {
        interface ITestMap {
            test: string;
            value: string;
        }

        interface ITestOutMap {
            hi: string;
            world: string;
        }

        let adapter: KeyValueAdapter<ITestMap, ITestOutMap> = new KeyValueAdapter({
            test: "hi",
            value: "world"
        });

        expect(adapter.adapt('test')).toBe('hi');
        expect(adapter.adapt('value')).toBe('world');
    });

    it('setAdapterMap', () => {
        interface ITestMap {
            test: string;
            value: string;
        }

        interface ITestOutMap {
            hi: string;
            world: string;
            rawr: string;
            thesky: string;
        }

        let adapter: KeyValueAdapter<ITestMap, ITestOutMap> = new KeyValueAdapter({
            test: "hi",
            value: "world"
        });

        expect(adapter.adapt('test')).toBe('hi');
        expect(adapter.adapt('value')).toBe('world');

        adapter.setAdapterMap({
            test: 'thesky',
            value: 'rawr'
        });

        expect(adapter.adapt('test')).toBe('thesky');
        expect(adapter.adapt('value')).toBe('rawr');
    });


    it('setAdaptKey', () => {
        interface ITestMap {
            test: string;
            value: string;
            rawr: string | null;
        }

        interface ITestOutMap {
            hi: string;
            world: string;
            thesky: string;
        }

        let adapter: KeyValueAdapter<ITestMap, ITestOutMap> = new KeyValueAdapter({
            test: "hi",
            value: "world",
            rawr: 'hi'
        });

        expect(adapter.adapt('test')).toBe('hi');
        expect(adapter.adapt('value')).toBe('world');

        adapter.setAdapterKey('rawr', 'thesky');

        expect(adapter.adapt('test')).toBe('hi');
        expect(adapter.adapt('value')).toBe('world');
        expect(adapter.adapt('rawr')).toBe('thesky');
    });

    it('should error', () => {
        let adapter: KeyValueAdapter<any, any> = new KeyValueAdapter({
            test: "hi",
            value: "world"
        });

        let key = "asdf";
        expect(() => {
            adapter.adapt(key);
        }).toThrow(`Key "${key}" doesn't exist in map.`);
    });

    it('hasMapping should return true', () => {
        interface ITestMap {
            test: string;
            value: string;
        }

        interface ITestOutMap {
            hi: string;
            world: string;
        }

        let adapter: KeyValueAdapter<ITestMap, ITestOutMap> = new KeyValueAdapter({
            test: "hi",
            value: "world"
        });

        expect(adapter.hasMapping('value')).toBe(true);
    });

    it('hasMapping should return false', () => {
        let adapter = new KeyValueAdapter<any, any>({
            test: "hi",
            value: "world"
        });

        expect(adapter.hasMapping('doesnotexist')).toBe(false);
    });
});
