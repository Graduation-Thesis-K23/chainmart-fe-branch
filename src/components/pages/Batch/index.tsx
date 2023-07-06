import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

import { Batch, BatchHeader, MoreButton, MoreButtonGroup } from "./styled";
import {
  ASYNC_STATUS,
  fetchBatch,
  useAppDispatch,
  useAppSelector,
} from "~/redux";
import withAuth from "~/hocs/withAuth";
import PageTitle from "~/components/common/PageTitle";
import { BatchType } from "~/shared";
import ViewBatchDrawer from "./ViewBatchDrawer";
import MoreBatchDrawer from "./MoreBatchDrawer";
import ReloadButton from "~/components/common/ReloadButton";
import convertPrice from "~/utils/convert-price";

const BatchManagement = () => {
  const [batch, setBatch] = useState<BatchType>({} as BatchType);
  const [viewBatch, setViewBatch] = useState(false);
  const [moreBatch, setMoreBatch] = useState(false);

  const batchList = useAppSelector((state) => state.batch);
  const dispatch = useAppDispatch();

  const columns: ColumnsType<BatchType> = [
    {
      title: "No.",
      dataIndex: "name",
      width: "4%",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
    },
    {
      title: "Import Quantity",
      dataIndex: "import_quantity",
    },
    {
      title: "Import Cost",
      dataIndex: "import_cost",
      render: (value) => <span>{convertPrice(value)}</span>,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
    },
    {
      title: "Sold",
      dataIndex: "sold",
      sorter: (a, b) => a.sold - b.sold,
    },
  ];

  useEffect(() => {
    dispatch(fetchBatch());
  }, []);

  return (
    <Batch>
      <BatchHeader>
        <PageTitle text="Batch Management" />
        <div>
          <MoreButtonGroup onClick={() => setMoreBatch(true)}>
            <AppstoreAddOutlined />
            <MoreButton>More</MoreButton>
          </MoreButtonGroup>
        </div>
      </BatchHeader>
      <Table
        columns={columns}
        dataSource={batchList.data}
        pagination={false}
        size="large"
        rowKey="id"
        loading={!(batchList.status == ASYNC_STATUS.SUCCEED)}
        scroll={{
          scrollToFirstRowOnChange: true,
          y: "calc(100vh - 203px)",
        }}
        onRow={(record) => ({
          onClick: () => {
            setBatch(record);
            setViewBatch(true);
          },
        })}
      />
      {batchList.status === ASYNC_STATUS.FAILED && <ReloadButton />}

      {viewBatch && (
        <ViewBatchDrawer
          viewBatch={viewBatch}
          handleViewBatch={setViewBatch}
          batch={batch}
        />
      )}

      {moreBatch && (
        <MoreBatchDrawer moreBatch={moreBatch} handleMoreBatch={setMoreBatch} />
      )}
    </Batch>
  );
};

export default withAuth(BatchManagement);
