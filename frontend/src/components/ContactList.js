import React from "react";
import ContactItem from "./ContactItem";

function ContactList({
  contacts,
  handleEdit,
  handleDelete,
  loading,
  searchTerm,
}) {
  return (
    <div className="list-wrapper">
      <div className="section-header">
        <h2>Saved Contacts</h2>
        <p>Your contact list is displayed below.</p>
      </div>

      <div className="contact-list">
        {loading ? (
          <div className="empty-state">
            <h3>Loading contacts...</h3>
          </div>
        ) : contacts.length === 0 ? (
          <div className="empty-state">
            <h3>{searchTerm ? "No matching contacts found" : "No contacts found"}</h3>
            <p>
              {searchTerm
                ? "Try a different search keyword."
                : "Add your first contact using the form above."}
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactItem
              key={contact._id}
              contact={contact}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ContactList;