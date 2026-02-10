import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";

import Payment from "../pages/Payment";

import Swal from "sweetalert2";
import { addDoc } from "firebase/firestore";

// ================= MOCK FIREBASE =================
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock("../firebase", () => ({
  db: {},
}));

// ================= MOCK SWEETALERT =================
vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

// ================= MOCK REDUX ACTION =================
vi.mock("../redux/slices/cartSlice", () => ({
  removeFromCart: vi.fn(),
  clearCart: vi.fn(() => ({ type: "cart/clearCart" })),
}));

// ================= DATA MOCK =================
const mockCartItems = [
  { id: 1, name: "Coffee", price: 10000, qty: 2 },
  { id: 2, name: "Tea", price: 5000, qty: 1 },
];

// ================= STORE HELPER =================
const createTestStore = (cartItems) =>
  configureStore({
    reducer: {
      cart: () => ({
        items: cartItems,
      }),
    },
  });

const renderWithStore = (store) =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Payment />
      </BrowserRouter>
    </Provider>,
  );

describe("Payment Component (Vitest)", () => {
  let store;

  beforeEach(() => {
    store = createTestStore(mockCartItems);
    vi.spyOn(store, "dispatch");
    vi.spyOn(Storage.prototype, "removeItem");
    vi.clearAllMocks();
  });

  // ================= TEST SUBTOTAL =================
  test("subtotal item = qty * price", () => {
    renderWithStore(store);

    expect(screen.getByText("Rp 20000")).toBeInTheDocument();
    expect(screen.getByText("Rp 5000")).toBeInTheDocument();
  });

  // ================= TEST TOTAL =================
  test("totalPrice adalah jumlah semua subtotal", () => {
    renderWithStore(store);
    expect(screen.getByText("Rp 25000")).toBeInTheDocument();
  });

  // ================= SUCCESS =================
  test("handleOrder sukses menjalankan semua efek", async () => {
    addDoc.mockResolvedValueOnce({ id: "order123" });

    renderWithStore(store);

    fireEvent.change(screen.getByPlaceholderText("Masukkan nama"), {
      target: { value: "Gulamin" },
    });

    fireEvent.click(screen.getByText("Send Order"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "cart/clearCart" }),
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith("welcomeModalShown");
    });
  });

  // ================= ERROR =================
  test("handleOrder error menampilkan alert", async () => {
    addDoc.mockRejectedValueOnce(new Error("Firestore error"));
    vi.spyOn(window, "alert").mockImplementation(() => {});

    renderWithStore(store);

    fireEvent.change(screen.getByPlaceholderText("Masukkan nama"), {
      target: { value: "Gulamin" },
    });

    fireEvent.click(screen.getByText("Send Order"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Terjadi kesalahan");
    });
  });
});
