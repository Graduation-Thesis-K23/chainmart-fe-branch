import { Col, Drawer, Row } from "antd";
import React, { FC } from "react";
import { Input } from "~/components/common";
import { OrderType } from "~/shared";

const ViewOrdersDrawer: FC<{
  viewOrder: boolean;
  handleViewOrders: (status: boolean) => void;
  order: OrderType;
}> = ({ viewOrder, handleViewOrders, order }) => {
  return (
    <Drawer
      title="View Orders"
      placement="right"
      onClose={() => handleViewOrders(false)}
      open={viewOrder}
      width="400px"
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Input
            label="Name"
            value={order.id}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={24}>
          <Input
            label="Phone"
            value={order.status}
            type="tel"
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default ViewOrdersDrawer;
