import { apiFetch } from "./apiUtils";

const API_URL = "https://emeia.infinityfree.me/my-api/get_data.php";

export const loginUser = async (login: string, pass: string) => {
  const { response, data } = await apiFetch(API_URL, {
    method: "POST",
    body: new URLSearchParams({ login, password: pass }),
  });

  if (!response.ok) throw new Error(data.message || "Invalid credentials");
  return data; // { success: true, user: { id, username } }
};
