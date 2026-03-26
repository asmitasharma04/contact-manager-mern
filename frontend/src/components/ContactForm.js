import React from "react";

function ContactForm({ formData, handleChange, handleSubmit, editId }) {
  return (
    <div className="form-wrapper">
      <div className="section-header">
        <h2>{editId ? "Edit Contact" : "Add New Contact"}</h2>
        <p>
          {editId
            ? "Update the selected contact details below."
            : "Enter contact details and save them to your list."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter 10-digit phone number"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
          />
        </div>

        <button type="submit" className="primary-btn">
          {editId ? "Update Contact" : "Add Contact"}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;