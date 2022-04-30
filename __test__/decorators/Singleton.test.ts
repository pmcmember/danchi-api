import { Singleton, SINGLETON_KEY } from '@/decorators';

@Singleton
class Store {
    private data: {id: number}[] = [];

    public add(item: {id: number}) {
        this.data.push(item);
    }

    public get(id: number) {
        return this.data.find((d) => d.id === id);
    }
}

describe("正常系", () => {
    test("シングルトンかどうか", () => {
        const store1 = new Store();
        store1.add({id: 1});
        store1.add({id: 2});
        store1.add({id: 3});
        const store2 = new Store();

        expect(store2.get(2)).toStrictEqual({id: 2});
        expect(store1 === store2).toBe(true)
    })
})