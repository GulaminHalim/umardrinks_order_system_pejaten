import { Routes, Route } from "react-router-dom";
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
  return (
    <Routes>
      <Route path="/" element={<List_Menu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/*<Route path="/list_menu" element={<List_Menu />} />*/}

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
