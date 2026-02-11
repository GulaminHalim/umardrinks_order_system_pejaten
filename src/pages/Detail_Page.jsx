import { useParams, useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { data_order_list } from "../model/Data_Order";
import "../style.css";

export default function Detail_Page() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = data_order_list.find((item) => item.id === parseInt(id));

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h3>Produk tidak ditemukan</h3>
        <Button onClick={() => navigate(-1)}>Kembali</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button
        variant="link"
        className="text-decoration-none"
        onClick={() => navigate(-1)}
      >
        ← Kembali
      </Button>

      <Card className="shadow-sm mt-3">
        <Card.Img src={product.image} className="product-image" />

        <Card.Body>
          <Card.Title className="fs-3">{product.name}</Card.Title>

          <Card.Text className="text-muted fs-4">Rp {product.price}</Card.Text>

          <Card.Text>Komposisi : {product.komposisi}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}
