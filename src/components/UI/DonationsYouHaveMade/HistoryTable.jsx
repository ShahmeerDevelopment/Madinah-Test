"use client";

import React, { useState } from "react";
import { useGetHistoryTableList } from "@/api";
import SimpleTableContainer from "@/components/molecules/table/simpleTable/SimpleTableContainer";

const HistoryTable = ({ tableName }) => {
  const [offSet, setOffSet] = useState(0);
  const [sortBy, setSortBy] = useState("donation-date-desc");
  const [perPageLimit, setPerPageLimit] = useState(5);

  const adjustedOffset =
    offSet === 1 || offSet === 0 ? 0 : (offSet - 1) * perPageLimit;

  const {
    data: historyList,
    isLoading,
    isError,
    error,
  } = useGetHistoryTableList(
    { limit: perPageLimit, offset: adjustedOffset },
    sortBy,
  );
  let historyTableData = historyList?.data.data;

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <SimpleTableContainer
        tableName={tableName}
        data={historyTableData?.payments}
        totalRows={historyTableData?.totalPaymentsCount}
        setSortBy={setSortBy}
        setOffSet={setOffSet}
        setPerPageLimit={setPerPageLimit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default HistoryTable;
