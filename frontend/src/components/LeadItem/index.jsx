import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserPen } from "@fortawesome/free-solid-svg-icons";
import "./Styles.css";

const LeadItem = ({ lead, index, handleOpenModal }) => (
  <Draggable draggableId={lead.id.toString()} index={index}>
    {(provided) => (
      <div
        className="lead-item"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {lead.name}
        <div className="flex-space-between">
          <FontAwesomeIcon
            className="icon"
            onClick={() => handleOpenModal("update_lead", lead)}
            icon={faUserPen}
          />
          <FontAwesomeIcon
            className="icon"
            onClick={() => handleOpenModal("delete_lead", lead)}
            icon={faTrash}
          />
        </div>
      </div>
    )}
  </Draggable>
);

export default LeadItem;
