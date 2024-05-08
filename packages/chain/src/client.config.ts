import { ClientAppChain } from "@proto-kit/sdk";
import runtime from "./runtime";

const appChain = ClientAppChain.fromRuntime(runtime.modules);
const url = "https://drmmina_chain.kadircan.org/graphql";
appChain.configurePartial({
    Runtime: runtime.config,
    GraphqlClient: {
        url: url || "http://localhost:8080/graphql",
    },
});

export const client = appChain;
