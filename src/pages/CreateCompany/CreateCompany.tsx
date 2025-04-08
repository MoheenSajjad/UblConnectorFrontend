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
} from "@/services/companiesService";
import { Loading } from "@/components/ui/Loading";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTDispatch } from "@/hooks/use-redux";
import { Alert } from "@/components/ui/Alert";
import { PasswordInput } from "@/components/ui/password-input";

const companySchema = z.object({
  companyId: z.string().min(2, "Company ID is required"),
  iban: z.string().min(2, "Iban is required"),
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
  const { notify } = useNotify();

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyId: company?.companyId || "",
      iban: company?.iban || "",
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
  const { loading, error } = useSelector((state: RootState) => state.company);
  console.log(errors, error);

  const onSubmit = async (data: any) => {
    try {
      data = { ...data, id: company?.id ?? 0 };
      console.log("Form Submitted:", data);
      if (data.id === 0) {
        await dispatch(AddNewCompany(data));
        notify({
          status: "success",
          title: "Success!",
          message: "Company Created SuccessFully.",
        });
      } else {
        await dispatch(UpdateCompany(data));
        notify({
          status: "success",
          title: "Success!",
          message: "Company Updated SuccessFully.",
        });
      }
      reset();
      closeModal();
    } catch (error) {
      console.error("Error updating company:", error);
      notify({
        status: "error",
        title: "Error Occured!",
        message: "Error Updating Company.",
      });
    }
  };

  return (
    <>
      {open && (
        <Popover onClose={closeModal} size={Popover.Size.XLARGE}>
          <Loading isLoading={loading}>
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
                      name="iban"
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          className="w-full"
                          placeholder="Enter Iban"
                          label="Iban"
                          hasError={!!errors.iban}
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
                          isRequired
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
                    {company?.id ? "Update" : "Create"}
                  </Button>
                  <Button variant={ButtonVariant.Outline} onClick={closeModal}>
                    Cancel
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
