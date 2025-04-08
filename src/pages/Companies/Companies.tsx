import { ActionBar } from "@/components/ui/ActionBar";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { Pagination } from "@/components/pagination";
import { useEffect, useState } from "react";
import { useTDispatch } from "@/hooks/use-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setPageNumber } from "@/redux/reducers/transactionSlice";
import { DeleteCompany, GetAllCompanies } from "@/services/companiesService";
import { CreateCompany } from "../CreateCompany";
import { Company } from "@/types/companies";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/use-auth";
import {
  RefreshButton,
  AddNewButton,
  DeleteButton,
  ViewButton,
  FilterButton,
} from "@/components/ui/Buttons";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { CopyIcon } from "@/components/icons";
import { useNotify } from "@/components/ui/Notify";
import { apiUrl } from "@/config";
import { useModal } from "@/hooks/use-modal";
import {
  CompanyFilter,
  CompanyFilterState,
  defaultCompanyFilterState,
} from "@/components/parts/company-filters";
import { FadeInUp } from "@/components/animations";
import { NoDataBoundary } from "@/components/ui/no-data-boundary";

export const Companies = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeFilters, setActiveFilters] = useState<CompanyFilterState>({
    ...defaultCompanyFilterState,
  });

  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isFilterModalOpen,
    openModal: openFilters,
    closeModal: closeFilterModal,
  } = useModal();

  const dispatch = useTDispatch();
  const { isSuperUser } = useAuth();
  const { notify } = useNotify();

  const { companies, loading, error, pageNumber, pageSize, totalCount } =
    useSelector((state: RootState) => state.company);

  useEffect(() => {
    dispatch(GetAllCompanies({ pageNumber, pageSize, filters: activeFilters }));
  }, [dispatch, pageNumber, pageSize, activeFilters]);

  const handleRefresh = () => {
    dispatch(GetAllCompanies({ pageNumber, pageSize, filters: activeFilters }));
  };

  const handelDeleteCompany = (id: Company["id"], isDelete: boolean) => {
    dispatch(DeleteCompany({ id, isDelete }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notify({ title: "Url Copied", status: "success" });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleFilterSubmit = (filters: CompanyFilterState) => {
    setActiveFilters(filters);
    dispatch(setPageNumber(1));
  };

  const isFilterApplied =
    activeFilters &&
    Object.entries(activeFilters).some(([_, value]) => Boolean(value));

  return (
    <>
      <FadeInUp>
        <Loading isLoading={loading}>
          <ActionBar backBtn title="Companies" totalCount={totalCount}>
            <FilterButton
              onClick={() => openFilters()}
              isFiltered={isFilterApplied ?? false}
            />
            <RefreshButton handleRefresh={handleRefresh} />
            {isSuperUser && <AddNewButton onClick={openModal} />}
          </ActionBar>

          <div className="mt-7">
            <Table
              bordered
              head={
                <Table.Row>
                  <Table.Header value="#" />
                  <Table.Header value="Name" />
                  <Table.Header value="Email" />
                  <Table.Header value="WebHook Url" />
                  <Table.Header value="Company ID" />
                  <Table.Header value="Active" />
                  {isSuperUser && <Table.Header value="Actions" />}
                </Table.Row>
              }
              body={
                <NoDataBoundary
                  condition={companies && companies.length > 0}
                  fallback={<Table.Empty />}
                >
                  {companies.map((item: Company, index) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell className="underline decoration-dashed cursor-default">
                        {item.email}
                      </Table.Cell>
                      <Table.Cell>
                        <Tooltip
                          position={Tooltip.Position.Top}
                          content={`https://localhost:7190/Api/invoiceStateChange/${item.companyId}`}
                        >
                          <div className="flex items-center gap-4 cursor-pointer">
                            <p className=" bg-gray-100 py-2 px-5 rounded-sm">
                              {`https://localhost:7190/Api/invoiceStateChange/${item.companyId}`}
                            </p>
                            <div
                              onClick={() =>
                                handleCopy(
                                  `${apiUrl}/Api/invoiceStateChange/${item.companyId}`
                                )
                              }
                              className="cursor-pointer"
                            >
                              <CopyIcon />
                            </div>
                          </div>
                        </Tooltip>
                      </Table.Cell>
                      <Table.Cell>{item.companyId}</Table.Cell>
                      <Table.Cell>
                        <Tag
                          type={
                            item.isActive
                              ? Tag.type.ON_TRACK
                              : Tag.type.INACTIVE
                          }
                          label={item.isActive ? "Active" : "InActive"}
                        />
                      </Table.Cell>

                      {isSuperUser && (
                        <Table.Cell>
                          <div className="flex items-center justify-center">
                            <ViewButton
                              onClick={() => {
                                setSelectedCompany(item);
                                openModal();
                              }}
                              isDisabled={item.isArchived}
                            />

                            <DeleteButton
                              isDeleted={item.isArchived}
                              onClick={() =>
                                handelDeleteCompany(item.id, item.isArchived)
                              }
                            />
                          </div>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </NoDataBoundary>
              }
              isLoading={loading}
              footer={
                <Pagination
                  totalPages={Math.ceil(totalCount / pageSize)}
                  onPage={(page) => dispatch(setPageNumber(page))}
                  page={pageNumber}
                />
              }
            />
          </div>
          {isOpen && (
            <CreateCompany
              closeModal={() => {
                setSelectedCompany(null);
                closeModal();
              }}
              company={selectedCompany}
              open={isOpen}
            />
          )}
          {isFilterModalOpen && (
            <CompanyFilter
              initialFilters={activeFilters}
              onSubmit={handleFilterSubmit}
              onClose={closeFilterModal}
            />
          )}
        </Loading>
      </FadeInUp>
    </>
  );
};
