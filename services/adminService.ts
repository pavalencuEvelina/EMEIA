const API_BASE = "https://emeia.infinityfree.me/my-api";
import { apiFetch } from "./apiUtils";

import { Child } from "../types/ChildInterface";
import { Quest } from "../types/QuestInterface";

const mkTimeout = (ms: number) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
};

export const adminService = {
  getChildren: async (parentId: string): Promise<Child[]> => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/get_children.php?parentId=${parentId}`, { signal });
      clear();
      if (!response.ok) throw new Error("Could not fetch family data.");
      return _apiData;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout (10s)");
      throw error;
    }
  },

  addChild: async (parentId: string, name: string, pin: string, avatarColor: string) => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/add_child.php`, {
        method: "POST",
        body: new URLSearchParams({ parentId, name, pin, avatarColor }),
        signal,
      });
      clear();
      const result = _apiData;
      if (!response.ok) throw new Error(result.message || "Failed to add child.");
      return result;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },

  editQuest: async (questId: string, title: string, description: string, reward: number) => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/edit_quest.php`, {
        method: "POST",
        body: new URLSearchParams({ questId, title, description, reward }),
        signal,
      });
      clear();
      const result = _apiData;
      if (!response.ok) throw new Error(result.message || "Could not edit quest.");
      return result;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },

  getCoinHistory: async (childId: string) => {
    const { signal, clear } = mkTimeout(10000);
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

  // Quest for one specific child
  createQuest: async (childId: string, questData: Partial<Quest>) => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/create_quest.php`, {
        method: "POST",
        body: new URLSearchParams({ childId, ...questData, status: "PENDING" }),
        signal,
      });
      clear();
      if (!response.ok) throw new Error("Failed to assign quest.");
      return _apiData;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },

  // Quest for ALL children of this parent — first to complete it wins the coins
  createGlobalQuest: async (
    parentId: string,
    title: string,
    description: string,
    reward: number,
  ) => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/create_global_quest.php`, {
        method: "POST",
        body: new URLSearchParams({ parentId, title, description, reward }),
        signal,
      });
      clear();
      const result = _apiData;
      if (!response.ok) throw new Error(result.message || "Failed to create global quest.");
      return result;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },

  // Pending quests — filtered to only this parent's children
  getPendingQuests: async (parentId: string) => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(
        `${API_BASE}/get_pending_quests.php?parentId=${parentId}`,
        { signal },
      );
      clear();
      if (!response.ok) throw new Error("Could not fetch pending quests.");
      return _apiData;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },

  verifyQuest: async (childId: string, questId: string, approve: boolean) => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/verify_quest.php`, {
        method: "POST",
        body: new URLSearchParams({ childId, questId, approve }),
        signal,
      });
      clear();
      const result = _apiData;
      if (!response.ok) throw new Error(result.message || "Action failed.");
      return result;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },

  spendCoins: async (childId: string, amount: number, reason: string) => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/spend_coins.php`, {
        method: "POST",
        body: new URLSearchParams({ childId, amount, reason }),
        signal,
      });
      clear();
      const result = _apiData;
      if (!response.ok) throw new Error(result.message || "Could not spend coins.");
      return result;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },

  changeProfile: async (parentId: string, username: string, email: string, phoneNumber: string) => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/change_profile.php`, {
        method: "POST",
        body: new URLSearchParams({ profileId: parentId, type: "PARENT", username, email, phoneNumber }),
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

  changePassword: async (parentId: string, currentPassword: string, newPassword: string) => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/change_password.php`, {
        method: "POST",
        body: new URLSearchParams({ parentId, currentPassword, newPassword }),
        signal,
      });
      clear();
      const result = _apiData;
      if (!response.ok) throw new Error(result.message || "Could not change password.");
      return result;
    } catch (error: any) {
      if (error.name === "AbortError") throw new Error("Server timeout");
      throw error;
    }
  },

  changePin: async (profileId: string, type: "PARENT" | "CHILD", currentPin: string, newPin: string) => {
    const { signal, clear } = mkTimeout(10000);
    try {
      const { response, data: _apiData } = await apiFetch(`${API_BASE}/change_pin.php`, {
        method: "POST",
        body: new URLSearchParams({ profileId, type, currentPin, newPin }),
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
};
