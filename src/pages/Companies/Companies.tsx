import { ActionBar } from "@/components/ui/ActionBar";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { Empty } from "@/components/ui/Empty";
import { Pagination } from "@/components/pagination";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FilterButton,
  AddNewButton,
  DeleteButton,
  ViewButton,
} from "@/components/ui/Buttons";

export const Companies = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const dispatch = useTDispatch();
  const { isSuperUser } = useAuth();

  const { companies, loading, error, pageNumber, pageSize, totalCount } =
    useSelector((state: RootState) => state.company);

  useEffect(() => {
    dispatch(GetAllCompanies({ pageNumber, pageSize }));
  }, [dispatch, pageNumber, pageSize]);

  const handleRefresh = () => {
    dispatch(GetAllCompanies({ pageNumber, pageSize }));
  };

  const handelDeleteCompany = (id: Company["id"], isDelete: boolean) => {
    dispatch(DeleteCompany({ id, isDelete }));
  };

  return (
    <>
      <Loading isLoading={loading}>
        <ActionBar backBtn title="Companies" totalCount={totalCount}>
          {/* <FilterButton /> */}
          <RefreshButton handleRefresh={handleRefresh} />
          {isSuperUser && <AddNewButton onClick={() => setOpenModal(true)} />}
        </ActionBar>

        <div className="mt-7">
          <Table
            bordered
            head={
              <Table.Row>
                <Table.Header value="#" />
                <Table.Header value="Name" />
                <Table.Header value="Email" />
                <Table.Header value="Company ID" />
                <Table.Header value="Active" />
                {isSuperUser && <Table.Header value="Actions" />}
              </Table.Row>
            }
            body={
              companies.length > 0
                ? companies.map((item: Company, index) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell className="underline decoration-dashed cursor-default">
                        {item.email}
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
                                setOpenModal(true);
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
                  ))
                : null
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
        {openModal && (
          <CreateCompany
            closeModal={() => {
              setSelectedCompany(null);
              setOpenModal(false);
            }}
            company={selectedCompany}
            open={openModal}
          />
        )}
      </Loading>
    </>
  );
};
