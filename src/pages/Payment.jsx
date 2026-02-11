import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Form from "react-bootstrap/Form";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";
import Thankyou from "./Thankyou.jsx";

export default function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  function alertToOrderSent() {
    Swal.fire({
      title: "Success!",
      text: "Order berhasil dikirim ke kasir, \nSilahkan tunggu konfirmasi dari kasir!",
      icon: "success",
      confirmButtonText: "OK",
    });
  }

  const handleOrder = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        customerName: customerName,
        items: cartItems,
        totalPrice: totalPrice,
        status: "pending",
        hasNewOrder: true,
        createdAt: serverTimestamp(),
      });

      alertToOrderSent();
      dispatch(clearCart());
      localStorage.removeItem("welcomeModalShown");
      setOrderSuccess(true);

      // alert("Order berhasil dikirim ke kasir, \nSilahkan tunggu konfirmasi dari kasir!");
    } catch (error) {
      console.error("Gagal menyimpan order:", error);
      alert("Terjadi kesalahan");
    }
  };

  // Ambil data cart dari Redux
  const cartItems = useSelector((state) => state.cart.items);

  if (orderSuccess) {
    return <Navigate to="/thankyou" replace />;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/" />;
  }

  // Hitung total
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  return (
    <Container className="py-4" style={{ maxWidth: "600px" }}>
      {/* BACK BUTTON */}
      <Button
        variant="link"
        className="d-flex align-items-center gap-2 mb-3 text-decoration-none"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
        Back to Menu
      </Button>
      <h2 className="text-center mb-4 fw-bold">Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-muted">Keranjang masih kosong</p>
      ) : (
        <Card className="shadow-sm">
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item
                key={item.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.name}</strong>
                  <div className="text-muted">
                    {item.qty} x Rp {item.price}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold">Rp {item.price * item.qty}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    ✕
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Card.Body>
            <div className="d-flex justify-content-between mb-3">
              <h5>Total</h5>
              <h5 className="fw-bold">Rp {totalPrice}</h5>
            </div>

            <Form className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Nama Pemesan</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan nama"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </Form.Group>
            </Form>

            <Button
              variant="success"
              className="w-100 mb-2"
              disabled={!customerName}
              onClick={handleOrder}
            >
              Send Order
            </Button>

            <Button
              variant="outline-danger"
              className="w-100"
              onClick={() => dispatch(clearCart())}
            >
              Cancel Order
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
