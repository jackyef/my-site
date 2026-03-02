import { useState } from 'react';

import { Flip } from '@/lib/flip/react';

type Task = {
  id: string;
  title: string;
};

interface TaskItemProps extends Task {
  onClick: () => void;
  variant: 'to-do' | 'done';
}

const VARIANT_CLASS = {
  'to-do': 'bg-(--color-accent-xl) text-(--color-ink)',
  done: 'bg-(--color-success-bg) text-(--color-ink)',
} as const;

const TaskItem = ({ id, title, onClick, variant }: TaskItemProps) => {
  return (
    <Flip id={id}>
      <button
        className={`py-2 px-4 rounded-lg text-left ${VARIANT_CLASS[variant]}`}
        onClick={onClick}
        type="button"
      >
        {title}
      </button>
    </Flip>
  );
};

interface TaskColumnProps {
  title: string;
  count: number;
  children?: React.ReactNode;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, count, children }) => {
  return (
    <div className="flex flex-col flex-1 space-y-2">
      <div className="font-semibold">
        {title} ({count})
      </div>
      {children}
    </div>
  );
};

const mockTasks: Task[] = [
  { id: 'task-1', title: 'Follow up with client' },
  { id: 'task-2', title: 'Exercise' },
  { id: 'task-3', title: 'Ship feature B' },
  { id: 'task-4', title: 'Try out coffee at the new place' },
  { id: 'task-5', title: 'Write a blog post about FLIP' },
];

export const KanbanBoard = () => {
  const [todos, setTodos] = useState<Task[]>(mockTasks);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const handleShuffle = () => {
    const newTodos: Task[] = [];
    const newDoneTasks: Task[] = [];

    mockTasks.forEach((task) => {
      if (Math.random() > 0.5) {
        newTodos.push(task);
      } else {
        newDoneTasks.push(task);
      }
    });

    setTodos(newTodos);
    setDoneTasks(newDoneTasks);
  };

  return (
    <div className="border-2 border-(--color-border) p-4 rounded-md text-(--color-ink-2)">
      <div className="flex space-x-2 min-h-[300px] mb-4">
        <TaskColumn title="To-do" count={todos.length}>
          {todos.map((task) => (
            <TaskItem
              key={task.id}
              {...task}
              variant="to-do"
              onClick={() => {
                setTodos(todos.filter((t) => t.id !== task.id));
                setDoneTasks([...doneTasks, task]);
              }}
            />
          ))}
        </TaskColumn>
        <TaskColumn title="Done" count={doneTasks.length}>
          {doneTasks.map((task) => (
            <TaskItem
              key={task.id}
              variant="done"
              {...task}
              onClick={() => {
                setDoneTasks(doneTasks.filter((t) => t.id !== task.id));
                setTodos([...todos, task]);
              }}
            />
          ))}
        </TaskColumn>
      </div>

      <button
        className="py-2 px-4 text-base rounded-lg bg-(--color-bg-hover) text-(--color-ink)"
        onClick={handleShuffle}
      >
        Shuffle tasks!
      </button>
    </div>
  );
};
