import { apiClient } from "@/lib/apiClient";

const toPlacementModel = (placement) => ({
  ...placement,
  startDate: placement.start_date,
  endDate: placement.end_date,
});

const toLogModel = (log) => ({
  ...log,
  weekNumber: log.week_number,  
});

const toEvaluationModel = (evaluation) => ({
  ...evaluation,
  type: evaluation.evaluation_type,
});

export const internshipService = {
  async listPlacements() {
    const placements = await apiClient.get("/placements/");
    return Array.isArray(placements)
      ? placements.map(toPlacementModel)
      : [];
  },

  async listLogs() {
    const logs = await apiClient.get("/logs/");
    return Array.isArray(logs) ? logs.map(toLogModel) : [];
  },

  async createLog(payload) {
    const log = await apiClient.post("/logs/", payload);
    return toLogModel(log);
  },

  async updateLog(id, payload) {
    const log = await apiClient.put(`/logs/${id}/`, payload);
    return toLogModel(log);
  },

  async submitLog(id) {
    const log = await apiClient.post(`/logs/${id}/submit/`, {});
    return toLogModel(log);
  },

  async listEvaluations() {
    const evaluations = await apiClient.get("/evaluations/");
    return Array.isArray(evaluations)
      ? evaluations.map(toEvaluationModel)
      : [];
  },
};
