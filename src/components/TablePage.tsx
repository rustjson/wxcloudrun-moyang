import { useState, useEffect } from "react";
import {
  CellBody,
  CellFooter,
  Cells,
  Page,
  CellsTitle,
  Cell,
} from "react-weui";
import "react-weui/build/packages/react-weui.css";

interface TableData {
  id: number;
  order_id: string;
  user_id: string;
  status: string;
  created_at: number; // timestamp
}

function TablePage() {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  // Format: MM-DD HH:SS (month-day and hour:second)
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${month}-${day} ${hours}:${seconds}`;
  };

  useEffect(() => {
    // Simulate API call - replace this with your actual API implementation
    const fetchData = async () => {
      try {
        setLoading(true);
        fetch("/api/data")
          .then((res) => {
            return res.json();
          })
          .then(({ data }) => {
            console.log("data", data);
            setData(data);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="table-container">
        <h2>Table Data</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Page
      style={{ marginTop: "45px" }}
      className="cell"
      title="List"
      subTitle="列表"
    >
      <CellsTitle></CellsTitle>
      <Cells>
        {data?.map((row) => (
          <Cell>
            {/* <CellHeader>
              <img
                src={""}
                alt=""
                style={{
                  display: `block`,
                  width: `20px`,
                  marginRight: `5px`,
                }}
              />
            </CellHeader> */}
            <CellBody>
              {row.order_id?.substring(0, 2)}***
              {row.order_id?.slice(-5)}
            </CellBody>
            <CellFooter>{formatDate(row.created_at)}</CellFooter>
          </Cell>
        ))}
      </Cells>
    </Page>
  );
}

export default TablePage;
