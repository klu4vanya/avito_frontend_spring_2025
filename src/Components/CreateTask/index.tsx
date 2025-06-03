import React, { useEffect, useState } from "react";
import { API_HOST } from "../../api";
import {
  ButtonsContainer,
  CloseModalContainer,
  CreateTaskContainer,
  CrossButton,
  FieldsContainer,
  StyledForm,
  StyledTextField,
  Title,
} from "./styles";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { CreateTaskButton } from "../Header/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CreateTaskProps {
  onClose: () => void;
  taskId?: number;
  onTasks?: boolean;
  dissable?: boolean;
  onTaskUpdate?: () => void;
}

interface Board {
  id: number;
  name: string;
  description: string;
  taskCount: number;
}
interface Assignee {
  id?: number;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
}

interface TaskId {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee: Assignee;
  boardName: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  description: string;
  avatarUrl: string;
  teamId: number;
  teamName: string;
  taskCount: number;
}

interface CreateTask {
  title: string;
  description: string;
  boardId: number;
  priority: string;
  status: string;
  assigneeId: number;
}

export default function CreateTask({ onClose, taskId, onTasks, dissable, onTaskUpdate }: CreateTaskProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [boardId, setBoardId] = useState<number>();
  const [boards, setBoards] = useState<Board[]>([]);
  const [priority, setPriority] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignee, setAssignee] = useState<User[]>([]);
  const [task, setTask] = useState<TaskId>();
  const [assigneeName, setAssigneeName] = useState<string>("");
  const [boardName, setBoardName] = useState<string>("");
  const navigate = useNavigate();

  const taskData = {
    assigneeId: assigneeId,
    description: description,
    priority: priority,
    title: title,
    status: status,
  };

  const handleTitle = (event: any) => {
    setTitle(event.target.value);
  };
  const handleDescription = (event: any) => {
    setDescription(event.target.value);
  };

  const handlePriority = (event: any) => {
    setPriority(event.target.value);
  };

  const handleStatus = (event: any) => {
    setStatus(event.target.value);
  };

  const handleBoardClick = async (taskId?: number) => {
    if (!taskId) return;
    
    try {
      const response = await axios.get(`${API_HOST}/tasks/${taskId}`);
      const boardName = response.data.data.boardName;
      const boardsResponse = await axios.get(`${API_HOST}/boards`);
      const board = boardsResponse.data.data.find((b: Board) => b.name === boardName);
      
      if (board) {
        navigate(`/board/${board.id}`);
      }
    } catch (error) {
      console.error("Ошибка при переходе к доске:", error);
    }
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(`${API_HOST}/boards`);
        setBoards(response.data.data);
      } catch (err) {
        setError(
          axios.isAxiosError(err) ? err.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(
            `${API_HOST}/tasks/${taskId}`
          );
          const taskData = response.data.data;
          setTask(taskData);
          setTitle(taskData.title);
          setDescription(taskData.description);
          setPriority(taskData.priority);
          setStatus(taskData.status);
          setAssigneeId(taskData.assignee?.id || 0);
          setAssigneeName(taskData.assignee?.fullName || "");
          setBoardName(taskData.boardName || "");
          const board = boards.find((b) => b.name === response.data.boardName);
          if (board) {
            setBoardId(board.id);
          }
        } catch (err) {
          setError(
            axios.isAxiosError(err) ? err.message : "Unknown error occurred"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [taskId, boards]);

  useEffect(() => {
    const fetchAssignee = async () => {
      try {
        const response = await axios.get(`${API_HOST}/users`);
        setAssignee(response.data.data);
      } catch (err) {
        setError(
          axios.isAxiosError(err) ? err.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignee();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = taskId
        ? `${API_HOST}/tasks/update/${taskId}`
        : `${API_HOST}/tasks/create`;

      const method = taskId ? "put" : "post";

      const response = await axios[method](
        url,
        {
          assigneeId: assigneeId,
          boardId: boardId,
          description: description,
          priority: priority,
          status: status,
          title: title,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Успешно:", response.data);
      onClose();
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };
  return (
    <CreateTaskContainer>
      <CloseModalContainer>
        <CrossButton onClick={onClose} />
      </CloseModalContainer>
      {taskId ? (
        <Title>Редактирование задачи</Title>
      ) : (
        <Title>Создание задачи</Title>
      )}
      <FieldsContainer>
        <StyledTextField
          required
          id="outlined-required"
          label="Название"
          onChange={handleTitle}
          value={title}
          sx={{
            "& .MuiFormLabel-root": {
              color: "#4500ff !important",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#4500ff !important",
            },
            "& .MuiInputLabel-root.MuiInputLabel-shrink": {
              color: "#4500ff !important",
            },
            "& .MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
              color: "#4500ff !important",
            },
          }}
        />
        <StyledTextField
          required
          id="outlined-required"
          label="Описание"
          onChange={handleDescription}
          value={description}
          multiline
          sx={{
            "& .MuiFormLabel-root": {
              color: "#4500ff !important",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#4500ff !important",
            },
            "& .MuiInputLabel-root.MuiInputLabel-shrink": {
              color: "#4500ff !important",
            },
            "& .MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
              color: "#4500ff !important",
            },
          }}
        />
        <StyledForm fullWidth>
          <InputLabel id="board-select-label" shrink={true}>Проект</InputLabel>
          <Select
            labelId="board-select-label"
            id="board-select"
            value={boardId || ""}
            label="project"
            disabled={!!dissable}
            onChange={(event) => {
              const selectedId = event.target.value as number;
              setBoardId(selectedId);
            }}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return boardName || "";
              }
              const selectedBoard = boards.find((b) => b.id === selected);
              return selectedBoard?.name || "";
            }}
          >
            <MenuItem value="" disabled>
              Выберите проект
            </MenuItem>
            {boards.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                {board.name}
              </MenuItem>
            ))}
          </Select>
        </StyledForm>
        <StyledForm fullWidth>
          <InputLabel id="demo-simple-select-label">Приоритет</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={priority}
            label="priority"
            onChange={handlePriority}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </StyledForm>
        <StyledForm fullWidth>
          <InputLabel id="demo-simple-select-label">Статус</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={status}
            label="status"
            onChange={handleStatus}
          >
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="InProgress">In progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </StyledForm>
        <StyledForm fullWidth>
          <InputLabel id="demo-simple-select-label">Исполнитель</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={assigneeId || assigneeName}
            label="assignee"
            onChange={(event) => {
              const selectedId = event.target.value as number;
              setAssigneeId(selectedId);
            }}
          >
            {assignee.map((assignee) => (
              <MenuItem key={assignee.id} value={assignee.id}>
                {assignee.fullName}
              </MenuItem>
            ))}
          </Select>
        </StyledForm>
      </FieldsContainer>
      <ButtonsContainer>
        {onTasks && (
          <CreateTaskButton style={{ marginRight: "0" }} onClick={() => handleBoardClick(taskId)}>
          Перейти на доску
        </CreateTaskButton>
        )}
        <CreateTaskButton style={{ marginRight: "0" }} onClick={handleSubmit}>
          {taskId ? "Сохранить" : "Создать"}
        </CreateTaskButton>
      </ButtonsContainer>
    </CreateTaskContainer>
  );
}
