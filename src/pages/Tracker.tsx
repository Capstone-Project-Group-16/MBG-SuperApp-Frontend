import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
`;

// const Container = styled.div`
//   padding: 24px;
//   width: 100%;
//   box-sizing: border-box;
// `;

const Title = styled.h2`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 16px;
  color: black;
`;

const SubtitleBox = styled.div`
  flex: 1;
  min-height: 40px;
  background: #b1d2b2;
  border: 1px solid #8aa18d;
  border-radius: 5px;

  display: flex;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 15px;

  color: black;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
`;

const DropdownRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  width: 130px;
  height: 33px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 30px;
  border: 2px solid #45a246;
  padding: 6px 14px;
  font-size: 14px;
  color: black;
  cursor: pointer;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23454a4f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(69, 162, 70, 0.12);
  }
`;

// tabel tingkatan 1 student dan 1,2 catering
const TableCardWrapper = styled.div`
  flex: 1;
  height: auto;
  position: relative;
  margin-top: 20px;
`;

const CardOuter = styled.div`
  flex: 1;
  min-height: 120px;
  background: white;
  border-radius: 10px;
  border: 2px rgba(69, 162, 70, 0.5) solid;
  position: relative;
  padding: 16px;
`;

const CardHeader = styled.div`
  flex: 1;
  background: #b1d2b2;
  border-top-left-radius: 5px;
  border-top-right-radius: 10px;
  border: 1px #8aa18d solid;

  display: flex;
  align-items: center;
  padding-left: 15px;

  font-size: 20px;
  font-weight: 700;
  color: black;
`;

const ListItem = styled.div`
  height: 60px;
  background: #e5ffe6;
  border-radius: 10px;
  border: 1px #8aa18d solid;

  margin: 12px 0;
  display: flex;
  align-items: center;
  padding-left: 20px;

  font-size: 23px;
  font-weight: 700;
  color: black;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    background: #d7ffd7;
  }
`;

const ListSubtitle = styled.div`
  margin-top: 6px;
  margin-left: 4px;
  font-size: 15px;
  font-weight: 400;
  color: black;
`;

// const TableWrapper = styled.div`
//   width: 100%;
//   border-radius: 12px;
//   overflow: hidden;
//   border: 1px solid #ddd;

//   .ag-theme-alpine {
//     --ag-foreground-color: black !important;
//     --ag-data-color: black !important;
//     --ag-header-foreground-color: black !important;
//   }

//   .ag-cell,
//   .ag-cell-value,
//   .ag-header-cell-text {
//     color: black !important;
//   }
// `;

// detail tabel
const DetailTableCard = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  border: 2px solid #8ec58f;
  overflow: hidden;
  margin-top: 10px;
`;

const DetailHeaderBar = styled.div`
  background: #e9f6ea;
  padding: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #2d4d30;
`;

// tabel tingkat akhir tiap role (final mbg data)

// const DetailTableWrapperScrollable = styled.div`
//   max-height: 350px;
//   overflow-y: auto;
// `;

const DetailTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #f7fcf7;

  th {
    position: sticky;
    top: 0;
    background: #e9f6ea;
    z-index: 2;

    font-size: 14px;
    padding: 12px;
    border-bottom: 2px solid #c2dfc2;
    color: #2b4b2e;
  }

  td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #d8ead8;
    font-size: 14px;
    background: white;
  }
`;

const DateFilterRow = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const DateFilterButton = styled.button`
  background: #e6ffe7;
  border: 2px solid #57a65a;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #d3ffd4;
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
}; // placeholder !!!

