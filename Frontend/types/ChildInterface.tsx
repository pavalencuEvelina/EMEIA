import { Quest } from "./QuestInterface";

export interface Child {
  id: string;
  name: string;
  coins: number;
  avatarColor: string;
  activeQuests: Quest[]; // Quests they are working on
  completedHistory: Quest[]; // Quests you already approved
}
