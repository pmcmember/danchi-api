/**
 * シングルトン保障のため、実行プロセス中のユニークなキーとして使用
 */
export const SINGLETON_KEY = Symbol();

export type Singleton<T extends new (...args: any[]) => any> = T & {
    [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never
}

/**
 * シングルトンデコレータ
 * @param type デコレータを付与したクラス
 */
export const Singleton = <T extends new (...args: any[]) => any>(type: T) => {
    return new Proxy(type, {
        construct(target: Singleton<T>, props, newTarget) {
            // 新旧比較し異なっていた場合は旧の方を返す
            if(target.prototype !== newTarget.prototype) {
                return Reflect.construct(target, props, newTarget);
            }
            // インスタンスが作成されていない場合は作成
            if( ! target[SINGLETON_KEY]) {
                target[SINGLETON_KEY] = Reflect.construct(target, props, newTarget);
            }
            return target[SINGLETON_KEY]
        }
    })
}