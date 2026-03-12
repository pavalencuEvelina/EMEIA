import { apiFetch } from "./apiUtils";
import { Child } from "../types/ChildInterface";
import { Quest } from "../types/QuestInterface";

const API_BASE = "https://emeia.infinityfree.me/my-api";

export const adminService = {
  getChildren: async (parentId: string): Promise<Child[]> => {
    const { response, data } = await apiFetch(`${API_BASE}/get_children.php?parentId=${parentId}`);
    if (!response.ok) throw new Error(data.message || "Could not fetch family data.");
    return data;
  },

  getParent: async (parentId: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/get_parent.php?parentId=${parentId}`);
    if (!response.ok) throw new Error(data.message || "Could not fetch profile.");
    return data; // { id, username, email, phoneNumber, avatarColor }
  },

  addChild: async (parentId: string, name: string, pin: string, avatarColor: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/add_child.php`, {
      method: "POST",
      body: new URLSearchParams({ parentId, name, pin, avatarColor }),
    });
    if (!response.ok) throw new Error(data.message || "Failed to add child.");
    return data;
  },

  deleteChild: async (childId: string, parentId: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/delete_child.php`, {
      method: "POST",
      body: new URLSearchParams({ childId, parentId }),
    });
    if (!response.ok) throw new Error(data.message || "Could not delete child.");
    return data;
  },

  deleteAccount: async (parentId: string, password: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/delete_account.php`, {
      method: "POST",
      body: new URLSearchParams({ parentId, password }),
    });
    if (!response.ok) throw new Error(data.message || "Could not delete account.");
    return data;
  },

  editQuest: async (questId: string, title: string, description: string, reward: number) => {
    const { response, data } = await apiFetch(`${API_BASE}/edit_quest.php`, {
      method: "POST",
      body: new URLSearchParams({ questId, title, description, reward: String(reward) }),
    });
    if (!response.ok) throw new Error(data.message || "Could not edit quest.");
    return data;
  },

  getCoinHistory: async (childId: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/get_coin_history.php?childId=${childId}`);
    if (!response.ok) throw new Error(data.message || "Could not fetch coin history.");
    return data;
  },

  createQuest: async (childId: string, questData: Partial<Quest>) => {
    const { response, data } = await apiFetch(`${API_BASE}/create_quest.php`, {
      method: "POST",
      body: new URLSearchParams({
        childId,
        title: questData.title ?? "",
        description: questData.description ?? "",
        reward: String(questData.reward ?? 0),
      }),
    });
    if (!response.ok) throw new Error(data.message || "Failed to assign quest.");
    return data;
  },

  createGlobalQuest: async (parentId: string, title: string, description: string, reward: number) => {
    const { response, data } = await apiFetch(`${API_BASE}/create_global_quest.php`, {
      method: "POST",
      body: new URLSearchParams({ parentId, title, description, reward: String(reward) }),
    });
    if (!response.ok) throw new Error(data.message || "Failed to create global quest.");
    return data;
  },

  getPendingQuests: async (parentId: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/get_pending_quests.php?parentId=${parentId}`);
    if (!response.ok) throw new Error(data.message || "Could not fetch pending quests.");
    return data;
  },

  verifyQuest: async (childId: string, questId: string, approve: boolean) => {
    const { response, data } = await apiFetch(`${API_BASE}/verify_quest.php`, {
      method: "POST",
      body: new URLSearchParams({ childId, questId, approve: String(approve) }),
    });
    if (!response.ok) throw new Error(data.message || "Action failed.");
    return data;
  },

  spendCoins: async (childId: string, amount: number, reason: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/spend_coins.php`, {
      method: "POST",
      body: new URLSearchParams({ childId, amount: String(amount), reason }),
    });
    if (!response.ok) throw new Error(data.message || "Could not spend coins.");
    return data;
  },

  changeProfile: async (parentId: string, username: string, email: string, phoneNumber: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/change_profile.php`, {
      method: "POST",
      body: new URLSearchParams({ profileId: parentId, type: "PARENT", username, email, phoneNumber }),
    });
    if (!response.ok) throw new Error(data.message || "Could not update profile.");
    return data;
  },

  changePassword: async (parentId: string, currentPassword: string, newPassword: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/change_password.php`, {
      method: "POST",
      body: new URLSearchParams({ parentId, currentPassword, newPassword }),
    });
    if (!response.ok) throw new Error(data.message || "Could not change password.");
    return data;
  },

  changePin: async (profileId: string, type: "PARENT" | "CHILD", currentPin: string, newPin: string) => {
    const { response, data } = await apiFetch(`${API_BASE}/change_pin.php`, {
      method: "POST",
      body: new URLSearchParams({ profileId, type, currentPin, newPin }),
    });
    if (!response.ok) throw new Error(data.message || "Could not change PIN.");
    return data;
  },
};
