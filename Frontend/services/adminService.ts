const API_BASE_URL = "http://192.168.100.14:8080/api/admin";

import { Child } from "../types/ChildInterface";
import { Quest } from "../types/QuestInterface";

export const adminService = {
  // GET all children
  getChildren: async (): Promise<Child[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_BASE_URL}/children`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Could not fetch fleet data.");
      return await response.json();
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout (10s)");
      throw error;
    }
  },

  createQuest: async (childId: string, questData: Partial<Quest>) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/children/${childId}/quests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...questData,
            status: "PENDING", // New quests start as pending
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to assign quest.");
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  verifyQuest: async (childId: string, questId: string, approve: boolean) => {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        questId,
        status: approve ? "VERIFIED" : "PENDING", // Rejecting sends it back to 'PENDING'
      }),
    });
    return response.ok;
  },
};
