import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
//import { signOut } from "firebase/auth";
//import { auth } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { clearNewOrder } from "../redux/slices/orderNotificationSlice";
import Swal from "sweetalert2";

import { ShoppingCart, ClipboardList, Monitor, LogOut } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasNewOrder = useSelector(
    (state) => state.orderNotification.hasNewOrder,
  );

  const handleOrderSentClick = () => {
    dispatch(clearNewOrder()); // 🔄 reset notif
    navigate("/order_sent");
  };

  /* const handleLogout = async () => {
    await signOut(auth);
    alert("Logout berhasil!");
    navigate("/login");
  }; */

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
      // Jika No diklik → otomatis tetap di halaman
    });
  };

  return (
    <Container className="py-5">
      <h2 className="text-center fw-bold mb-5">Dashboard</h2>

      <Row className="g-4 justify-content-center">
        {/* KASIR */}
        <Col md={6} lg={3}>
          <Card
            className="h-100 shadow-sm text-center opacity-50"
            style={{ cursor: "not-allowed", pointerEvents: "none" }}
            // onClick={() => navigate("/cashier")}
          >
            <Card.Body>
              <div className="text-success mb-3">
                <ShoppingCart size={40} />
              </div>
              <Card.Title>Kasir</Card.Title>
              <Card.Text className="text-muted">
                Input pesanan pelanggan
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* ORDER SENT (🔥 NOTIF MERAH) */}
        <Col md={6} lg={3}>
          <Card
            bg={hasNewOrder ? "danger" : "light"} // ✅ BACKGROUND
            text={hasNewOrder ? "white" : "dark"} // ✅ TEXT COLOR
            className="h-100 shadow-sm text-center"
            style={{ cursor: "pointer" }}
            onClick={handleOrderSentClick}
          >
            <Card.Body>
              <div className="mb-3">
                <ClipboardList size={40} />
              </div>
              <Card.Title>Order Sent</Card.Title>
              <Card.Text>Daftar pesanan masuk</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* INFORMATION SYSTEM */}
        <Col md={6} lg={3}>
          <Card
            className="h-100 shadow-sm text-center opacity-50"
            style={{ cursor: "not-allowed", pointerEvents: "none" }}
            //onClick={() => navigate("/information_system")}
          >
            <Card.Body>
              <div className="text-primary mb-3">
                <Monitor size={40} />
              </div>
              <Card.Title>Information Systems</Card.Title>
              <Card.Text className="text-muted">
                Informasi sistem aplikasi
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* EXIT */}
        <Col md={6} lg={3}>
          <Card
            className="h-100 shadow-sm text-center"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            <Card.Body>
              <div className="text-danger mb-3">
                <LogOut size={40} />
              </div>
              <Card.Title>Exit</Card.Title>
              <Card.Text className="text-muted">Keluar dari aplikasi</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
