import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import MenuCard from "./MenuCard";
import { data_order_list } from "../model/Data_Order";
import { AlignCenter, Search, X, ShoppingCart } from "lucide-react";
import "../style.css";

export default function List_Menu() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isStickySearch, setIsStickySearch] = useState(false);

  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("welcomeModalShown");

    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
        localStorage.setItem("welcomeModalShown", "true");
      }, 1000); // 3 detik

      return () => clearTimeout(timer);
    }
  }, []);

  // DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsStickySearch(true);
      } else {
        setIsStickySearch(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredMenu = data_order_list.filter((item) =>
    item.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setShowModal(true);
    } else {
      navigate("/payment");
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4 fw-bold">List Menu</h2>

      {/* SEARCH */}
      <div
        className={`search-wrapper mb-4 ${
          isStickySearch ? "search-sticky" : ""
        }`}
      >
        <InputGroup className="search-input shadow-sm">
          <InputGroup.Text className="bg-white border-0">
            <Search size={18} className="text-muted" />
          </InputGroup.Text>

          <Form.Control
            placeholder="Cari menu favorit kamu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 shadow-none"
          />

          {search && (
            <Button
              variant="light"
              className="border-0"
              onClick={() => setSearch("")}
            >
              <X size={18} />
            </Button>
          )}
        </InputGroup>
      </div>

      {/* GRID */}
      <Row>
        {filteredMenu.length ? (
          filteredMenu.map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <MenuCard item={item} />
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">Menu tidak ditemukan...</p>
        )}
      </Row>
      {filteredMenu.length > 0 && (
        <Button
          id="checkout-main"
          className="btn-modern w-100 mt-3"
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      )}
      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="align-center">Attention</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <p>Oops! Your cart is empty...</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      {/* WELCOME MODAL */}
      <Modal
        show={showWelcomeModal}
        onHide={() => setShowWelcomeModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Hello..!</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <p>Welcome to Umar Drinks...</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowWelcomeModal(false)}>
            Start Ordering
          </Button>
        </Modal.Footer>
      </Modal>
      {filteredMenu.length > 0 && (
        <Button
          className="floating-checkout"
          onClick={() => {
            const target = document.getElementById("checkout-main");
            target?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <ShoppingCart size={16} className="me-2" />
          Checkout
        </Button>
      )}
    </Container>
  );
}
