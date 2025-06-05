import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth } from "./store/auth-slice";
import { Progress } from "@/components/ui/progress";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [progressValue, setProgressValue] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const [delayedAuth, setDelayedAuth] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Control the delayed authentication state for 3-second minimum loading
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // User successfully authenticated, show loading for 3 seconds
      setShowLoading(true);
      const delayTimer = setTimeout(() => {
        setDelayedAuth({
          isAuthenticated,
          user,
          isLoading: false
        });
        setShowLoading(false);
      }, 2000);

      return () => clearTimeout(delayTimer);
    } else if (!isLoading && !isAuthenticated) {
      // Not authenticated, hide loading immediately
      setDelayedAuth({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
      setShowLoading(false);
    }
  }, [isLoading, isAuthenticated, user]);

  // Animate progress bar when loading
  useEffect(() => {
    if (showLoading) {
      setProgressValue(0);
      
      // First stage: gradually increase to 30 over 1 second
      const interval1 = setInterval(() => {
        setProgressValue(prev => {
          if (prev < 30) {
            return prev + 1;
          }
          clearInterval(interval1);
          return prev;
        });
      }, 33); // Update every 33ms (30 updates * 33ms = ~1 second)

      // Second stage: wait then go to 100
      const timer2 = setTimeout(() => {
        const interval2 = setInterval(() => {
          setProgressValue(prev => {
            if (prev < 100) {
              return prev + 2;
            }
            clearInterval(interval2);
            return prev;
          });
        }, 20); // Faster animation for second stage (35 updates * 20ms = 0.7 seconds)
      }, 1200); // Wait 1.2 seconds before second stage

      return () => {
        clearInterval(interval1);
        clearTimeout(timer2);
      };
    } else {
      setProgressValue(0);
    }
  }, [showLoading]);

  if (showLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Loading...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we verify your authentication</p>
          </div>
          <Progress value={progressValue} className="w-full" />
        </div>
      </div>
    );
  }

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={delayedAuth.isAuthenticated}
              user={delayedAuth.user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={delayedAuth.isAuthenticated} user={delayedAuth.user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={delayedAuth.isAuthenticated} user={delayedAuth.user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={delayedAuth.isAuthenticated} user={delayedAuth.user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
