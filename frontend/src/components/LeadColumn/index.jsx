import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import LeadItem from "../LeadItem";
import "./Styles.css";

const StageColumn = ({ stage, leads, handleOpenModal }) => {
  return (
    <Droppable droppableId={stage.id.toString()}>
      {(provided) => (
        <div
          className="stage"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2>
            {stage.name}
            {stage.name === "New" && (
              <FontAwesomeIcon
                className="icon"
                onClick={() => handleOpenModal("create_lead")}
                icon={faUserPlus}
              />
            )}
          </h2>
          {leads.map((lead, index) => (
            <LeadItem
              index={index}
              key={lead.id}
              lead={lead}
              handleOpenModal={handleOpenModal}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default StageColumn;
