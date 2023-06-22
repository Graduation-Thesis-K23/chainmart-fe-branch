import { Button, Col, Drawer, Row } from "antd";
import React, { FC, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "~/components/common";
import {
  ASYNC_STATUS,
  MoreEmployeeType,
  createEmployee,
  fetchEmployees,
  useAppDispatch,
  useAppSelector,
} from "~/redux";

const MoreEmployeeDrawer: FC<{
  moreEmployee: boolean;
  handleMoreEmployee: (status: boolean) => void;
}> = ({ moreEmployee, handleMoreEmployee }) => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<MoreEmployeeType> = async (data) => {
    const result = await dispatch(createEmployee(data));

    if (createEmployee.fulfilled.match(result)) {
      toast("Employee created successfully", {
        type: "success",
        position: "bottom-right",
      });
      handleMoreEmployee(false);
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
    dispatch(fetchEmployees());
  }, []);

  return (
    <Drawer
      title="More Employee"
      placement="right"
      onClose={() => handleMoreEmployee(false)}
      open={moreEmployee}
      width="400px"
    >
      <form>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Controller
              name="name"
              control={control}
              render={({ field: { ref, onChange, value, name } }) => (
                <Input
                  label="Name"
                  inputRef={ref}
                  onChange={onChange}
                  value={value}
                  name={name}
                />
              )}
              rules={{ required: true }}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="phone"
              control={control}
              render={({ field: { ref, onChange, value, name } }) => (
                <Input
                  label="Phone"
                  inputRef={ref}
                  onChange={onChange}
                  value={value}
                  name={name}
                  type="tel"
                />
              )}
              rules={{ required: true }}
            />
          </Col>
        </Row>
        <Button
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          loading={!(employees.status === ASYNC_STATUS.SUCCEED)}
          type="primary"
        >
          Save
        </Button>
      </form>
    </Drawer>
  );
};

export default MoreEmployeeDrawer;
