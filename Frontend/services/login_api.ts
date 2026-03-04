const API_URL = "http://192.168.100.14:8080/api/auth";

export const loginUser = async (email: string, pass: string) => {
  const controller = new AbortController();

  // Set the timer for 10,000 milliseconds (10 seconds)
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
      signal: controller.signal, // Attach the abort signal here
    });

    clearTimeout(timeoutId); // Request finished in time, stop the timer!

    if (!response.ok) throw new Error("Invalid Credentials");
    return await response.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Connection timed out. Server is too slow.");
    }
    throw error;
  }
};
