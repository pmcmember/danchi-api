export class Base64Util {
    public static encode(target: string): string {
        return Buffer.from(target).toString("base64");
    }

    public static decode(target: string): string {
        return Buffer.from(target, "base64").toString();
    }
}