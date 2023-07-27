import React, { useEffect } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Orders, OrdersHeader } from "./styled";
import {
  ASYNC_STATUS,
  OrdersRender,
  fetchOrder,
  useAppDispatch,
  useAppSelector,
} from "~/redux";
import withAuth from "~/hocs/withAuth";
import PageTitle from "~/components/common/PageTitle";
import ReloadButton from "~/components/common/ReloadButton";
import convertPrice from "~/utils/convert-price";

const OrdersManagement = () => {
  const orders = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();

  const columns: ColumnsType<OrdersRender> = [
    {
      title: "No.",
      width: "60px",
      render: (_, __, i) => <span>{i + 1}</span>,
    },
    {
      title: "Order ID",
      dataIndex: "id",
    },
    {
      title: "Create At",
      dataIndex: "created_at",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (total) => <span>{convertPrice(total)}</span>,
      sorter: (a, b) => (a.total > b.total ? 1 : -1),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => (a.status > b.status ? 1 : -1),
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
        size="large"
        rowKey="id"
        loading={!(orders.status == ASYNC_STATUS.SUCCEED)}
        scroll={{
          scrollToFirstRowOnChange: true,
          y: "calc(100vh - 203px)",
        }}
      />
      {orders.status === ASYNC_STATUS.FAILED && <ReloadButton />}
      {/*  {viewOrderDrawer && (
        <ViewOrderDrawer
          order={viewOrder}
          viewOrder={viewOrderDrawer}
          handleViewOrder={setViewOrderDrawer}
        />
      )} */}
    </Orders>
  );
};

export default withAuth(OrdersManagement);
