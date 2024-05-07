import { ClientAppChain } from "@proto-kit/sdk";
import runtime from "./runtime";

const appChain = ClientAppChain.fromRuntime(runtime.modules);
const url = "http://167.71.35.19/graphql";
appChain.configurePartial({
    Runtime: runtime.config,
    GraphqlClient: {
        url: url || "http://localhost:8080/graphql",
    },
});

export const client = appChain;
