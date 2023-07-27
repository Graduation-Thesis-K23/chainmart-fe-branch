import React, { FC, useEffect } from "react";
import PageTitle from "~/components/common/PageTitle";
import {
  Dashboard,
  DashboardHeader,
  DashboardControl,
  DashboardBody,
} from "./styled";
import withAuth from "~/hocs/withAuth";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { Select, Space, DatePicker, Button, Tooltip, Spin } from "antd";
import { ASYNC_STATUS, useAppDispatch, useAppSelector } from "~/redux";
import { DashboardPayload, getDataDashboard } from "~/redux/dashboard/slide";
import { DashboardType } from "~/shared";

import dayjs from "dayjs";
import ReloadButton from "~/components/common/ReloadButton";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs().format();

const DashboardSc: FC = () => {
  const [startDate, setStartDate] = React.useState<string>(
    dayjs().subtract(30, "days").toString()
  );
  const [endDate, setEndDate] = React.useState<string>(
    dayjs().subtract(1, "days").toString()
  );

  const [dashboardType, setDashboardType] = React.useState<DashboardType>(
    DashboardType.OrdersDaily
  );

  const [chartType, setChartType] = React.useState<string>("line");

  const { data, status } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  const handleRenderChart = async () => {
    const data: DashboardPayload = {
      startDate,
      endDate,
      dashboardType,
    };

    await dispatch(getDataDashboard(data));
  };

  useEffect(() => {
    dispatch(
      getDataDashboard({
        startDate,
        endDate,
        dashboardType,
      })
    );
  }, []);

  return (
    <Dashboard>
      <DashboardHeader>
        <PageTitle text="Dashboard Management" />
      </DashboardHeader>
      <DashboardControl>
        <Space wrap>
          <Select
            defaultValue={dashboardType}
            style={{ width: 400 }}
            options={[
              { value: DashboardType.OrdersDaily, label: "Orders Per Day" },
              { value: DashboardType.NewUser, label: "New User" },
              { value: DashboardType.RevenueDaily, label: "Revenue Per Day" },
              { value: DashboardType.HotSelling, label: "Hot Selling" },
            ]}
            onChange={(value) => setDashboardType(value)}
          />
          {/* only in the pass and max 60 days */}
          <DatePicker.RangePicker
            disabledDate={(current) => {
              return (
                current &&
                (current < dayjs().subtract(60, "days") ||
                  current > dayjs().subtract(1, "days"))
              );
            }}
            format={"DD/MM/YYYY"}
            onChange={(_, dateStrings) => {
              setStartDate(dateStrings[0]);
              setEndDate(dateStrings[1]);
            }}
            defaultPickerValue={[
              dayjs().subtract(30, "days"),
              dayjs().subtract(1, "days"),
            ]}
            defaultValue={[
              dayjs().subtract(30, "days"),
              dayjs().subtract(1, "days"),
            ]}
          />

          <Select
            defaultValue={chartType}
            style={{ width: 120 }}
            options={[
              {
                value: "line",
                label: "Line",
              },
              {
                value: "bar",
                label: "Bar",
              },
            ]}
            onChange={(value) => setChartType(value)}
          />
          <Button type="primary" onClick={handleRenderChart}>
            Apply
          </Button>
        </Space>
      </DashboardControl>
      {status === ASYNC_STATUS.FAILED && <ReloadButton />}
      {status === ASYNC_STATUS.IDLE ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 1400,
            height: 700,
          }}
        >
          <Spin />
        </div>
      ) : (
        <DashboardBody>
          {chartType === "line" ? (
            <LineChart
              width={1400}
              height={700}
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          ) : (
            <BarChart width={1400} height={700} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          )}
        </DashboardBody>
      )}
    </Dashboard>
  );
};

export default withAuth(DashboardSc);
