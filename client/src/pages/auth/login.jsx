import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, googleLoginUser } from "@/store/auth-slice";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  function handleGoogleLoginSuccess(credentialResponse) {
  const googleToken = credentialResponse.credential;

  dispatch(googleLoginUser({ googleToken })).then((data) => {
    if (data?.payload?.success) {
      toast({ title: data?.payload?.message });
    } else {
      toast({ title: data?.payload?.message, variant: "destructive" });
    }
  });
}


  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      <div className="text-center">
        <p className="text-muted-foreground">Or sign in with</p>
        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => {
              toast({ title: "Google Sign-In failed", variant: "destructive" });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AuthLogin;
