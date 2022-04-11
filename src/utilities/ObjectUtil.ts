
type ObjectType = {
    [key: string]: any;
}

export class ObjectUtil {
    static compare = (data1: ObjectType, data2: ObjectType): boolean => {
        const data1Str = JSON.stringify(data1);
        const data2Str = JSON.stringify(data2);

        return data1Str === data2Str
    }

    static removeKeyValue = <
        T extends ObjectType = ObjectType,
        R extends ObjectType = ObjectType
    >(target: T, keys: string[]): R => {
        return Object.keys(target).filter((key) => {
            return ! keys.includes(key)
        })
        .reduce((pre, crr) => {
            return Object.assign(pre, {[crr]: target[crr]})
        }, {} as R)

    }
}