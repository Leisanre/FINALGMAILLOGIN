import { LogOut, Menu, ShoppingCart, UserCog, Search } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import SearchBar from "./search-bar";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "about" &&
      getCurrentMenuItem.id !== "contact" &&
      getCurrentMenuItem.id !== "store"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row lg:text-left text-right">
      {shoppingViewHeaderMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path ||
          (menuItem.id === "products" && location.pathname === "/shop/listing");
        
        return (
          <Label
            onClick={() => handleNavigate(menuItem)}
            className={`text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out relative group ${
              isActive
                ? 'text-[#126c1b] font-semibold'
                : 'text-gray-700 hover:text-[#126c1b] hover:scale-105'
            }`}
            key={menuItem.id}
          >
            {menuItem.label}
            {/* Active indicator underline */}
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-[#126c1b] transition-all duration-300 ${
                isActive ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </Label>
        );
      })}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  console.log(cartItems, "sangam");

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4 items-end lg:items-center">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if current page is Home or Products (listing)
  const showSearchHeader = location.pathname === "/shop/home" || location.pathname === "/shop/listing";

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="relative h-16">
          <div className="container mx-auto h-full flex items-center justify-between">
            {/* Logo - Left Side */}
            <div className="flex items-center gap-2">
              <Link to="/shop/home" className="flex items-center gap-2">
                <img
                  src="/src/assets/logoLight.png"
                  alt="BookSale"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Right Side - Mobile and Desktop */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle header menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full max-w-xs">
                    <MenuItems />
                    <HeaderRightContent />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop User Controls */}
              <div className="hidden lg:block">
                <HeaderRightContent />
              </div>
            </div>
          </div>

          {/* Absolutely Centered Navigation - Desktop Only */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <MenuItems />
          </div>
        </div>
      </header>

      {/* Second Header with Search Bar - Only on Home and Products pages */}
      {showSearchHeader && (
        <div className="w-full h-16" style={{ backgroundColor: '#126c1b' }}>
          <div className="flex h-16 items-center justify-center px-4 md:px-6">
            <SearchBar />
          </div>
        </div>
      )}
    </>
  );
}

export default ShoppingHeader;
