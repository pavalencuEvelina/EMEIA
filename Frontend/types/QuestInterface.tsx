export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: "PENDING" | "COMPLETED" | "VERIFIED"; // Verified means Admin confirmed it
}
