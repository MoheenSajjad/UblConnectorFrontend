import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/text-input";
import { login } from "@/redux/reducers/authSlice";
import { useAuth } from "@/hooks/use-auth";
import { useTDispatch } from "@/hooks/use-redux";
import { Controller, useForm } from "react-hook-form";
import { PasswordInput } from "@/components/ui/password-input";
import { Grid, GridCell } from "@/components/ui/grid";
import { Loading } from "@/components/ui/Loading";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password must be at least 6 characters"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useTDispatch();
  const { isAuthenticated, isLoading, error: AuthError } = useAuth();
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});

  const {
    control,
    handleSubmit,

    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const SubmitData = async (data: any) => {
    try {
      loginSchema.parse(data);
      await dispatch(login(data));
      // reset();
    } catch (err) {
      console.log("error");
    }
  };
  console.log(errors);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <Loading isLoading={isLoading}>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#233558]">
                Welcome Back
              </h1>
              <p className="text-gray-600 mt-2">Please sign in to continue</p>
            </div>

            {AuthError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {AuthError}
              </div>
            )}

            <form
              {...loginSchema}
              onSubmit={handleSubmit(SubmitData)}
              className="space-y-6"
            >
              <Grid>
                <Grid.Cell size={Grid.CellSize.S12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        className="w-full"
                        placeholder="Enter email"
                        label="Email"
                        hasError={!!errors.email}
                        isRequired
                        feedback={errors.email?.message}
                      />
                    )}
                  />
                </Grid.Cell>
                <Grid.Cell size={Grid.CellSize.S12}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        label="Password"
                        className="w-full"
                        placeholder="Enter your password"
                        isRequired
                        isDisabled={isLoading}
                        hasError={!!errors.password}
                        feedback={
                          errors.password ? errors.password.message : ""
                        }
                      />
                    )}
                  />
                </Grid.Cell>
              </Grid>

              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                size={ButtonSize.Medium}
                fullWidth
                disabled={isLoading}
              >
                Sign In
              </Button>
            </form>
          </div>
        </Loading>
      </div>
    </div>
  );
};

export default Login;
