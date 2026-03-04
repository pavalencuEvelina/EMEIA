const API_BASE_URL = "http://192.168.100.14:8080/api/child";

export const childService = {
  // Fetch specific child data including quests
  getChildDetails: async (childId: string) => {
    // 1. Initialize the controller
    const controller = new AbortController();

    // 2. Set the 5-second (5000ms) timer
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${API_BASE_URL}/${childId}/dashboard`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // 3. Attach the signal to the fetch request
        signal: controller.signal,
      });

      // 4. Clear the timer if the fetch succeeds before 5 seconds
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Could not load child dashboard.");

      return await response.json();
    } catch (error: any) {
      // 5. Specifically handle the timeout error
      if (error.name === "AbortError") {
        console.error("(From developer) Fetch timed out after 5 seconds");
        throw new Error(
          "Connection timed out. Check if the Spring Boot server is running.",
        );
      }

      console.error("(From developer) Error fetching child details:", error);
      throw error;
    }
  },

  toggleQuestStatus: async (questId: string, isDone: boolean) => {
    const response = await fetch(`${API_BASE_URL}/quests/${questId}/toggle`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: isDone ? "SUBMITTED" : "PENDING" }),
    });
    return response.ok;
  },

  // Admin only: Permanent delete
  deleteQuest: async (questId: string) => {
    const response = await fetch(`${API_BASE_URL}/quests/${questId}`, {
      method: "DELETE",
    });
    return response.ok;
  },
};
