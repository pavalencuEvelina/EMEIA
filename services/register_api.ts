const API_URL = "https://emeia.infinityfree.me/my-api/register.php";
import { apiFetch } from "./apiUtils";

export const registerUser = async (
  username: string,
  email: string,
  pass: string,
  phoneNumber: string,
  pin: string,
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const { response, data: _apiData } = await apiFetch(API_URL, {
      method: "POST",
      body: new URLSearchParams({ username, email, password: pass, phoneNumber, pin }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = _apiData;

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    return result;
  } catch (error: any) {
    if (error.name === "AbortError") throw new Error("Connection timed out.");
    if (error.message === "Network request failed") {
      throw new Error("Cannot reach server. Are you on the same Wi-Fi?");
    }
    throw error;
  }
};
