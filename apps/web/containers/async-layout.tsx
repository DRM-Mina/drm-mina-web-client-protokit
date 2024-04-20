import SearchBar from "@/app/components/searchbar";
import { Sidebar } from "@/app/components/sidebar";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useBalancesStore, useObserveBalance } from "@/lib/stores/balances";
import { useChainStore, usePollBlockHeight } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { ReactNode, useEffect, useMemo } from "react";

export default function AsyncLayout({ children }: { children: ReactNode }) {
  const wallet = useWalletStore();
  const client = useClientStore();
  const chain = useChainStore();
  const balances = useBalancesStore();

  usePollBlockHeight();
  useObserveBalance();
  useNotifyTransactions();

  useEffect(() => {
    client.start();
  }, []);

  useEffect(() => {
    wallet.initializeWallet();
    wallet.observeWalletChange();
  }, []);

  const loading = useMemo(
    () => client.loading || balances.loading,
    [client.loading, balances.loading],
  );

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <div className="absolute inset-0 border-t">
          <div className="absolute inset-0 bg-background">
            <div className="grid grid-cols-6">
              <Sidebar className="sticky top-0 col-span-1" />
              <main className=" col-start-2 col-end-7 overflow-hidden">
                <SearchBar></SearchBar>
                {children}
              </main>
              <Toaster />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
