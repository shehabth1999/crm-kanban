import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { ToastContainer, toast } from "react-toastify";
import StageColumn from "../../components/LeadColumn";
import LeadModal from "../../components/LeadModal";
import { socket, addMessageListener } from "../../websocket/socket";
import { fakeData, initialStages } from "../../data";
import "react-toastify/dist/ReactToastify.css";
import { stagesApi } from "../../api/stages";
import WebsocketDataHandler from "./handler";

const KanbanBoard = () => {
  const [stages, setStages] = useState(initialStages);
  const [leads, setLeads] = useState(fakeData.data);
  const [modalData, setModalData] = useState({
    isOpen: false,
    actionType: "",
    lead: null,
  });

  const handleOpenModal = (actionType, lead = null) => {
    setModalData({ isOpen: true, actionType, lead });
  };

  const handleCloseModal = () => {
    setModalData({ isOpen: false, actionType: "", lead: null });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceStageId = Number(source.droppableId);
    const destStageId = Number(destination.droppableId);

    if (sourceStageId === destStageId) return;

    const updatedLeads = { ...leads };
    const [movedLead] = updatedLeads[sourceStageId].splice(source.index, 1);
    movedLead.stage = stages.find((stage) => stage.id === destStageId);
    updatedLeads[destStageId].splice(destination.index, 0, movedLead);
    setLeads(updatedLeads);

    socket.send(
      JSON.stringify({
        action: "change_stage",
        data: { lead_id: movedLead.id, stage_id: destStageId },
      })
    );
  };

  useEffect(() => {
    stagesApi()
      .then((response) => setStages(response.data))
      .catch((error) => console.error(error));
  
    const handleSocketMessage = (event) => {
      setLeads((prevLeads) => {
        const { data, message } = WebsocketDataHandler.processIncomingMessage(
          event,
          prevLeads
        );
  
        if (data) {
          console.log(data);
          toast.info(message, { autoClose: 2000, position: "bottom-right" });
          return data;
        }
        return prevLeads;
      });
    };
  
    addMessageListener(handleSocketMessage);
  
    return () => {
      socket.removeEventListener("message", handleSocketMessage);
    };
  }, []);

  return (
    <div>
      <ToastContainer />
      <LeadModal modalData={modalData} handleClose={handleCloseModal} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {stages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              leads={leads[stage.id]}
              handleOpenModal={handleOpenModal}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
