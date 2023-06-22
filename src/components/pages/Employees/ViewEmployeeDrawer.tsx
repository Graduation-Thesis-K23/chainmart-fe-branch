import { Button, Col, Drawer, Row } from "antd";
import React, { FC } from "react";
import { toast } from "react-toastify";
import { Input } from "~/components/common";
import { activeEmployee, resetPassword, useAppDispatch } from "~/redux";
import { EmployeeType } from "~/shared";

const ViewEmployeeDrawer: FC<{
  viewEmployee: boolean;
  handleViewEmployee: (status: boolean) => void;
  employee: EmployeeType;
}> = ({ viewEmployee, handleViewEmployee, employee }) => {
  const dispatch = useAppDispatch();

  const handleActiveEmployee = async (data: {
    phone: string;
    active: boolean;
  }) => {
    const result = await dispatch(activeEmployee(data));

    if (activeEmployee.fulfilled.match(result)) {
      handleViewEmployee(false);
      toast("Employee update successfully", {
        type: "success",
        position: "bottom-right",
      });
    } else {
      toast("Something was wrong", {
        type: "error",
        position: "bottom-right",
      });
    }
  };

  const handleResetPassword = async (id: string) => {
    const result = await dispatch(resetPassword(id));

    if (resetPassword.fulfilled.match(result)) {
      toast("Password reset successfully", {
        type: "success",
        position: "bottom-right",
      });
    } else {
      toast("Something was wrong", {
        type: "error",
        position: "bottom-right",
      });
    }
  };

  return (
    <Drawer
      title="View Employee"
      placement="right"
      onClose={() => handleViewEmployee(false)}
      open={viewEmployee}
      width="400px"
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Input
            label="Name"
            value={employee.name}
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        <Col span={24}>
          <Input
            label="Phone"
            value={employee.phone}
            type="tel"
            disabled
            onChange={() => {
              return;
            }}
          />
        </Col>
        {employee.isActive ? (
          <Col span={24}>
            <Button
              type="primary"
              onClick={() =>
                handleActiveEmployee({ phone: employee.phone, active: false })
              }
            >
              Deactivate
            </Button>
          </Col>
        ) : (
          <Col span={24}>
            <Button
              type="primary"
              onClick={() =>
                handleActiveEmployee({ phone: employee.phone, active: true })
              }
            >
              Activate
            </Button>
          </Col>
        )}

        {
          <Col span={24}>
            <Button
              type="primary"
              onClick={() => handleResetPassword(employee.id)}
            >
              Reset Password
            </Button>
          </Col>
        }
      </Row>
    </Drawer>
  );
};

export default ViewEmployeeDrawer;
