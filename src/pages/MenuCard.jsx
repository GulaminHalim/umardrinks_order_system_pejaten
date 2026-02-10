import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { addToCart } from "../redux/slices/cartSlice";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function MenuCard({ item }) {
  const [qty, setQty] = useState(0);
  const dispatch = useDispatch();

  function alertToCart() {
    Swal.fire({
      title: "Succees!",
      text: `${qty} ${item.name} added to cart!`,
      icon: "success",
      confirmButtonText: "OK",
    });
  }

  const handleAddToCart = () => {
    if (qty === 0) return;

    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: qty,
      }),
    );
    setQty(0);
    //alert(`${qty} ${item.name} added to cart!`);
    alertToCart();
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Img
        variant="top"
        src={item.image}
        style={{ height: "300px", objectFit: "cover" }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title>{item.name}</Card.Title>
        <Link
          to={`/detail/${item.id}`}
          className="text-primary mb-2"
          style={{ fontSize: "14px", textDecoration: "none" }}
        >
          Detail Produk
        </Link>
        <Card.Text className="text-muted" style={{ fontSize: "20px" }}>
          Rp {item.price}
        </Card.Text>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center border rounded px-2">
            <Button variant="light" onClick={() => qty > 0 && setQty(qty - 1)}>
              -
            </Button>

            <span className="px-3 fw-bold">{qty}</span>

            <Button variant="light" onClick={() => setQty(qty + 1)}>
              +
            </Button>
          </div>

          <Button variant="primary" onClick={handleAddToCart}>
            Add to cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
