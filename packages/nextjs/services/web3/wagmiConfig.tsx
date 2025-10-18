import { wagmiConnectors } from "./wagmiConnectors";
import { Chain, createClient, http } from "viem";
import { mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";

const { targetNetworks } = scaffoldConfig;

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([...targetNetworks, mainnet] as const);

export const wagmiConfig = createConfig({
  chains: enabledChains,
  connectors: wagmiConnectors(),
  ssr: true,
  client: ({ chain }: { chain: any }) => {
    // 使用更稳定的 RPC 配置
    let rpcUrl = `https://testnet-rpc.monad.xyz/`;

    // 根据链ID选择RPC
    if (chain.id === 10143) {
      rpcUrl = `https://testnet-rpc.monad.xyz/`;
    } else if (chain.id === 1) {
      rpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${scaffoldConfig.alchemyApiKey}`;
    } else if (chain.id === 31337) {
      rpcUrl = `http://localhost:8545`;
    }

    return createClient({
      chain,
      transport: http(rpcUrl, {
        retryCount: 3,
        retryDelay: 1000,
        timeout: 10000,
      }),
      pollingInterval: 10000, // 增加轮询间隔
      batch: {
        multicall: {
          batchSize: 1024,
          wait: 16,
        },
      },
    });
  },
});
