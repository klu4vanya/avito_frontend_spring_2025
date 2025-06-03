import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import {
  BoardContainer,
  BoardName,
  BoardWrapper,
  Column,
  ColumnTitle,
  Task,
  TaskPriority,
  TaskAssignee,
  TaskDescription,
} from "./styles";
import CreateTask from "../CreateTask";

interface Assignee {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

interface BoardTask {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Backlog" | "InProgress" | "Done";
  assignee: Assignee;
}

interface ApiResponse {
  data: BoardTask[];
}

const statusOrder = ["Backlog", "InProgress", "Done"] as const;

const statusTitles = {
  Backlog: "TO DO",
  InProgress: "IN PROGRESS",
  Done: "DONE",
};

const priorityColors = {
  Low: "#4CAF50",
  Medium: "#FFC107",
  High: "#F44336",
};

export default function Board() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const { state } = useLocation();
  const boardName = state?.boardName || "Название проекта";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<number>();

  const closeModal = () => setOpenModal(false);

  const handleClick = (taskId: number) => {
    setOpenModal(true);
    setTaskId(taskId);
  };

  const fetchBoardData = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        `http://localhost:8080/api/v1/boards/${id}`
      );
      setTasks(response.data.data);
    } catch (err) {
      setError(
        axios.isAxiosError(err) ? err.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };
  const refreshTasks = async () => {
    await fetchBoardData();
  };
  useEffect(() => {
    fetchBoardData();
  }, [id]);


  const groupTasksByStatus = (tasks: BoardTask[]) => {
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<string, BoardTask[]>);

    // Ensure all statuses are present in the result
    statusOrder.forEach((status) => {
      if (!grouped[status]) {
        grouped[status] = [];
      }
    });

    return grouped;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const groupedTasks = groupTasksByStatus(tasks);

  return (
    <BoardWrapper>
      <BoardName>{boardName}</BoardName>
      <BoardContainer>
        {statusOrder.map((status) => (
          <Column key={status}>
            <ColumnTitle>{statusTitles[status]}</ColumnTitle>
            {groupedTasks[status]?.map((task) => (
              <Task key={task.id} onClick={() => handleClick(task.id)}>
                <TaskPriority color={priorityColors[task.priority]}>
                  {task.priority}
                </TaskPriority>
                <h4>{task.title}</h4>
                <TaskDescription>{task.description}</TaskDescription>
                <TaskAssignee>
                  <img
                    src={task.assignee.avatarUrl}
                    alt={task.assignee.fullName}
                    width={24}
                    height={24}
                  />
                  <span>{task.assignee.fullName}</span>
                </TaskAssignee>
              </Task>
            ))}
          </Column>
        ))}
      </BoardContainer>
      {openModal && (
        <CreateTask onClose={closeModal} taskId={taskId} dissable={true} onTaskUpdate={refreshTasks}/>
      )}
    </BoardWrapper>
  );
}
