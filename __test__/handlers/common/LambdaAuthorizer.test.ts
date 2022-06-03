import { LambdaAuthorizerHandler } from "@/handlers/common/LambdaAuthorizer";
import { APIGatewayAuthorizerResult } from "aws-lambda";
import {
    createAgAuthorizerCallback as createCallback,
    createContext,
    createAgAuthorizerEvent as createEvent
} from '/__test__/__testUtils__';

const handler = new LambdaAuthorizerHandler();

const context = createContext();
const callback = createCallback();

describe("正常系", () => {
    test("シングルトンであるか", () => {
        const handler1 = new LambdaAuthorizerHandler();
        const handler2 = new LambdaAuthorizerHandler();

        expect(handler1 === handler2).toBe(true);
    })

    test("鍵を渡せばAllowで返ってくること(type: TOKEN)", async () => {
        const event = createEvent("TOKEN", {
            authorizationToken: process.env.AUTHORIZATION_KEY
        })
        const result = await handler.handler(event, context, callback)

        expect(result)
            .toStrictEqual(handler.agAuthorizerResponseBuilder(event, "Allow"))

    })

    test("鍵を渡せばAllowで返ってくること(type: REQUEST)", async () => {
        const event = createEvent("REQUEST", {
            headers: {
                [handler.getAuthHeaderKey()]: `Bearer ${process.env.AUTHORIZATION_KEY}`
            }
        })
        const result = await handler.handler(event, context, callback)

        expect(result)
            .toStrictEqual(handler.agAuthorizerResponseBuilder(event, "Allow"))
    })

    test("誤った鍵を渡せばDenyで返ってくること(type: TOKEN)", async () => {
        const event = createEvent("TOKEN", {
            authorizationToken: "test"
        })
        const result = await handler.handler(event, context, callback)

        expect(result)
            .toStrictEqual(handler.agAuthorizerResponseBuilder(event, "Deny"))

    })

    test("誤った鍵を渡せばDenyで返ってくること(type: REQUEST)", async () => {
        const event = createEvent("REQUEST", {
            headers: {
                [handler.getAuthHeaderKey()]: `Bearer test`
            }
        })
        const result = await handler.handler(event, context, callback)

        expect(result)
            .toStrictEqual(handler.agAuthorizerResponseBuilder(event, "Deny"))
    })
})