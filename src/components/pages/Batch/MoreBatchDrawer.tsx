import { Button, Col, Drawer, Row } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { FC, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { DatePicker, Input, Select } from "~/components/common";
import {
  ASYNC_STATUS,
  BatchPayload,
  createBatch,
  fetchProducts,
  useAppDispatch,
  useAppSelector,
} from "~/redux";

interface BatchPayloadRaw extends Omit<BatchPayload, "expiry_date"> {
  expiry_date: Dayjs;
}

const MoreBatchDrawer: FC<{
  moreBatch: boolean;
  handleMoreBatch: (status: boolean) => void;
}> = ({ moreBatch, handleMoreBatch }) => {
  const dispatch = useAppDispatch();
  const batch = useAppSelector((state) => state.batch);
  const products = useAppSelector((state) => state.products.data);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      product_id: "",
      import_quantity: 0,
      import_cost: 0,
      acceptable_expiry_threshold: 0,
      expiry_date: dayjs().add(1, "month"),
    },
  });

  const onSubmit: SubmitHandler<BatchPayloadRaw> = async (dataRaw) => {
    const data = {
      ...dataRaw,
      expiry_date: dataRaw.expiry_date.format("YYYY-MM-DD"),
    };

    const result = await dispatch(createBatch(data));

    if (createBatch.fulfilled.match(result)) {
      toast("Batch created successfully", {
        type: "success",
        position: "bottom-right",
      });
      handleMoreBatch(false);
    } else {
      toast(result.payload as string, {
        type: "error",
        position: "bottom-right",
        hideProgressBar: true,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <Drawer
      title="More Batch"
      placement="right"
      onClose={() => handleMoreBatch(false)}
      open={moreBatch}
      width={1200}
    >
      <form>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Controller
              name="product_id"
              control={control}
              render={({ field: { onChange } }) => (
                <Select
                  label="Product Id"
                  options={products.map((p) => {
                    return { label: p.name, value: p.id };
                  })}
                  onChange={onChange}
                />
              )}
              rules={{ required: true }}
            />
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={6}>
            <Controller
              name="import_quantity"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Import Quantity"
                  onChange={onChange}
                  value={value}
                  name={name}
                  type="number"
                />
              )}
              rules={{ required: true }}
            />
          </Col>
          <Col span={6}>
            <Controller
              name="import_cost"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Import Cost"
                  onChange={onChange}
                  value={value}
                  type="number"
                  name={name}
                />
              )}
              rules={{ required: true }}
            />
          </Col>
          <Col span={6}>
            <Controller
              name="acceptable_expiry_threshold"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Acceptable Expiry Threshold"
                  onChange={onChange}
                  value={value}
                  type="number"
                  name={name}
                />
              )}
              rules={{ required: true }}
            />
          </Col>
          <Col span={6}>
            <Controller
              name="expiry_date"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <DatePicker
                  onChange={onChange}
                  defaultValue={value}
                  name={name}
                  label="Expiry Date"
                />
              )}
              rules={{ required: true }}
            />
          </Col>
        </Row>
        <Button
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
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
