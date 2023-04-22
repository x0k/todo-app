import { type ToDoHandlers } from './domain';

export function makeToDoHandlers(): ToDoHandlers {
  return {
    loadTasksLists
  }
}