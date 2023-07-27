import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, InputRef, Space, Table } from "antd";
import { AppstoreAddOutlined, SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import Highlighter from "react-highlight-words";

import {
  Employees,
  EmployeesHeader,
  MoreButton,
  MoreButtonGroup,
} from "./styled";
import {
  ASYNC_STATUS,
  useAppDispatch,
  useAppSelector,
  fetchEmployees,
} from "~/redux";
import withAuth from "~/hocs/withAuth";
import PageTitle from "~/components/common/PageTitle";
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import MoreEmployeeDrawer from "./MoreEmployeesDrawer";
import ViewEmployeeDrawer from "./ViewEmployeeDrawer";
import { EmployeeType } from "~/shared";
import ReloadButton from "~/components/common/ReloadButton";

const EmployeesManagement = () => {
  const [moreEmployee, setMoreEmployee] = useState(false);
  const [employee, setEmployee] = useState<EmployeeType>({} as EmployeeType);
  const [viewEmployee, setViewEmployee] = useState(false);

  const employees = useAppSelector((state) => state.employees);
  const dispatch = useAppDispatch();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleMoreEmployee = useCallback((status: boolean) => {
    setMoreEmployee(status);
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof EmployeeType
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: keyof EmployeeType
  ): ColumnType<EmployeeType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<EmployeeType> = [
    {
      title: "No.",
      dataIndex: "name",
      width: "4%",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Role",
      dataIndex: "role",
      ...getColumnSearchProps("role"),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (isActive) => (isActive ? "Active" : "Inactive"),
    },
  ];

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);

  return (
    <Employees>
      <EmployeesHeader>
        <PageTitle text="Employees Management" />
        <div>
          <MoreButtonGroup onClick={() => handleMoreEmployee(true)}>
            <AppstoreAddOutlined />
            <MoreButton>More</MoreButton>
          </MoreButtonGroup>
        </div>
      </EmployeesHeader>
      <Table
        columns={columns}
        dataSource={employees.data}
        pagination={false}
        size="large"
        rowKey="id"
        loading={!(employees.status == ASYNC_STATUS.SUCCEED)}
        scroll={{
          scrollToFirstRowOnChange: true,
          y: "calc(100vh - 203px)",
        }}
        onRow={(record) => ({
          onClick: () => {
            setEmployee(record);
            setViewEmployee(true);
          },
        })}
      />
      {employees.status === ASYNC_STATUS.FAILED && <ReloadButton />}

      {moreEmployee && (
        <MoreEmployeeDrawer
          moreEmployee={moreEmployee}
          handleMoreEmployee={handleMoreEmployee}
        />
      )}
      {viewEmployee && (
        <ViewEmployeeDrawer
          viewEmployee={viewEmployee}
          handleViewEmployee={setViewEmployee}
          employee={employee}
        />
      )}
    </Employees>
  );
};

export default withAuth(EmployeesManagement);
