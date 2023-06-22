import React, { useEffect, useRef, useState } from "react";
import { Button, Input, InputRef, Space, Table } from "antd";
import { AppstoreAddOutlined, SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

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

const BatchManagement = () => {
  const [batch, setBatch] = useState<BatchType>({} as BatchType);
  const [viewBatch, setViewBatch] = useState(false);
  const [moreBatch, setMoreBatch] = useState(false);

  const batchList = useAppSelector((state) => state.batch);
  const dispatch = useAppDispatch();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof BatchType
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: keyof BatchType
  ): ColumnType<BatchType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<BatchType> = [
    {
      title: "No.",
      dataIndex: "name",
      width: "4%",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Id",
      dataIndex: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Name",
      dataIndex: "name",
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
        size="small"
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
