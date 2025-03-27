import { Button, ButtonVariant } from "@/components/ui/Button";
import { Grid } from "@/components/ui/grid";
import {
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "@/components/ui/popover";
import { TextInput } from "@/components/ui/text-input";
import { useForm, Controller } from "react-hook-form";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/Switch";
import { CheckIcon, XIcon } from "@/components/icons";
import {
  UpdateUser,
  CreateUser as CreateUserApi,
} from "@/services/userService";
import { Loading } from "@/components/ui/Loading";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTDispatch } from "@/hooks/use-redux";
import { TextInputControl } from "@/components/ui/text-input-control";
import { User } from "@/types/user";
import { PasswordInput } from "@/components/ui/password-input";
import { useEffect, useState } from "react";
import { CompanyDropdown } from "@/components/parts/company-dropdown";
import { GetAllCompanies } from "@/services/companiesService";
import { Company } from "@/types/companies";
import { useNotify } from "@/components/ui/Notify";

const userSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    isSuperUser: z.boolean(),
    isActive: z.boolean(),
    companies: z
      .array(z.number())
      .min(1, "At least one company must be selected"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UserFormValues = z.infer<typeof userSchema>;

interface CreateUserProps {
  open: boolean;
  closeModal: () => void;
  user: User | null;
}

export const CreateUser = ({ open, closeModal, user }: CreateUserProps) => {
  const { notify } = useNotify();

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
      isSuperUser: user?.isSuperUser || false,
      isActive: user?.isActive || false,
      companies: user?.companies || [],
    },
  });

  const dispatch = useTDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const {
    companies,
    loading: companyLoading,
    error: companyError,
  } = useSelector((state: RootState) => state.company);

  useEffect(() => {
    dispatch(GetAllCompanies({}));
  }, [dispatch]);

  const onSubmit = async (
    data: UserFormValues & { confirmPassword?: string }
  ) => {
    try {
      const { confirmPassword, ...userData } = data;

      if (user) {
        await dispatch(
          UpdateUser({
            ...userData,
            id: user?.id ?? "0",
            isArchived: user?.isArchived ?? false,
          })
        );
        notify({
          status: "success",
          title: "Success!",
          message: "User Updated SuccessFully.",
        });
      } else {
        await dispatch(
          CreateUserApi({
            ...userData,
            isArchived: false,
          })
        );
        notify({
          status: "success",
          title: "Success!",
          message: "User Created SuccessFully.",
        });
      }

      reset();
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
      notify({
        status: "error",
        title: "Error Occured!",
        message: user ? "Error Updating User." : "Error Creating User.",
      });
    }
  };

  console.log(errors);

  return (
    open && (
      <Popover onClose={closeModal} size={Popover.Size.LARGE}>
        <Loading isLoading={loading}>
          <PopoverHeader onClose={closeModal}>
            {user ? "Update User" : "Add New User"}
          </PopoverHeader>
          <PopoverContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid>
                <Grid.Cell>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        className="w-full"
                        placeholder="Enter First Name"
                        label="First Name"
                        hasError={!!errors.firstName}
                        isRequired
                        feedback={errors.firstName?.message}
                      />
                    )}
                  />
                </Grid.Cell>

                <Grid.Cell>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        className="w-full"
                        placeholder="Enter Last Name"
                        label="Last Name"
                        hasError={!!errors.lastName}
                        isRequired
                        feedback={errors.lastName?.message}
                      />
                    )}
                  />
                </Grid.Cell>

                <Grid.Cell>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        className="w-full"
                        placeholder="Email"
                        label="Email"
                        hasError={!!errors.email}
                        isRequired
                        feedback={errors.email?.message}
                      />
                    )}
                  />
                </Grid.Cell>

                <Grid.Cell>
                  <Controller
                    name="companies"
                    control={control}
                    render={({ field }) => (
                      <CompanyDropdown
                        options={companies}
                        isMulti={true}
                        placeholder="Select Company"
                        selectedItems={field.value}
                        onSelect={(item: Company) => {
                          const newCompanies = field.value.includes(item.id)
                            ? field.value.filter((i) => i !== item.id)
                            : [...field.value, item.id];
                          field.onChange(newCompanies);
                        }}
                        hasError={!!errors.companies}
                        clearSelection={() => field.onChange([])}
                      />
                    )}
                  />
                </Grid.Cell>

                <Grid.Cell>
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
                        hasError={!!errors.password}
                        feedback={
                          errors.password ? errors.password.message : ""
                        }
                      />
                    )}
                  />
                </Grid.Cell>

                <Grid.Cell>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        label="Confirm Password"
                        className="w-full"
                        placeholder="Re-enter your password"
                        isRequired
                        hasError={!!errors.confirmPassword}
                        feedback={errors.confirmPassword?.message}
                      />
                    )}
                  />
                </Grid.Cell>

                <Grid.Cell>
                  <Controller
                    name="isSuperUser"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        size={Switch.size.SMALL}
                        checked={getValues("isSuperUser")}
                        label="Super User"
                        onIcon={<CheckIcon className="text-primary" />}
                        offIcon={<XIcon />}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Grid.Cell>

                <Grid.Cell>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        size={Switch.size.SMALL}
                        checked={getValues("isActive")}
                        label="Active"
                        onIcon={<CheckIcon className="text-primary" />}
                        offIcon={<XIcon />}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Grid.Cell>
              </Grid>

              <PopoverFooter>
                <Button isSubmit variant={ButtonVariant.Primary}>
                  {user ? "Update" : "Create"}
                </Button>
                <Button variant={ButtonVariant.Outline} onClick={closeModal}>
                  Cancel
                </Button>
              </PopoverFooter>
            </form>
          </PopoverContent>
        </Loading>
      </Popover>
    )
  );
};
