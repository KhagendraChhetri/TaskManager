// Local storage utilities for task persistence

import { Task } from "@/types/task";

const STORAGE_KEY = "task-manager-tasks";

export const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const tasks = stored ? JSON.parse(stored) : [];

    // Add priority field to existing tasks for backward compatibility
    return tasks.map((task: any) => ({
      ...task,
      priority: task.priority || "medium", // Default to medium priority for existing tasks
    }));
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
