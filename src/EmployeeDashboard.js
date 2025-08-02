import React, { useMemo, useState, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  CsvExportModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import data from "./employees.json";
ModuleRegistry.registerModules([AllCommunityModule, CsvExportModule]);

const EmployeeDashboard = () => {
  const gridRef = useRef();
  const columnDefs = useMemo(
    () => [
      {
        field: "id",
        filter: true,
        sortable: true,
        maxWidth: 80,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: "left",
        tooltipField: "id",
      },
      {
        headerName: "Name",
        valueGetter: (params) =>
          `${params.data.firstName} ${params.data.lastName}`,
        filter: true,
        sortable: true,
        minWidth: 150,
        pinned: "left",
        tooltipValueGetter: (params) =>
          `${params.data.firstName} ${params.data.lastName}`,
      },
      { field: "email", filter: true, minWidth: 220, tooltipField: "email" },
      { field: "department", filter: true, tooltipField: "department" },
      {
        field: "position",
        filter: true,
        minWidth: 160,
        tooltipField: "position",
      },
      {
        field: "salary",
        filter: "agNumberColumnFilter",
        sortable: true,
        valueFormatter: (p) => `$${p.value.toLocaleString()}`,
        minWidth: 120,
        tooltipValueGetter: (params) =>
          `Annual Salary: $${params.data.salary.toLocaleString()}`,
      },
      {
        field: "hireDate",
        filter: true,
        sortable: true,
        tooltipField: "hireDate",
      },
      {
        field: "age",
        filter: "agNumberColumnFilter",
        sortable: true,
        maxWidth: 90,
        tooltipField: "age",
      },
      {
        field: "location",
        filter: true,
        minWidth: 130,
        tooltipField: "location",
      },
      {
        field: "performanceRating",
        headerName: "Rating",
        filter: "agNumberColumnFilter",
        sortable: true,
        maxWidth: 100,
        cellRenderer: (params) => (
          <span title={`Rated ${params.value} stars`}>
            {params.value} <span style={{ color: "#F5C518" }}>★</span>
          </span>
        ),
        tooltipValueGetter: (params) => `Rating: ${params.value}`,
      },
      {
        field: "projectsCompleted",
        filter: "agNumberColumnFilter",
        sortable: true,
        tooltipField: "projectsCompleted",
      },
      {
        field: "isActive",
        headerName: "Active",
        cellRenderer: (params) =>
          params.value ? (
            <span title="Active" style={{ color: "green", fontWeight: 700 }}>
              ● Active
            </span>
          ) : (
            <span title="Not Active" style={{ color: "red", fontWeight: 700 }}>
              ● Inactive
            </span>
          ),
        filter: true,
        maxWidth: 110,
        tooltipValueGetter: (params) =>
          params.value ? "Currently active" : "Not active",
      },
      {
        field: "skills",
        cellRenderer: (params) =>
          params.value.map((skill) => (
            <span className="skill-badge" title={skill} key={skill}>
              {skill}
            </span>
          )),
        minWidth: 180,
        tooltipValueGetter: (params) => params.value.join(", "),
      },
      { field: "manager", filter: true, tooltipField: "manager" },
    ],
    []
  );

  const [rowData] = useState(data);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);

  const onQuickFilterChange = useCallback(
    (e) => setQuickFilterText(e.target.value),
    []
  );

  const onClearFilters = () => {
    if (gridRef.current) {
      gridRef.current.api.setFilterModel(null);
      setQuickFilterText("");
    }
  };

  const onExportCSV = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  const onSelectionChanged = () => {
    if (gridRef.current) {
      setSelectedRows(gridRef.current.api.getSelectedRows());
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Employee Dashboard</h2>
      <div className="controls-row">
        <input
          type="search"
          placeholder="Search employees..."
          value={quickFilterText}
          onChange={onQuickFilterChange}
          className="search-input"
          aria-label="Search employees"
        />
        <button
          className="dashboard-btn"
          onClick={onClearFilters}
          style={{ marginLeft: 10 }}
        >
          Clear Filters
        </button>

        <button
          className="dashboard-btn"
          onClick={onExportCSV}
          style={{ marginLeft: 10 }}
        >
          Export CSV
        </button>
      </div>

      {selectedRows.length > 0 && (
        <div className="selected-rows-info">
          <strong>{selectedRows.length}</strong> selected
          <button
            className="dashboard-btn batch-action-btn"
            onClick={() => alert("Batch action (e.g., email)")}
          >
            Batch Action
          </button>
        </div>
      )}
      <div className="ag-theme-alpine grid-wrapper">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={pageSize}
          quickFilterText={quickFilterText}
          defaultColDef={{
            resizable: true,
            filter: true,
            sortable: true,
            minWidth: 110,
            tooltipComponentParams: { color: "#FFF" },
          }}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          suppressRowClickSelection={true}
          suppressAggFuncInHeader={true}
          enableRangeSelection={true}
          reactUi="true"
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
