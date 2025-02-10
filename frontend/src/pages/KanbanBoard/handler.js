export default class WebsocketDataHandler {
  // Handles WebSocket messages and updates the "leads" state.
  // The "processAction" method checks the received action, calls the corresponding
  // method (if exists), and returns the modified leads state and a message.

  // Example actions:
  // create_lead()
  // update_lead()
  // delete_lead()

  constructor(event, leads) {
    try {
      const messageData = JSON.parse(event.data);
      this.action = messageData.action;
      this.data = messageData.data;
      this.leads = leads; // Passing current leads state
    } catch (error) {
      console.error("Invalid WebSocket message:", event.data, error);
      this.action = null;
      this.data = null;
    }
  }

  processAction() {
    if (typeof this[this.action] === "function") {
      return this[this.action](); // Return modified data and message
    } else {
      console.error(`Unknown action: ${this.action}`);
      return { data: this.leads, message: `Unknown action: ${this.action}` };
    }
  }

  static processIncomingMessage(event, leads) {
    const handler = new WebsocketDataHandler(event, leads);
    return handler.processAction();
  }

  initial_data() {
    return { data: this.data, message: null };
  }

  create_lead() {
    const updatedLeads = {
      ...this.leads,
      [this.data.stage.id]: [
        ...(this.leads[this.data.stage.id] || []),
        this.data,
      ],
    };
    return { data: updatedLeads, message: `Lead "${this.data.name}" added!` };
  }

  update_lead() {
    const updatedLeads = {
      ...this.leads,
      [this.data.stage.id]: this.leads[this.data.stage.id].map((lead) =>
        lead.id === this.data.id ? this.data : lead
      ),
    };
    return { data: updatedLeads, message: `Lead "${this.data.name}" updated!` };
  }

  delete_lead() {
    const updatedLeads = {
      ...this.leads,
      [this.data.stage.id]: this.leads[this.data.stage.id].filter(
        (lead) => lead.id !== this.data.id
      ),
    };
    return { data: updatedLeads, message: `Lead "${this.data.name}" deleted!` };
  }

  change_stage() {
    const cleanedLeads = Object.keys(this.leads).reduce((acc, stageId) => {
      acc[stageId] = this.leads[stageId].filter(
        (lead) => lead.id !== this.data.id
      );
      return acc;
    }, {});

    const updatedLeads = {
      ...cleanedLeads,
      [this.data.stage.id]: [
        ...(cleanedLeads[this.data.stage.id] || []),
        this.data,
      ],
    };

    return {
      data: updatedLeads,
      message: `Lead "${this.data.name}" moved to "${this.data.stage.name}"`,
    };
  }
}
