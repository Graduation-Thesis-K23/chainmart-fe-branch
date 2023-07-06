import styled from "styled-components";

export const Orders = styled.section`
  padding: 24px;
  height: 100%;
`;

export const OrdersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InputGroup = styled.div`
  margin-bottom: 10px;
`;

export const InputLabel = styled.label`
  display: inline-block;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
`;

export const SpanLabel = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 99;

  &::before,
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: green;
    transition: 0.4s;
  }

  &::after {
    left: auto;
    right: 0;
  }
`;

export const InputG = styled.div<{ active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  padding: 8px;

  ${(props) =>
    props.active
      ? `${SpanLabel} {
    &::after,
    &::before {
      width: 50%;
      transition: 0.4s;
    }
  }`
      : ""}
`;

export const InputElement = styled.input`
  flex: 1;
  display: inline-block;
  background-color: transparent;
  margin-left: 6px;
  border: none;
  outline: none;
`;

export const ProductsLabel = styled.label`
  display: inline-block;
  margin-bottom: 12px;
  margin-top: 12px;
  font-size: 16px;
  font-weight: 600;
`;

export const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const THead = styled.thead`
  width: 100%;
  border-bottom: 1px solid #ddd;
  background-color: #eee;
  font-size: 20px;
  font-weight: 600;

  th {
    padding: 12px 0;
  }
`;

export const TBody = styled.tbody`
  width: 100%;

  td {
    text-align: center;
    padding: 12px 0;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
  }

  td:nth-child(2) {
    text-align: left;
  }
`;
