import React, { useEffect, useState } from "react";
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
import { OrderStatus, Payment } from "~/shared";
import ReloadButton from "~/components/common/ReloadButton";
import ViewOrderDrawer from "./ViewOrderDrawer";
import convertPrice from "~/utils/convert-price";

export interface ProductProps {
  name: string;
  price: number;
  sale: number;
  slug: string;
}

interface OrderDetailProps {
  quantity: number;
  product: ProductProps;
}

interface AddressProps {
  name: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  street: string;
}

export interface OrderDetailsProps {
  id: string;
  created_at: Date;
  user: {
    name: string;
    phone: string;
    username: string;
    email: string;
  };
  order_details: OrderDetailProps[];
  address: AddressProps;
  total: number;
  status: OrderStatus;
  payment: Payment;
  return_date: Date;
  approved_date: Date;
  shipped_date: Date;
  estimated_shipped_date: Date;
  canceled_date: Date;
}

const OrdersManagement = () => {
  const [viewOrderDrawer, setViewOrderDrawer] = useState(false);
  const [viewOrder, setViewOrder] = useState<OrderDetailsProps>(
    {} as OrderDetailsProps
  );

  const orders = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();

  const columns: ColumnsType<OrdersRender> = [
    {
      title: "No.",
      width: "60px",
      render: (_, __, i) => <span>{i + 1}</span>,
    },
    {
      title: "Create At",
      dataIndex: "created_at",
    },
    {
      title: "Name",
      dataIndex: "user",
      render: (user) => <span>{user.name}</span>,
    },
    {
      title: "Phone",
      dataIndex: "user",
      render: (user) => <span>{user.phone}</span>,
    },
    {
      title: "Total",
      render: (user) => <span>{convertPrice(user.total)}</span>,
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
        onRow={(record) => ({
          onClick: () => {
            setViewOrder(record as unknown as OrderDetailsProps);
            setViewOrderDrawer(true);
          },
        })}
      />

      {orders.status === ASYNC_STATUS.FAILED && <ReloadButton />}
      {viewOrderDrawer && (
        <ViewOrderDrawer
          order={viewOrder}
          viewOrder={viewOrderDrawer}
          handleViewOrder={setViewOrderDrawer}
        />
      )}
    </Orders>
  );
};

export default withAuth(OrdersManagement);
