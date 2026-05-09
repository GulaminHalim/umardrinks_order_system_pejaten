import { useEffect, useState } from "react";

//import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { ArrowLeft } from "lucide-react";
import Receipt from "../components/Receipt";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

export default function Order_Sent() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";

    const date = timestamp.toDate(); // convert Firestore Timestamp
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 1. Ubah konfigurasi useReactToPrint agar lebih stabil
  const handlePrintBluetooth = (order) => {
    const lineWidth = 32;

    const leftRight = (left, right) => {
      const space = lineWidth - left.length - right.length;
      return left + " ".repeat(space > 0 ? space : 1) + right + "\n";
    };

    let text = "";

    // RESET PRINTER
    text += "\x1B\x40";

    // 🔥 HEADER ATAS
    text += "\x1B\x61\x01"; // center
    text += "\x1B\x45\x01"; // bold ON
    text += "\x1D\x21\x11"; // double size

    text += "UMAR DRINKS\n";

    text += "\x1D\x21\x00"; // normal size
    text += "\x1B\x45\x00"; // bold OFF

    text += "POTATO BOLOGNESE\n";
    text += "MAC & CHEESE\n";
    text += "FIRE CHICKEN POPCORN\n";

    text += "\n";
    text += "Jl. Sawo Manila No.1\n";
    text += "Jati Padang, Pasar Minggu\n";
    text += "Jakarta Selatan\n";
    text += "(Seberang Gerbang UNAS)\n";
    text += "0858-912-66106\n\n\n";

    text += leftRight("Tanggal", formatDateTime(order.createdAt));
    text += "================================\n";

    // 🔥 BALIK KE KIRI
    text += "\x1B\x61\x00";

    text += `Customer Name: ${order.customerName}\n`;
    text += `Payment Method: ${order.paymentType}\n`;

    text += "================================\n";

    // ITEM LIST
    order.items.forEach((item) => {
      const total = item.qty * item.price;

      text += `${item.name}\n`;

      text += leftRight(
        `${item.qty} x ${item.price.toLocaleString("id-ID")}`,
        total.toLocaleString("id-ID"),
      );
    });

    text += "================================\n";

    // TOTAL
    text += "\x1B\x45\x01";
    text += leftRight(
      "TOTAL",
      `Rp ${Number(order.totalPrice).toLocaleString("id-ID")}`,
    );
    text += "\x1B\x45\x00";

    text += "\n\n";

    // FOOTER
    text += "\x1B\x61\x01";
    text += "Selamat Menikmati\n";
    text += "Selamat Datang Kembali\n";

    // 🔥 AUTO CUT
    text += "\x1D\x56\x41\x10";

    // 🔥 AUTO PRINT
    const url =
      "intent://print?text=" +
      encodeURIComponent(text) +
      "#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;";

    window.location.href = url;
  };

  useEffect(() => {
    if (orders.length === 0) return;

    const autoPrint = async () => {
      const newOrders = orders.filter((order) => order.hasNewOrder === true);

      for (const order of newOrders) {
        // 🔥 PRINT OTOMATIS
        handlePrintBluetooth(order);

        // 🔥 kasih delay biar tidak tabrakan (PENTING)
        await new Promise((res) => setTimeout(res, 1500));

        // 🔥 update biar tidak print ulang
        await updateDoc(doc(db, "orders", order.id), {
          hasNewOrder: false,
        });
      }
    };

    autoPrint();
  }, [orders]);

  // Ambil data order dari Firestore (REALTIME)
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(orderData);
    });

    return () => unsubscribe();
  }, []); // ← INI WAJIB

  useEffect(() => {
    if (orders.length === 0) return;

    const resetNotification = async () => {
      const pendingOrders = orders.filter(
        (order) => order.hasNewOrder === true,
      );

      for (const order of pendingOrders) {
        await updateDoc(doc(db, "orders", order.id), {
          hasNewOrder: false,
        });
      }
    };

    resetNotification();
  }, [orders]);

  // Update status order
  const handleStatusChange = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);

    await updateDoc(orderRef, {
      status: "completed",
    });
  };

  return (
    <Container className="py-4" style={{ maxWidth: "1000px" }}>
      {/* BACK BUTTON */}
      <Button
        variant="link"
        className="d-flex align-items-center gap-2 mb-3 text-decoration-none"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </Button>

      <h2 className="text-center mb-4 fw-bold">Incoming Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders yet...</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <small className="text-muted">
                    {formatDateTime(order.createdAt)}
                  </small>
                  <br />
                  <strong>Customer:</strong> {order.customerName}
                  <br />
                  <strong>Payment type:</strong> {order.paymentType}
                  <br />
                  <strong>Total:</strong> Rp {order.totalPrice}
                </div>

                <div className="d-flex align-items-center gap-3">
                  <Badge
                    bg={order.status === "pending" ? "warning" : "success"}
                  >
                    {order.status}
                  </Badge>

                  <Form.Check
                    type="checkbox"
                    disabled={order.status === "completed"}
                    checked={order.status === "completed"}
                    onChange={() => handleStatusChange(order.id)}
                  />

                  {/* BUTTON PRINT MUNCUL JIKA COMPLETED */}
                  {order.status === "completed" && (
                    <Button
                      size="sm"
                      onClick={() => handlePrintBluetooth(order)}
                    >
                      Print
                    </Button>
                  )}
                </div>
              </div>

              <ListGroup variant="flush">
                {order.items.map((item, index) => (
                  <ListGroup.Item key={index}>
                    {item.qty} x {item.name} — Rp {item.price * item.qty}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}
