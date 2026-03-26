import React from "react";

function ContactItem({ contact, handleEdit, handleDelete }) {
  return (
    <div className="contact-card">
      <div className="contact-top">
        <div className="avatar">
          {contact.name ? contact.name.charAt(0).toUpperCase() : "C"}
        </div>

        <div className="contact-info">
          <h3>{contact.name}</h3>
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
        </div>
      </div>

      <div className="btn-group">
        <button className="edit-btn" onClick={() => handleEdit(contact)}>
          Edit
        </button>
        <button className="delete-btn" onClick={() => handleDelete(contact._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default ContactItem;