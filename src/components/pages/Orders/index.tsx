import React, { useEffect, useRef, useState } from "react";
import { Button, Input, InputRef, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

import { Orders, OrdersHeader } from "./styled";
import {
  ASYNC_STATUS,
  fetchOrder,
  useAppDispatch,
  useAppSelector,
} from "~/redux";
import withAuth from "~/hocs/withAuth";
import PageTitle from "~/components/common/PageTitle";
import { OrderType } from "~/shared";
import ViewOrdersDrawer from "./ViewOrdersDrawer";

const OrdersManagement = () => {
  const [order, setOrder] = useState<OrderType>({} as OrderType);
  const [viewOrder, setViewOrder] = useState(false);

  const orders = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof OrderType
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: keyof OrderType
  ): ColumnType<OrderType> => ({
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

  const columns: ColumnsType<OrderType> = [
    {
      title: "No.",
      dataIndex: "name",
      width: "4%",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Id",
      dataIndex: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  useEffect(() => {
    dispatch(fetchOrder());
  }, []);

  return (
    <Orders>
      <OrdersHeader>
        <PageTitle text="Orders Management" />
      </OrdersHeader>
      <Table
        columns={columns}
        dataSource={orders.data}
        pagination={false}
        size="small"
        rowKey="id"
        loading={!(orders.status == ASYNC_STATUS.SUCCEED)}
        scroll={{
          scrollToFirstRowOnChange: true,
          y: "calc(100vh - 203px)",
        }}
        onRow={(record) => ({
          onClick: () => {
            setOrder(record);
            setViewOrder(true);
          },
        })}
      />

      {viewOrder && (
        <ViewOrdersDrawer
          viewOrder={viewOrder}
          handleViewOrders={setViewOrder}
          order={order}
        />
      )}
    </Orders>
  );
};

export default withAuth(OrdersManagement);
