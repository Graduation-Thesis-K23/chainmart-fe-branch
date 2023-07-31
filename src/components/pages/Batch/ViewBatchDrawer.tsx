import { Col, Drawer, Row } from "antd";
import React, { FC } from "react";
import { Input } from "~/components/common";
import { BatchType } from "~/shared";
import convertPrice from "~/utils/convert-price";
import convertTimestamp from "~/utils/convert-timestamp";
// import convertPrice from "~/utils/convert-price";
// import dictionary from "~/utils/dictionary";
// import getLinkBySlug from "~/utils/get-link-by-slug";

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
      width={1200}
    >
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Input
            label="Batch ID"
            value={batch.id}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={6}>
          <Input
            label="Created At"
            value={convertTimestamp(batch.created_at)}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={6}>
          <Input
            label="Batch Code"
            value={batch.batch_code}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={6}>
          <Input
            label="Expiry Date"
            value={convertTimestamp(batch.expiry_date)}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Input
            label="Import Cost"
            value={convertPrice(batch.import_cost)}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={6}>
          <Input
            label="Import Quantity"
            value={batch.import_quantity}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={6}>
          <Input
            label="Sold"
            value={batch.sold}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={6}>
          <Input
            label="Created By"
            value={batch.employee_create_phone}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Input
            label="Product Name"
            value={batch.product.name}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={6}>
          <Input
            label="Product Code"
            value={batch.product.product_code}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={6}>
          <Input
            label="Product Price"
            value={convertPrice(batch.product.price)}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={6}>
          <Input
            label="Product Sale"
            value={batch.product.sale}
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
