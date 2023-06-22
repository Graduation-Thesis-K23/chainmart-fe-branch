import { Button, Col, Drawer, Row } from "antd";
import React, { FC } from "react";
import { Input } from "~/components/common";
import { ASYNC_STATUS, useAppSelector } from "~/redux";

const MoreBatchDrawer: FC<{
  moreBatch: boolean;
  handleMoreBatch: (status: boolean) => void;
}> = ({ moreBatch, handleMoreBatch }) => {
  const batch = useAppSelector((state) => state.batch);

  return (
    <Drawer
      title="More Batch"
      placement="right"
      onClose={() => handleMoreBatch(false)}
      open={moreBatch}
      width="400px"
    >
      <form>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Input
              label="Name"
              onChange={() => {
                return;
              }}
            />
          </Col>
          <Col span={24}>
            <Input
              label="Phone"
              onChange={() => {
                return;
              }}
            />
          </Col>
        </Row>
        <Button
          loading={!(batch.status === ASYNC_STATUS.SUCCEED)}
          type="primary"
        >
          Save
        </Button>
      </form>
    </Drawer>
  );
};

export default MoreBatchDrawer;
