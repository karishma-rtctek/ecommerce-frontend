// src/pages/AdminProducts.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string; // emoji or URL
};

export default function AdminProducts() {
  // list + pagination
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // create form
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // edit modal
  const [editing, setEditing] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState<boolean>(false);

  // fetch products (uses backend pagination if provided)
  const fetchProducts = async (p = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`http://localhost:5000/api/products?page=${p}`);
      // If backend returns { products, pagination } use that
      if (res.data.products && res.data.pagination) {
        setProducts(res.data.products);
        setPage(res.data.pagination.currentPage || p);
        setTotalPages(res.data.pagination.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        // older API returning plain array
        setProducts(res.data);
        setPage(1);
        setTotalPages(1);
      } else {
        // fallback
        setProducts(res.data.products ?? []);
        setPage(p);
        setTotalPages(res.data.totalPages ?? 1);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // create product
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price === "" || Number.isNaN(Number(price))) {
      alert("Please provide valid name and price.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/products", {
        name,
        price: Number(price),
        description,
        image,
      });

      // reset form
      setName("");
      setPrice("");
      setDescription("");
      setImage("");

      // fetch first page so new product appears (or fetch last page if you want)
      fetchProducts(page);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to create product");
    }
  };

  // delete product
  const handleDelete = async (id: number) => {
    const ok = window.confirm("Delete this product? This action cannot be undone.");
    if (!ok) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      // refresh list: if last item on page removed you may want to go to previous page
      fetchProducts(page);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to delete product");
    }
  };

  // open edit modal
  const openEdit = (p: Product) => {
    setEditProduct({ ...p });
    setEditing(true);
  };

  const closeEdit = () => {
    setEditProduct(null);
    setEditing(false);
  };

  // submit edit
  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setEditLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/products/${editProduct.id}`, {
        name: editProduct.name,
        price: Number(editProduct.price),
        description: editProduct.description,
        image: editProduct.image,
      });

      setEditLoading(false);
      closeEdit();
      fetchProducts(page);
    } catch (err: any) {
      setEditLoading(false);
      console.error(err);
      alert(err?.response?.data?.error || "Failed to update product");
    }
  };

  // helper to render image or emoji
  const renderImage = (img: string | undefined) => {
    if (!img) return <div style={styles.thumbPlaceholder}>🛍️</div>;
    // if it's a URL (starts with http or /), show img tag
    if (img.startsWith("http") || img.startsWith("/")) {
      return <img src={img} alt="" style={styles.thumbImg} />;
    }
    // else assume emoji or text
    return <div style={styles.thumbEmoji}>{img}</div>;
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Admin — Products</h1>

      {/* CREATE FORM */}
      <form onSubmit={handleCreate} style={styles.formCard}>
        <h3 style={{ marginTop: 0 }}>Create New Product</h3>

        <div style={styles.row}>
          <label style={styles.label}>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            placeholder="Classic White T-Shirt"
          />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Price (₹)</label>
          <input
            value={price === "" ? "" : String(price)}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            style={styles.input}
            placeholder="499"
            type="number"
            min={0}
          />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
            placeholder="Short product description"
          />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Image (emoji or URL)</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={styles.input}
            placeholder="👕  or  /uploads/shirt.png  or  https://..."
          />
        </div>

        <div style={{ textAlign: "right" }}>
          <button style={styles.primaryBtn} type="submit">
            Create Product
          </button>
        </div>
      </form>

      {/* ERROR / LOADING */}
      {error && <div style={styles.error}>{error}</div>}
      {loading && <div style={styles.info}>Loading products…</div>}

      {/* PRODUCT LIST */}
      <div style={styles.listCard}>
        <div style={styles.listHeader}>
          <strong style={{ width: 60 }}>#</strong>
          <strong style={{ flex: 1 }}>Product</strong>
          <strong style={{ width: 120, textAlign: "right" }}>Price</strong>
          <strong style={{ width: 200, textAlign: "right" }}>Actions</strong>
        </div>

        {products.map((p, idx) => (
          <div key={p.id} style={styles.listRow}>
            <div style={{ width: 60 }}>{renderImage(p.image)}</div>

            <div style={{ flex: 1 }}>
              <div style={styles.productName}>{p.name}</div>
              <div style={styles.productDesc}>{p.description}</div>
            </div>

            <div style={{ width: 120, textAlign: "right", fontWeight: 700 }}>₹{p.price}</div>

            <div style={{ width: 200, textAlign: "right" }}>
              <button style={styles.secondaryBtn} onClick={() => openEdit(p)}>
                Edit
              </button>

              <button
                style={{ ...styles.secondaryBtn, marginLeft: 8, background: "#ff4a4a", color: "white" }}
                onClick={() => handleDeleteConfirm(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Pagination controls if multiple pages */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button onClick={() => changePage(Math.max(1, page - 1))} style={styles.pageBtn}>
              Prev
            </button>
            <span style={{ padding: "0 10px" }}>
              Page {page} of {totalPages}
            </span>
            <button onClick={() => changePage(Math.min(totalPages, page + 1))} style={styles.pageBtn}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editing && editProduct && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Edit Product</h3>

            <form onSubmit={submitEdit}>
              <div style={styles.row}>
                <label style={styles.label}>Name</label>
                <input
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.row}>
                <label style={styles.label}>Price</label>
                <input
                  value={String(editProduct.price)}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: Number(e.target.value) })
                  }
                  style={styles.input}
                  type="number"
                  min={0}
                />
              </div>

              <div style={styles.row}>
                <label style={styles.label}>Description</label>
                <input
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.row}>
                <label style={styles.label}>Image (emoji or URL)</label>
                <input
                  value={editProduct.image}
                  onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button type="button" onClick={closeEdit} style={styles.ghostBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={editLoading} style={styles.primaryBtn}>
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // helper: confirm delete (placed here so we can use fetchProducts)
  function handleDeleteConfirm(id: number) {
    if (!window.confirm("Delete this product?")) return;
    handleDelete(id);
  }

  // helper: change page
  function changePage(p: number) {
    setPage(p);
    fetchProducts(p);
  }
}

/* --------------------- styles --------------------- */

const styles: { [k: string]: React.CSSProperties } = {
  page: {
    padding: 24,
    maxWidth: 1100,
    margin: "12px auto",
    fontFamily: "Inter, Arial, sans-serif",
  },
  heading: { fontSize: 26, marginBottom: 12 },
  formCard: {
    padding: 16,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    marginBottom: 18,
  },
  row: { display: "flex", gap: 12, alignItems: "center", marginBottom: 10 },
  label: { width: 140, fontWeight: 600 },
  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #e6e6e6",
  },
  primaryBtn: {
    padding: "10px 14px",
    background: "#111",
    color: "white",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "8px 12px",
    background: "#f3f4f6",
    borderRadius: 8,
    border: "1px solid #e6e6e6",
    cursor: "pointer",
  },
  ghostBtn: {
    padding: "8px 12px",
    background: "transparent",
    borderRadius: 8,
    border: "1px solid #e6e6e6",
    cursor: "pointer",
  },

  listCard: {
    padding: 12,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    borderBottom: "1px solid #eee",
    marginBottom: 8,
  },
  listRow: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #f2f2f2",
  },
  thumbImg: {
    width: 48,
    height: 48,
    objectFit: "cover",
    borderRadius: 8,
  },
  thumbEmoji: {
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
  },
  thumbPlaceholder: {
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f7f7",
    borderRadius: 8,
    fontSize: 20,
  },

  productName: { fontWeight: 700 },
  productDesc: { color: "#666", fontSize: 13 },

  pagination: { display: "flex", justifyContent: "center", padding: 12, gap: 8 },
  pageBtn: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #e6e6e6",
    background: "#fff",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    width: 640,
    borderRadius: 12,
    background: "#fff",
    padding: 18,
    boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
  },

  error: { color: "red", marginTop: 10 },
  info: { color: "#666", marginTop: 10 },
};
