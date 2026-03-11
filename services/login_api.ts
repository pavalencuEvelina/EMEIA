const API_URL = "https://emeia.infinityfree.me/my-api/get_data.php";
import { apiFetch } from "./apiUtils";

// 'login' can be either an email address or a username
export const loginUser = async (login: string, pass: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const { response, data: _apiData } = await apiFetch(API_URL, {
      method: "POST",
      body: new URLSearchParams({ login, password: pass }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = _apiData;

    if (!response.ok) {
      throw new Error(result.message || "Invalid credentials");
    }

    return result; // { success: true, user: { id, username } }
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Connection timed out. Check your XAMPP/Firewall.");
    }
    if (error.message === "Network request failed") {
      throw new Error("Cannot reach server. Are you on the same Wi-Fi?");
    }
    throw error;
  }
};