type CateringMBGRow = {
  date: string;
  time: string;
  plate: string;
  menu: string;
  sent: string;
  received: string;
}; // placeholder !!!

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

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  

  // header (title + subtitle + dropdown) — akan selalu dirender di atas
  const renderHeader = () => (
    <>
      <Title>Distribution Tracker</Title>
      <SubtitleBox>
        Update mengenai persebaran MBG ke berbagai sekolah melalui data pada tabel
        katering dan sekolah. Lakukan filtering pada tombol di bawah sebagai berikut.
      </SubtitleBox>

      <DropdownRow>
        <Select aria-label="Pilih Role" value={role} onChange={handleSelectRole}>
          <option value="">Pilih Role</option>
          <option value="student">Student</option>
          <option value="catering">Catering</option>
        </Select>

        <Select aria-label="Pilih Provinsi" value={province} onChange={handleSelectProvince}>
          <option value="">Pilih Provinsi</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </DropdownRow>
    </>
  );

  // bagian content (hasil filtering)
  const renderContent = () => {
    if (!role || !province) {
      return null;
    }

    if (role === "student") {
      if (level === 1) {
        return (
          <>
            <Title>Daftar Sekolah — {province}</Title>

            <TableCardWrapper>
              <CardOuter>
                <CardHeader>List sekolah per daerah</CardHeader>

                <ListSubtitle>Total sekolah: {dummySchools.length}</ListSubtitle>

                {dummySchools.map((s) => (
                  <ListItem
                    key={s.id}
                    onClick={() => {
                      setSelectedItem(s);
                      setLevel(2);
                    }}
                  >
                    {s.name}
                  </ListItem>
                ))}
              </CardOuter>
            </TableCardWrapper>
          </>
        );
      }

      if (level === 2) {

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
            <Title>
              MBG Detail — {selectedItem ? (selectedItem as SchoolItem).name : ""}
            </Title>

            <DateFilterRow>
              <DateFilterButton>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-start"
                  placeholderText="Pilih tanggal"
                />
              </DateFilterButton>
            </DateFilterRow>

            <DetailTableCard>
              <DetailHeaderBar>
                {selectedItem ? (selectedItem as SchoolItem).name : ""}
              </DetailHeaderBar>

                <DetailTable>
                  <thead>
                    <tr>
                      <th>Tanggal Pemesanan</th>
                      <th>Kode Piring</th>
                      <th>Menu</th>
                      <th>Status Penerimaan</th>
                      <th>Waktu Sampai</th>
                      <th>Status Pengembalian</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rowData.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.date}</td>
                        <td>{row.plate}</td>
                        <td>{row.menu}</td>
                        <td>{row.received}</td>
                        <td>{row.time}</td>
                        <td>{row.returned}</td>
                      </tr>
                    ))}
                  </tbody>
                </DetailTable>
            </DetailTableCard>
          </>
        );
      }
    }

    if (role === "catering") {
      if (level === 1) {
        return (
          <>
            <Title>Daftar Catering — {province}</Title>

            <TableCardWrapper>
              <CardOuter>
                <CardHeader>List catering per daerah</CardHeader>

                <ListSubtitle>Total catering: {dummyCaterings.length}</ListSubtitle>

                {dummyCaterings.map((c) => (
                  <ListItem
                    key={c.id}
                    onClick={() => {
                      setSelectedItem(c);
                      setLevel(2);
                    }}
                  >
                    {c.name}
                  </ListItem>
                ))}
              </CardOuter>
            </TableCardWrapper>

          </>
        );
      }

      if (level === 2) {
        return (
          <>
            <Title>Sekolah yang ditangani — {selectedItem ? (selectedItem as CateringItem).name : ""}</Title>

            <TableCardWrapper>
              <CardOuter>
                <CardHeader>List sekolah per daerah</CardHeader>

                <ListSubtitle>Total sekolah: {dummyCateringSchools.length}</ListSubtitle>

                {dummyCateringSchools.map((s) => (
                  <ListItem
                    key={s.id}
                    onClick={() => {
                      setSelectedItem(s);
                      setLevel(3);
                    }}
                  >
                    {s.name}
                  </ListItem>
                ))}
              </CardOuter>
            </TableCardWrapper>
          </>
        );
      }

      if (level === 3) {

        const rowData: CateringMBGRow[] = [
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
            <Title>
              MBG Detail — {selectedItem ? (selectedItem as SchoolItem).name : ""}
            </Title>

            <DateFilterRow>
              <DateFilterButton>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-start"
                  placeholderText="Pilih tanggal"
                />
              </DateFilterButton>
            </DateFilterRow>

            <DetailTableCard>
              <DetailHeaderBar>
                {selectedItem ? (selectedItem as SchoolItem).name : ""}
              </DetailHeaderBar>

                <DetailTable>
                  <thead>
                    <tr>
                      <th>Tanggal Pengiriman</th>
                      <th>Waktu Pengiriman</th>
                      <th>Kode Piring</th>
                      <th>Menu</th>
                      <th>Status Pengiriman</th>
                      <th>Status Penerimaan</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rowData.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.date}</td>
                        <td>{row.time}</td>
                        <td>{row.plate}</td>
                        <td>{row.menu}</td>
                        <td>{row.sent}</td>
                        <td>{row.received}</td>
                      </tr>
                    ))}
                  </tbody>
                </DetailTable>
            </DetailTableCard>
          </>
        );
      }

    return null;
  };
}

  return (
    <PageWrapper>
      <Navbar />

      <ContentWrapper>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <MainContent>
          {renderHeader()}
          {renderContent()}
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  );
}
