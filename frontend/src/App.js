import React, { useCallback, useEffect, useMemo, useState } from "react";
import API from "./services/api";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import "./index.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 2500);
  };

  const fetchContacts = useCallback(async () => {
  try {
    setLoading(true);
    const res = await API.get("/contacts");
    setContacts(res.data);
  } catch (error) {
    showMessage("error", "Failed to fetch contacts");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
  fetchContacts();
}, [fetchContacts]);

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showMessage("error", "Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      showMessage("error", "Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showMessage("error", "Please enter a valid email");
      return false;
    }

    if (!formData.phone.trim()) {
      showMessage("error", "Phone number is required");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      showMessage("error", "Phone number must be exactly 10 digits");
      return false;
    }

    const duplicateContact = contacts.find((contact) => {
      const sameEmail =
        contact.email.toLowerCase() === formData.email.toLowerCase();
      const samePhone = contact.phone === formData.phone;

      if (editId) {
        return contact._id !== editId && (sameEmail || samePhone);
      }

      return sameEmail || samePhone;
    });

    if (duplicateContact) {
      showMessage("error", "Contact with same email or phone already exists");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editId) {
        await API.put(`/contacts/${editId}`, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        });
        showMessage("success", "Contact updated successfully");
        setEditId(null);
      } else {
        await API.post("/contacts", {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        });
        showMessage("success", "Contact added successfully");
      }

      setFormData({ name: "", email: "", phone: "" });
      fetchContacts();
    } catch (error) {
      showMessage("error", "Something went wrong while saving contact");
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
    setEditId(contact._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (!confirmed) return;

    try {
      await API.delete(`/contacts/${id}`);
      showMessage("success", "Contact deleted successfully");

      if (editId === id) {
        setEditId(null);
        setFormData({ name: "", email: "", phone: "" });
      }

      fetchContacts();
    } catch (error) {
      showMessage("error", "Failed to delete contact");
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const search = searchTerm.toLowerCase();
      return (
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.phone.includes(search)
      );
    });
  }, [contacts, searchTerm]);

  return (
    <div className="page">
      <div className="app">
        <div className="hero">
          <p className="tag">MERN Stack Project</p>
          <h1>Contact Manager</h1>
          <p className="subtitle">
            Organize, search, manage, and update contacts with a clean and modern
            interface.
          </p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <span>Total Contacts</span>
            <h2>{contacts.length}</h2>
          </div>
          <div className="stat-card">
            <span>Mode</span>
            <h2>{editId ? "Edit Mode" : "Add Mode"}</h2>
          </div>
        </div>

        {message.text && (
          <div
            className={`message-box ${
              message.type === "success" ? "success-msg" : "error-msg"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <ContactForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editId={editId}
        />

        <ContactList
          contacts={filteredContacts}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          loading={loading}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}

export default App;