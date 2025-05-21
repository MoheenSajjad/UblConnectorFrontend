import { Button, ButtonVariant } from "@/components/ui/Button";
import { useNotify } from "@/components/ui/Notify";
import { Grid } from "@/components/ui/grid";
import {
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "@/components/ui/popover";
import { TextInput } from "@/components/ui/text-input";
import { Company } from "@/types/companies";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputControl } from "@/components/ui/text-input-control";
import { Switch } from "@/components/ui/Switch";
import { CheckIcon } from "@/components/icons";
import { XIcon } from "@/components/icons";
import {
  UpdateCompany,
  CreateCompany as AddNewCompany,
  GetCompanies,
  GetAllCompanies,
} from "@/services/companiesService";
import { Loading } from "@/components/ui/Loading";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTDispatch } from "@/hooks/use-redux";
import { Alert } from "@/components/ui/Alert";
import { PasswordInput } from "@/components/ui/password-input";
import { testSAPConnection } from "@/services/sapService";
import { ApiResponse } from "@/types";
import { useState } from "react";

const companySchema = z.object({
  companyId: z.string().min(2, "Company ID is required"),
  partyId: z.string().min(2, "partyId is required"),
  chamberOfCommerceId: z.string().min(2, "partyId is required"),
  name: z.string().min(1, "Company Name is required"),
  email: z.string().email("Invalid email format"),
  sapUrl: z.string().min(1),
  userName: z.string().min(1),
  password: z.string().min(1),
  companyDB: z.string().min(1),
  b2bRouterBaseUrl: z.string().min(1),
  b2bRouterAuthKey: z.string().min(1),
  jobDelay: z.number().default(60),
  isActive: z.boolean(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CreateCompanyProps {
  open: boolean;
  closeModal: () => void;
  company: Company | null;
}

export const CreateCompany = ({
  open,
  closeModal,
  company,
}: CreateCompanyProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { notify } = useNotify();

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyId: company?.companyId || "",
      partyId: company?.partyId || "",
      chamberOfCommerceId: company?.chamberOfCommerceId || "",
      name: company?.name || "",
      email: company?.email || "",
      sapUrl: company?.sapUrl,
      password: company?.password,
      userName: company?.userName,
      companyDB: company?.companyDB,
      b2bRouterBaseUrl: company?.b2bRouterBaseUrl,
      b2bRouterAuthKey: company?.b2bRouterAuthKey,
      jobDelay: company?.jobDelay,
      isActive: company?.isActive || false,
    },
  });

  const dispatch = useTDispatch();
  const { loading, error, pageNumber, pageSize } = useSelector(
    (state: RootState) => state.company
  );

  const handelTestSAPConnection = async () => {
    const { sapUrl, userName, companyDB } = getValues();

    let hasError = false;

    if (!sapUrl) {
      setError("sapUrl", {
        type: "manual",
        message: "SAP URL is required",
      });
      hasError = true;
    }
    if (!sapUrl) {
      setError("password", {
        type: "manual",
        message: "SAP Password is required",
      });
      hasError = true;
    }

    if (!userName) {
      setError("userName", {
        type: "manual",
        message: "Username is required",
      });
      hasError = true;
    }

    if (!companyDB) {
      setError("companyDB", {
        type: "manual",
        message: "Company DB is required",
      });
      hasError = true;
    }

    if (hasError) {
      notify({
        status: "error",
        title: "Missing Fields",
        message:
          "SAP URL, Username,Password and Company DB are required for testing connection.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const data = {
        sapUrl: getValues("sapUrl"),
        userName: getValues("userName"),
        companyDb: getValues("companyDB"),
        password: getValues("password"),
      };
      const response: ApiResponse = await testSAPConnection(data);

      if (response.status) {
        notify({
          status: "success",
          title: "Connection Successful",
          message: "SAP Connection established successfully.",
        });
      } else {
        notify({
          status: "error",
          title: "Connection Failed",
          message:
            "Could not establish SAP connection. Please check credentials.",
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notify({
        status: "error",
        title: "Connection Error",
        message:
          error?.toString() ||
          "An error occurred while testing SAP connection.",
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      data = { ...data, id: company?.id ?? 0 };

      if (data.id === 0) {
        await dispatch(AddNewCompany(data)).unwrap();
        notify({
          status: "success",
          title: "Success!",
          message: "Company Created SuccessFully.",
        });
      } else {
        const a = await dispatch(UpdateCompany(data)).unwrap();

        notify({
          status: "success",
          title: "Success!",
          message: "Company Updated SuccessFully.",
        });
      }
      await dispatch(GetAllCompanies({ pageNumber: 1, pageSize, filters: {} }));
      reset();
      closeModal();
    } catch (error) {
      console.error("Error updating company:", error);
      notify({
        status: "error",
        title: "Error Occured!",
        message: error?.toString() || "Error Updating Company.",
      });
    }
  };

  return (
    <>
      {open && (
        <Popover onClose={closeModal} size={Popover.Size.XLARGE}>
          <Loading isLoading={loading || isLoading}>
            <PopoverHeader onClose={closeModal}>
              {company?.id ? "Update Company" : "Add New Company"}
            </PopoverHeader>
            <PopoverContent>
              <form {...companySchema} onSubmit={handleSubmit(onSubmit)}>
                <Grid>
                  <Grid.Cell>
                    <Controller
                      name="companyId"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          placeholder="Enter Company Id"
                          label="Company Id"
                          hasError={!!errors.companyId}
                          isRequired
                        />
                      )}
                    />
                  </Grid.Cell>

                  <Grid.Cell>
                    <Controller
                      name="partyId"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          placeholder="Enter partyId"
                          label="PartyId"
                          hasError={!!errors.partyId}
                          isRequired
                        />
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Controller
                      name="chamberOfCommerceId"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          placeholder="Enter Chamber Of CommerceId"
                          label="Chamber Of CommerceId"
                          hasError={!!errors.chamberOfCommerceId}
                          isRequired
                        />
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          placeholder="Company Name"
                          label="Company Name"
                          hasError={!!errors.name}
                          isRequired
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
                        />
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Controller
                      name="sapUrl"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          placeholder="Enter SAP Base Url"
                          label="SAP Url"
                          hasError={!!errors.sapUrl}
                          isRequired
                        />
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Controller
                      name="userName"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          placeholder="Enter SAP Username"
                          label="SAP Username"
                          hasError={!!errors.userName}
                          isRequired
                        />
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Controller
                      name="companyDB"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          placeholder="Enter SAP Company DB"
                          label="SAP Company DB"
                          hasError={!!errors.companyDB}
                          isRequired
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
                          className="w-full"
                          placeholder="Enter SAP Password"
                          label="SAP Password"
                          hasError={!!errors.password}
                          isRequired
                        />
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Controller
                      name="b2bRouterBaseUrl"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          placeholder="Enter B2B Base Url"
                          label="B2B Url"
                          hasError={!!errors.b2bRouterBaseUrl}
                          isRequired
                        />
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Controller
                      name="b2bRouterAuthKey"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          placeholder="Enter B2B Auth key"
                          label="B2B Auth Key"
                          hasError={!!errors.b2bRouterAuthKey}
                          isRequired
                        />
                      )}
                    />
                  </Grid.Cell>
                  <Grid.Cell>
                    <Controller
                      name="jobDelay"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          inputType={TextInputControl.Type.NUMBER}
                          value={Number(getValues("jobDelay"))}
                          placeholder="Enter Job Delay"
                          onChange={(value) => {
                            const numericValue = parseFloat(value);
                            field.onChange(
                              !isNaN(numericValue) ? numericValue : ""
                            );
                          }}
                          label="Job Delay"
                          hasError={!!errors.jobDelay}
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

                <PopoverFooter className="justify-between">
                  <div className="flex gap-2">
                    <Button isSubmit variant={ButtonVariant.Primary}>
                      {company?.id ? "Update" : "Create"}
                    </Button>
                    <Button
                      variant={ButtonVariant.Outline}
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                  </div>

                  <Button
                    variant={ButtonVariant.Secondary}
                    onClick={handelTestSAPConnection}
                  >
                    Test Connection
                  </Button>
                </PopoverFooter>
              </form>
            </PopoverContent>
          </Loading>
        </Popover>
      )}
    </>
  );
};
