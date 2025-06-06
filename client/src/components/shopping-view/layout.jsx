import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";

function ShoppingLayout() {
  useEffect(() => {
    // Track customer visits (only on shopping pages, not admin)
    const sessionVisited = sessionStorage.getItem('customerSessionVisited');
    if (!sessionVisited) {
      const currentVisits = parseInt(localStorage.getItem('customerVisits') || '0');
      const newVisits = currentVisits + 1;
      localStorage.setItem('customerVisits', newVisits.toString());
      sessionStorage.setItem('customerSessionVisited', 'true');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-1">
        <Outlet />
      </main>
      {/* common footer */}
      <ShoppingFooter />
    </div>
  );
}

export default ShoppingLayout;
