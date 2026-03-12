import { apiFetch } from "./apiUtils";

const API_BASE = "https://emeia.infinityfree.me/my-api";

export const childService = {
  getChildDetails: async (childId: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/child_dashboard.php?childId=${childId}`);
    if (!response.ok) throw new Error(data.message || "Could not load dashboard.");
    return data; // { balance, activeQuests, history }
  },

  toggleQuestStatus: async (questId: string, isDone: boolean) => {
    const { response, data } = await apiFetch(`${API_BASE}/toggle_quest.php`, {
      method: "POST",
      body: new URLSearchParams({ questId, status: isDone ? "SUBMITTED" : "PENDING" }),
    });
    if (!response.ok) throw new Error(data.message || "Could not update quest.");
    return data;
  },

  deleteQuest: async (questId: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/delete_quest.php`, {
      method: "POST",
      body: new URLSearchParams({ questId }),
    });
    if (!response.ok) throw new Error(data.message || "Could not delete quest.");
    return data;
  },

  changePin: async (childId: string, currentPin: string, newPin: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/change_pin.php`, {
      method: "POST",
      body: new URLSearchParams({ profileId: childId, type: "CHILD", currentPin, newPin }),
    });
    if (!response.ok) throw new Error(data.message || "Could not change PIN.");
    return data;
  },

  changeProfile: async (childId: string, name: string, avatarColor: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/change_profile.php`, {
      method: "POST",
      body: new URLSearchParams({ profileId: childId, type: "CHILD", name, avatarColor }),
    });
    if (!response.ok) throw new Error(data.message || "Could not update profile.");
    return data;
  },

  getCoinHistory: async (childId: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/get_coin_history.php?childId=${childId}`);
    if (!response.ok) throw new Error(data.message || "Could not fetch coin history.");
    return data;
  },
};
