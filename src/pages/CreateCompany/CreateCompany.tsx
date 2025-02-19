import { Button, ButtonVariant } from "@/components/ui/Button";
import { Empty } from "@/components/ui/Empty";
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

const companySchema = z.object({
  companyId: z.string().min(2, "Company ID is required"),
  name: z.string().min(1, "Company Name is required"),
  email: z.string().email("Invalid email format"),

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
      name: company?.name || "",
      email: company?.email || "",
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
      } else {
        await dispatch(UpdateCompany(data));
      }
      reset();
      closeModal();
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  return (
    open && (
      <Popover onClose={closeModal} size={Popover.Size.MEDIUM}>
        <Loading isLoading={loading}>
          <PopoverHeader onClose={closeModal}>
            {company?.id ? "Update Record" : "Add New"}
          </PopoverHeader>
          <PopoverContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid>
                <Grid.Cell>
                  <Controller
                    name="companyId"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        className="w-full"
                        placeholder="Enter Prefix"
                        label="Company Id"
                        hasError={!!errors.companyId}
                        isRequired
                        feedback={errors.companyId?.message}
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
                        feedback={errors.name?.message}
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
                  Update
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
