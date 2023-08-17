import { Button, Col, Drawer, Popconfirm, Row } from "antd";
import React, { FC, Fragment, memo, useEffect, useMemo, useState } from "react";
import { OrderDetailsProps } from ".";
import Span from "./Span";
import convertPrice from "~/utils/convert-price";
import { ProductsLabel, ProductsTable, TBody, THead } from "./styled";
import { OrderStatus } from "~/shared";
import {
  approveOrder,
  beginShipOrder,
  rejectOrder,
  useAppDispatch,
} from "~/redux";
import { toast } from "react-toastify";
import convertTimestamp from "~/utils/convert-timestamp";
import instance from "~/services/axios-instance";

interface AvailableProduct {
  product_id: string;
  available: number;
}

const ViewOrder: FC<{
  order: OrderDetailsProps;
  viewOrder: boolean;
  handleViewOrder: (status: boolean) => void;
}> = ({ order, viewOrder, handleViewOrder }) => {
  const dispatch = useAppDispatch();
  const [availableProducts, setAvailableProducts] = useState<
    AvailableProduct[]
  >([]);

  const handleApprove = async (id: string) => {
    const result = await dispatch(approveOrder(id));

    if (approveOrder.fulfilled.match(result)) {
      handleViewOrder(false);
      toast.success("Approve Order Successfully");
    }
  };

  const handleReject = async (id: string) => {
    const result = await dispatch(rejectOrder(id));

    if (rejectOrder.fulfilled.match(result)) {
      handleViewOrder(false);
      toast.success("Reject Order Successfully");
    }
  };

  const handleBeginShipping = async (id: string) => {
    const result = await dispatch(beginShipOrder(id));

    if (beginShipOrder.fulfilled.match(result)) {
      handleViewOrder(false);
      toast.success("Begin Shipping Successfully");
    }
  };

  const total = useMemo(() => {
    return order.order_details?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [order.order_details]);

  const controlRender = (status: string) => {
    switch (status) {
      case OrderStatus.Created:
        return (
          <div
            style={{
              marginTop: 10,
            }}
          >
            <Button
              type="primary"
              style={{
                marginRight: 10,
              }}
              onClick={() => handleApprove(order.id)}
            >
              Approve
            </Button>
            <Popconfirm
              title="You must call the customer to confirm the order is not available. Are you sure?"
              onConfirm={() => handleReject(order.id)}
              okText="Yes"
              cancelText="No"
              placement="bottomRight"
            >
              <Button>Reject</Button>
            </Popconfirm>
          </div>
        );
      case OrderStatus.Approved:
        return (
          <div
            style={{
              marginTop: 10,
            }}
          >
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => handleBeginShipping(order.id)}
              okText="Yes"
              cancelText="No"
              placement="bottomRight"
            >
              <Button
                type="primary"
                style={{
                  marginRight: 10,
                }}
              >
                Packaged Order and Start Shipping
              </Button>
            </Popconfirm>

            <Popconfirm
              title="You must call the customer to confirm the order is not available. Are you sure?"
              onConfirm={() => handleReject(order.id)}
              okText="Yes"
              cancelText="No"
              placement="bottomRight"
            >
              <Button>Product Not Available</Button>
            </Popconfirm>
          </div>
        );
      default:
        return null;
    }
  };

  const orderDetails = useMemo(() => {
    return order.order_details?.map((item) => {
      const availableProduct = availableProducts.find(
        (product) => product.product_id === item.product.id
      );

      return {
        ...item,
        available: availableProduct?.available || 0,
      };
    });
  }, [availableProducts]);

  useEffect(() => {
    const ids = order.order_details?.map((item) => item.product.id);

    const params = new URLSearchParams({
      ids: ids?.join(",") || "",
    });

    const fetchAvailableProducts = async () => {
      const result: AvailableProduct[] = await instance.get(
        "/api/batches/available?" + params.toString()
      );

      setAvailableProducts(result);
    };

    fetchAvailableProducts();
  }, []);

  return (
    <Drawer
      title="View Order Details"
      placement="right"
      open={viewOrder}
      onClose={() => handleViewOrder(false)}
      width={1400}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Span label="Order ID" value={order.id} />
        </Col>
        <Col span={4}>
          <Span label="Created At" value={convertTimestamp(order.created_at)} />
        </Col>
        <Col span={4}>
          <Span label="Status" value={order.status} />
        </Col>
        <Col span={4}>
          <Span label="Total" value={convertPrice(total)} />
        </Col>
        <Col span={4}>
          <Span label="Payment" value={order.payment} />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={4}>
          <Span
            label="Approved Date"
            value={
              order.approved_date
                ? convertTimestamp(order.approved_date)
                : "N/A"
            }
          />
        </Col>
        <Col span={4}>
          <Span
            label="Packaged Date"
            value={
              order.packaged_date
                ? convertTimestamp(order.packaged_date)
                : "N/A"
            }
          />
        </Col>
        <Col span={4}>
          <Span
            label="Started Shipment Date"
            value={
              order.started_date ? convertTimestamp(order.started_date) : "N/A"
            }
          />
        </Col>
        <Col span={4}>
          <Span
            label="Completed Shipment Date"
            value={
              order.completed_date
                ? convertTimestamp(order.completed_date)
                : "N/A"
            }
          />
        </Col>
        <Col span={4}>
          <Span
            label="Cancelled Date"
            value={
              order.cancelled_date
                ? convertTimestamp(order.cancelled_date)
                : "N/A"
            }
          />
        </Col>
        <Col span={4}>
          <Span
            label="Returned Date"
            value={
              order.returned_date
                ? convertTimestamp(order.returned_date)
                : "N/A"
            }
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={4}>
          <Span
            label="Approved By"
            value={order.approved_by ? order.approved_by : "N/A"}
          />
        </Col>
        <Col span={4}>
          <Span
            label="Packaged By"
            value={order.packaged_by ? order.packaged_by : "N/A"}
          />
        </Col>
        <Col span={4}>
          <Span
            label="Started Shipment By"
            value={order.started_by ? order.started_by : "N/A"}
          />
        </Col>
        <Col span={4}>
          <Span
            label="Completed Shipment By"
            value={order.completed_by ? order.completed_by : "N/A"}
          />
        </Col>
        <Col span={4}>
          <Span
            label="Cancelled By"
            value={order.cancelled_by ? order.cancelled_by : "N/A"}
          />
        </Col>
        <Col span={4}>
          <Span
            label="Returned By"
            value={order.returned_by ? order.returned_by : "N/A"}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={6}>
          <Span label="Receiver Name" value={order.address.name} />
        </Col>
        <Col span={6}>
          <Span label="Receiver Phone" value={order.address.phone} />
        </Col>
        <Col span={12}>
          <Span
            label="Delivery address"
            value={`${order.address.street}, ${order.address.ward}, ${order.address.city}, ${order.address.district}`}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <ProductsLabel>Product List</ProductsLabel>
          <ProductsTable>
            <THead>
              <tr>
                <th>No.</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Available</th>
              </tr>
            </THead>
            <TBody>
              {orderDetails.map((orderDetail, index) => (
                <Fragment key={index}>
                  <tr
                    style={{
                      backgroundColor:
                        orderDetail.available < orderDetail.quantity
                          ? "#f05e61"
                          : "",
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{orderDetail.product.name}</td>
                    <td>{convertPrice(orderDetail.product.price)}</td>
                    <td>{orderDetail.quantity}</td>
                    <td>{orderDetail.available}</td>
                  </tr>
                </Fragment>
              ))}
            </TBody>
          </ProductsTable>
        </Col>
      </Row>
      {controlRender(order.status)}
    </Drawer>
  );
};

export default memo(ViewOrder);
