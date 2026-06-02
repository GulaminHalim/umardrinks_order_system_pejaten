import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import thankyouImage from "../assets/images/thankyou_image.jpeg";

export default function Thankyou() {
  const location = useLocation();

  const order = location.state?.order;

  useEffect(() => {
    if (!order) return;

    const lineWidth = 32;

    const leftRight = (left, right) => {
      const space = lineWidth - left.length - right.length;
      return left + " ".repeat(space > 0 ? space : 1) + right + "\n";
    };

    let text = "";

    text += "\x1B\x40";

    text += "\x1B\x61\x01";
    text += "\x1B\x45\x01";
    text += "\x1D\x21\x11";

    text += "UMAR DRINKS\n";

    text += "\x1D\x21\x00";
    text += "\x1B\x45\x00";

    text += "POTATO BOLOGNESE\n";
    text += "MAC & CHEESE\n";
    text += "FIRE CHICKEN POPCORN\n";

    text += "\n";
    text += "Jl. Sawo Manila No.1\n";
    text += "Jati Padang, Pasar Minggu\n";
    text += "Jakarta Selatan\n\n";
    text += "(Seberang Gerbang UNAS)\n";
    text += "0858-912-66106\n\n\n";

    text += "================================\n";

    text += "\x1B\x61\x00";

    text += `Customer Name: ${order.customerName}\n`;
    text += `Payment Method: ${order.paymentType}\n`;

    text += "================================\n";

    order.items.forEach((item) => {
      const total = item.qty * item.price;

      text += `${item.name}\n`;

      text += leftRight(`${item.qty} x ${item.price}`, total.toString());
    });

    text += "================================\n";

    text += leftRight(
      "TOTAL",
      `Rp ${Number(order.totalPrice).toLocaleString("id-ID")}`,
    );

    text += "\n\n";

    text += "\x1B\x61\x01";
    text += "Selamat Menikmati\n";
    text += "Selamat Datang Kembali\n";

    text += "\x1D\x56\x41\x10";

    window.location.href =
      `intent:${encodeURIComponent(text)}` +
      "#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;";
  }, [order]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <img
        src={thankyouImage}
        alt="Thank You"
        style={{ maxWidth: "300px", marginBottom: "20px" }}
      />

      <h2>Terima Kasih 🙏</h2>

      <p>Kami akan segera memproses pesanan Anda.</p>
    </div>
  );
}
