import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Order_Sent from "./pages/Order_Sent";
import List_Menu from "./pages/List_Menu";
import MenuCard from "./pages/MenuCard";
import Payment from "./pages/Payment";
import Information_System from "./pages/Information_System";
import Cashier from "./pages/Cashier";
import Thankyou from "./pages/Thankyou";
import Detail_Page from "./pages/Detail_Page";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ERROR CONNECTION
  if (!isOnline) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8f9fa",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ color: "red", marginBottom: "10px" }}>Connection Error</h1>

        <p>
          Tidak ada koneksi internet.
          <br />
          Silahkan periksa jaringan Anda.
        </p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<List_Menu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/thankyou" element={<Thankyou />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/order_sent" element={<Order_Sent />} />

      <Route path="/menu_card" element={<MenuCard />} />

      <Route path="/detail/:id" element={<Detail_Page />} />

      <Route path="/payment" element={<Payment />} />

      <Route path="/cashier" element={<Cashier />} />

      <Route path="/information_system" element={<Information_System />} />
    </Routes>
  );
}

export default App;
