const API_URL = "http://192.168.100.14:8080/api/auth";

export const registerUser = async (
  username: string,
  email: string,
  pass: string,
  phone: string,
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password: pass,
        phoneNumber: phone,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === "AbortError") throw new Error("Server timeout");
    throw error;
  }
};
