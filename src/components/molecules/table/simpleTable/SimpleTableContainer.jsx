"use client";

import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import BoxComponent from "../../../atoms/boxComponent/BoxComponent";
import RecurringTable from "./RecurringTable";
import PaginationComp from "../../paginationComp/PaginationComp";
import ReceiptsTable from "./ReceiptsTable";
import DonationHistoryTable from "./DonationHistoryTable";
import { paginationHandler } from "../../../../store/slices/donationSlice";

const SimpleTableContainer = ({
  data,
  tableName = "recurring_table",
  setOffSet,
  totalRows,
  setSortBy,
  setPerPageLimit = () => {},
  downloadHandler = () => {},
  isLoading,
  donationInformation = false,
}) => {
  const dispatch = useDispatch();
  const [paginatedData, setPaginatedData] = useState(1);

  const [paginationNumber, setPaginationNumber] = useState({
    _id: 1,
    name: "5 per page",
    value: 5,
  });

  const paginateNumber = useSelector(
    (state) => state.donation.paginationNumber,
  );

  useEffect(() => {
    setPerPageLimit(paginationNumber.value);
  }, [paginationNumber.value, setPerPageLimit]); // Dependency array includes the handler

  const campaignsPerPage = paginationNumber.value;

  const paginateHandler = useCallback(
    (event, value) => {
      dispatch(paginationHandler(value));
      setOffSet(value);

      if (paginatedData === value) {
        return;
      }
      setPaginatedData(value);
    },
    [paginatedData, dispatch],
  );

  const totalPage = Math.ceil(totalRows && totalRows / campaignsPerPage);
  const selectedNumber =
    tableName === "receipt_table" ? paginateNumber : paginatedData;

  const requestSort = useCallback(
    (key, isAscending) => {
      let sortByValue = "";

      switch (key) {
        case "amount":
          sortByValue = isAscending ? "amount-asc" : "amount-desc";
          break;

        case "donation_date":
          sortByValue = isAscending
            ? "donation-date-asc"
            : "donation-date-desc";
          break;

        default:
          // Optionally handle other cases or provide a default sort behavior
          sortByValue = `${key}-${isAscending ? "asc" : "desc"}`;
          break;
      }
      setSortBy(sortByValue);
    },
    [setSortBy],
  );

  const renderTable = useCallback(() => {
    const tableProps = { initialData: data, requestSort, isLoading };
    switch (tableName) {
      case "receipt_table":
        return (
          <ReceiptsTable {...tableProps} downloadHandler={downloadHandler} />
        );
      case "donation_history_table":
        return (
          <DonationHistoryTable
            {...tableProps}
            downloadHandler={downloadHandler}
            donationInformation={donationInformation}
          />
        );
      default:
        return <RecurringTable {...tableProps} />;
    }
  }, [tableName, data, requestSort]);

  const resetPageHandler = () => {
    setPaginatedData(1);
    setOffSet(0);
  };

  return (
    <BoxComponent>
      {renderTable()}
      {data && data.length > 0 && (
        <BoxComponent mt={1.5}>
          <PaginationComp
            totalPage={totalPage}
            marginTop={0}
            page={selectedNumber}
            onChange={paginateHandler}
            setPaginationNumber={setPaginationNumber}
            paginationNumber={paginationNumber}
            resetPage={resetPageHandler}
          />
        </BoxComponent>
      )}
    </BoxComponent>
  );
};

SimpleTableContainer.propTypes = {
  data: PropTypes.any,
  tableName: PropTypes.oneOf([
    "recurring_table",
    "receipt_table",
    "donation_history_table",
  ]),
  setOffSet: PropTypes.func,
  totalRows: PropTypes.number,
  setSortBy: PropTypes.func,
  setPerPageLimit: PropTypes.func,
  downloadHandler: PropTypes.func,
  isLoading: PropTypes.bool,
};
export default SimpleTableContainer;
