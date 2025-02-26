import { ActionBar } from "@/components/ui/ActionBar";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { Empty } from "@/components/ui/Empty";
import { Pagination } from "@/components/pagination";
import { useEffect, useState } from "react";
import { useTDispatch } from "@/hooks/use-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetAllUsers } from "@/services/userService";
import { setPageNumber } from "@/redux/reducers/userSlice";
import {
  AddNewButton,
  FilterButton,
  RefreshButton,
  ViewButton,
} from "@/components/ui/Buttons";
import { User } from "@/types/user";
import { useAuth } from "@/hooks/use-auth";
import { CreateUser } from "../Create User";
import { Loading } from "@/components/ui/Loading";

export const Users = () => {
  const dispatch = useTDispatch();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { isSuperUser } = useAuth();

  const { users, loading, error, pageNumber, pageSize, totalCount } =
    useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(GetAllUsers({ pageNumber, pageSize }));
  }, [dispatch, pageNumber, pageSize]);

  const handleRefresh = () => {
    dispatch(GetAllUsers({ pageNumber, pageSize }));
  };

  return (
    <Loading isLoading={loading}>
      <ActionBar backBtn title="Users" totalCount={totalCount}>
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
              <Table.Header value="First Name" />
              <Table.Header value="Last Name" />
              <Table.Header value="Email" />
              <Table.Header value="Status" />
              <Table.Header value="Created At" />
              <Table.Header value="Actions" />
            </Table.Row>
          }
          body={
            users.length > 0
              ? users.map((user: User, index) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{user.firstName}</Table.Cell>
                    <Table.Cell>{user.lastName}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <Tag
                        type={
                          user.isActive ? Tag.type.ACTIVE : Tag.type.INACTIVE
                        }
                        label={user.isActive ? "Active" : "Inactive"}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-center">
                        <ViewButton
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenModal(true);
                          }}
                        />
                      </div>
                    </Table.Cell>
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
        <CreateUser
          closeModal={() => {
            setSelectedUser(null);
            setOpenModal(false);
          }}
          user={selectedUser}
          open={openModal}
        />
      )}
    </Loading>
  );
};
