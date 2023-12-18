import React from 'react';
import { TaskList } from './Task/List/TaskList';
import './App.css';
import { TaskListProvider } from './utils/TaskListProvider';

export function App() {
  return (
    <TaskListProvider>
      <TaskList />
    </TaskListProvider>
  );
}
