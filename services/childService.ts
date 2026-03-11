const API_BASE = "https://emeia.infinityfree.me/my-api";
import { apiFetch } from "./apiUtils";

const mkTimeout = (ms: number) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
};

export const childService = {
  getChildDetails: async (childId: string) => {
    const { signal, clear } = mkTimeout(8000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/child_dashboard.php?childId=${childId}`, { signal });
      clear();
      if (!response.ok) throw new Error("Could not load dashboard.");
      return _apiData;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Connection timed out. Check if the server is running.");
      }
      throw error;
    }
  },

  toggleQuestStatus: async (questId: string, isDone: boolean) => {
    const { signal, clear } = mkTimeout(8000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/toggle_quest.php`, {
        method: "POST",
        body: new URLSearchParams({ questId, status: isDone ? "SUBMITTED" : "PENDING" }),
        signal,
      });
      clear();
      return response.ok;
    } catch { return false; }
  },

  deleteQuest: async (questId: string) => {
    const { signal, clear } = mkTimeout(8000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/delete_quest.php`, {
        method: "POST",
        body: new URLSearchParams({ questId }),
        signal,
      });
      clear();
      return response.ok;
    } catch { return false; }
  },

  changePin: async (childId: string, currentPin: string, newPin: string) => {
    const { signal, clear } = mkTimeout(8000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/change_pin.php`, {
        method: "POST",
        body: new URLSearchParams({ profileId: childId, type: "CHILD", currentPin, newPin }),
        signal,
      });
      clear();
      const result = _apiData;
      if (!response.ok) throw new Error(result.message || "Could not change PIN.");
      return result;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },

  // Update child's name and avatar color
  changeProfile: async (childId: string, name: string, avatarColor: string) => {
    const { signal, clear } = mkTimeout(8000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/change_profile.php`, {
        method: "POST",
        body: new URLSearchParams({ profileId: childId, type: "CHILD", name, avatarColor }),
        signal,
      });
      clear();
      const result = _apiData;
      if (!response.ok) throw new Error(result.message || "Could not update profile.");
      return result;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },

  getCoinHistory: async (childId: string) => {
    const { signal, clear } = mkTimeout(8000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/get_coin_history.php?childId=${childId}`, { signal });
      clear();
      if (!response.ok) throw new Error("Could not fetch coin history.");
      return _apiData;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },
};
