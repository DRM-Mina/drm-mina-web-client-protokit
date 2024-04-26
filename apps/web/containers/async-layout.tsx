import SearchBar from "@/app/components/searchbar";
import { Sidebar } from "@/app/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useObserveBalance } from "@/lib/stores/balances";
import { usePollBlockHeight } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useObserveLibrary } from "@/lib/stores/marketOperations";
import { useNotifyTransactions } from "@/lib/stores/transactionStore";
import { ReactNode, useEffect } from "react";

export default function AsyncLayout({ children }: { children: ReactNode }) {
  const client = useClientStore();

  usePollBlockHeight();
  useObserveBalance();
  useNotifyTransactions();
  useObserveLibrary();

  useEffect(() => {
    client.start();
  }, []);

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
