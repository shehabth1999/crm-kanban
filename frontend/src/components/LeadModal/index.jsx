import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "../../websocket/socket";
import "./Styles.css";

Modal.setAppElement("#root");

const LeadModal = ({ modalData, handleClose }) => {
  const { isOpen, actionType, lead } = modalData;
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    if (lead) {
      setFormData({ name: lead.name || "", email: lead.email || "" });
    } else {
      setFormData({ name: "", email: "" });
    }
  }, [lead]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.send(
      JSON.stringify({
        action: actionType,
        data: { ...formData, lead_id: lead?.id },
      })
    );
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {actionType === "delete_lead" ? "Delete The Lead?" : "Lead Info"}
            </h3>
            <form onSubmit={handleSubmit}>
              {actionType !== "delete_lead" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Lead Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Lead Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  {actionType !== "delete_lead" ? "Save" : "Delete"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadModal;
