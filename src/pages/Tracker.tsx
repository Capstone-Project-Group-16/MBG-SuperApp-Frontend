import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// layout utama
const PageWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #FEF7FF;
  display: flex;
  flex-direction: column;
  color: black;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 35px;
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 40px;
  margin-left: 20px;
  overflow: hidden;
`;

// const Container = styled.div`
//   padding: 24px;
//   width: 100%;
//   box-sizing: border-box;
// `;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: black;
`;

const DropdownRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const TableWrapper = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ddd;

  .ag-theme-alpine {
    --ag-foreground-color: black !important;
    --ag-data-color: black !important;
    --ag-header-foreground-color: black !important;
  }

  .ag-cell,
  .ag-cell-value,
  .ag-header-cell-text {
    color: black !important;
  }
`;

const SimpleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;

  th {
    background: #f4f4f4;
    padding: 14px;
    text-align: left;
    font-size: 15px;
    font-weight: 600;
    color: black;
  }

  td {
    padding: 12px;
    border-top: 1px solid #eee;
    cursor: pointer;
  }

  tr:hover td {
    background: #fafafa;
  }
`;

// data types
type Province = string;

type SchoolItem = { id: number; name: string };
type CateringItem = { id: number; name: string };

type StudentMBGRow = {
  date: string;
  plate: string;
  menu: string;
  received: string;
  time: string;
  returned: string;
}; // placeholder

type CateringMBGRow = {
  date: string;
  time: string;
  plate: string;
  menu: string;
  sent: string;
  received: string;
}; // placeholder

// to-do => replace dengan backend
const provinces: Province[] = [
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Sumatera Utara",
  "Sulawesi Selatan",
  "Papua",
];

const dummySchools = [
  { id: 1, name: "SMAN 1 DEPOK" },
  { id: 2, name: "SMAN 2 DEPOK" },
]; // Level 1 Student

const dummyCaterings = [
  { id: 1, name: "Catering A" },
  { id: 2, name: "Catering B" },
]; // Level 1 Catering

const dummyCateringSchools = [
  { id: 10, name: "SMAN 1 DEPOK" },
  { id: 11, name: "SMAN 2 DEPOK" },
]; // Level 2 Catering


export default function Tracker() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [role, setRole] = useState<"" | "student" | "catering">("");
  const [province, setProvince] = useState<Province | "">("");
  const [level, setLevel] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<SchoolItem | CateringItem | null>(null);


const handleSelectRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as "student" | "catering" | "");
    setLevel(0);
    setSelectedItem(null);
  };

  const handleSelectProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvince(e.target.value);
    setLevel(1); // daerah (provinsi) dipilih => masuk tampilan tingkatan 1
    setSelectedItem(null);
  };


  const renderLevel0 = () => (
    <>
      <Title>Distribution Tracker</Title>

      <DropdownRow>
        <Select value={role} onChange={handleSelectRole}>
          <option value="">Pilih Role</option>
          <option value="student">Student</option>
          <option value="catering">Catering</option>
        </Select>

        <Select value={province} onChange={handleSelectProvince}>
          <option value="">Pilih Provinsi</option>
          {provinces.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </Select>
      </DropdownRow>
    </>
  );

// flow untuk role STUDENT

  const renderStudentLevel1 = () => (
    <>
      <Title>Daftar Sekolah — {province}</Title>

      <TableWrapper>
        <SimpleTable>
          <thead>
            <tr>
              <th>Nama Sekolah</th>
            </tr>
          </thead>
          <tbody>
            {dummySchools.map((s) => (
              <tr
                key={s.id}
                onClick={() => {
                  setSelectedItem(s);
                  setLevel(2);
                }}
              >
                <td>{s.name}</td>
              </tr>
            ))}
          </tbody>
        </SimpleTable>
      </TableWrapper>
    </>
  );

  const renderStudentLevel2 = () => {
    const columnDefs: ColDef<StudentMBGRow>[] = [
      { field: "date", headerName: "Tanggal Pemesanan", flex: 1 },
      { field: "plate", headerName: "Kode Piring", flex: 1 },
      { field: "menu", headerName: "Menu", flex: 1 },
      { field: "received", headerName: "Status Penerimaan Piring", flex: 1 },
      { field: "time", headerName: "Waktu Sampai", flex: 1 },
      { field: "returned", headerName: "Status Pengembalian Piring", flex: 1 },
    ];

    // to-do => fetch data sekolah dari backend
    const rowData: StudentMBGRow[] = [
      {
        date: "2025-12-01",
        plate: "P-001",
        menu: "Ultimate Hero Feast",
        received: "Received",
        time: "09:10",
        returned: "No",
      },
    ];

    return (
      <>
        <Title>MBG Detail — {selectedItem ? (selectedItem as SchoolItem).name : ""}</Title>

        <div className="ag-theme-alpine" style={{ width: "100%", height: 500 }}>
          <AgGridReact<StudentMBGRow> columnDefs={columnDefs} rowData={rowData} />
        </div>
      </>
    );
  };

// flow untuk role CATERING

  const renderCateringLevel1 = () => (
    <>
      <Title>Daftar Catering — {province}</Title>

      <TableWrapper>
        <SimpleTable>
          <thead>
            <tr>
              <th>Nama Catering</th>
            </tr>
          </thead>
          <tbody>
            {dummyCaterings.map((c) => (
              <tr
                key={c.id}
                onClick={() => {
                  setSelectedItem(c);
                  setLevel(2);
                }}
              >
                <td>{c.name}</td>
              </tr>
            ))}
          </tbody>
        </SimpleTable>
      </TableWrapper>
    </>
  );

  const renderCateringLevel2 = () => (
    <>
      <Title>Sekolah yang ditangani — {selectedItem?.name}</Title>

      <TableWrapper>
        <SimpleTable>
          <thead>
            <tr>
              <th>Nama Sekolah</th>
            </tr>
          </thead>
          <tbody>
            {dummyCateringSchools.map((s) => (
              <tr
                key={s.id}
                onClick={() => {
                  setSelectedItem(s);
                  setLevel(3);
                }}
              >
                <td>{s.name}</td>
              </tr>
            ))}
          </tbody>
        </SimpleTable>
      </TableWrapper>
    </>
  );

  const renderCateringLevel3 = () => {
    const columnDefs: ColDef<CateringMBGRow>[] = [
      { field: "date", headerName: "Tanggal Pengiriman", flex: 1 },
      { field: "time", headerName: "Waktu Pengiriman", flex: 1 },
      { field: "plate", headerName: "Kode Piring", flex: 1 },
      { field: "menu", headerName: "Menu", flex: 1 },
      { field: "sent", headerName: "Status Pengiriman", flex: 1 },
      { field: "received", headerName: "Status Penerimaan (Returned)", flex: 1 },
    ];

    const rowData: CateringMBGRow[] = [
      // to-do => replace dengan backend
      {
        date: "2025-12-01",
        time: "08:45",
        plate: "P-001",
        menu: "Ultimate Hero Feast",
        sent: "Sent",
        received: "No",
      },
    ];

    return (
      <>
        <Title>MBG Detail — {selectedItem ? (selectedItem as SchoolItem).name : ""}</Title>

        <div className="ag-theme-alpine" style={{ width: "100%", height: 500 }}>
          <AgGridReact<CateringMBGRow> columnDefs={columnDefs} rowData={rowData} />
        </div>
      </>
    );
  };

// final routing logic

  const renderContent = () => {
    if (!role || !province) return renderLevel0();

    if (role === "student") {
      if (level === 1) return renderStudentLevel1();
      if (level === 2) return renderStudentLevel2();
    }

    if (role === "catering") {
      if (level === 1) return renderCateringLevel1();
      if (level === 2) return renderCateringLevel2();
      if (level === 3) return renderCateringLevel3();
    }

    return renderLevel0();
  };

  return (
    <PageWrapper>
      <Navbar />

      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <MainContent>
          {renderContent()}
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}