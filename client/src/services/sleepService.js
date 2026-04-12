import api from "./api";

const sleepService = {
  // Get all logs for the current user
  getLogs: async () => {
    const res = await api.get("/logs/");
    return res.data;
  },

  // Get today's log
  getToday: async () => {
    const res = await api.get("/logs/today/");
    return res.data;
  },

  // Get a single log by id
  getLog: async (id) => {
    const res = await api.get(`/logs/${id}/`);
    return res.data;
  },

  // Create a new log
  createLog: async (data) => {
    const res = await api.post("/logs/", data);
    return res.data;
  },

  // Update an existing log
  updateLog: async (id, data) => {
    const res = await api.put(`/logs/${id}/`, data);
    return res.data;
  },

  // Delete a log
  deleteLog: async (id) => {
    await api.delete(`/logs/${id}/`);
  },

  // Trigger AI plan generation
  generatePlan: async (id) => {
    const res = await api.post(`/logs/${id}/generate-plan/`);
    return res.data;
  },
};

export default sleepService;