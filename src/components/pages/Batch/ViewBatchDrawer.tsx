import { Col, Drawer, Row } from "antd";
import React, { FC } from "react";
import { Input } from "~/components/common";
import { BatchType } from "~/shared";
import convertPrice from "~/utils/convert-price";
import dictionary from "~/utils/dictionary";
import getLinkBySlug from "~/utils/get-link-by-slug";

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
        <Col span={8}>
          <Input
            label="Batch ID"
            value={batch.id}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            label="Created At"
            value={batch.created_at}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            label="Import Quantity"
            value={batch.batch_code}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Input
            label="Import Cost"
            value={batch.id}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            label="Expiry Date"
            value={batch.created_at}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            label="Sold"
            value={batch.batch_code}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Input
            label="Product ID"
            value={batch.product.id}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            label="Product Name"
            value={batch.product.name}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            label="Product Price"
            value={convertPrice(batch.product.price)}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Input
            label="Product Category"
            value={dictionary(batch.product.category)}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            label="Product Code"
            value={batch.product.product_code}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            label="Product Link"
            value={getLinkBySlug(batch.product.slug)}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Input
            label="Employee Created ID"
            value={batch.employee_create.id}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            label="Employee Created Name"
            value={batch.employee_create.name}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={8}>
          <Input
            label="Employee Created Phone"
            value={batch.employee_create.phone}
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
