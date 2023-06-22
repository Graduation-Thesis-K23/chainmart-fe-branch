import { Col, Drawer, Row } from "antd";
import React, { FC } from "react";
import { Input } from "~/components/common";
import { BatchType } from "~/shared";

const ViewBatchDrawer: FC<{
  viewBatch: boolean;
  handleViewBatch: (status: boolean) => void;
  batch: BatchType;
}> = ({ viewBatch, handleViewBatch, batch }) => {
  return (
    <Drawer
      title="View Batch"
      placement="right"
      onClose={() => handleViewBatch(false)}
      open={viewBatch}
      width="400px"
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Input
            label="Name"
            value={batch.id}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={24}>
          <Input
            label="Phone"
            value={batch.name}
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

export default ViewBatchDrawer;
