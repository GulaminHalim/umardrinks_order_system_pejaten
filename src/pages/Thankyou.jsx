import React from "react";
import thankyouImage from "../assets/images/thankyou_image.jpeg";

export default function Thankyou() {
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
