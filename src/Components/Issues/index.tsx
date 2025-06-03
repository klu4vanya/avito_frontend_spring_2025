import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_HOST } from '../../api'
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
  Chip,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  ButtonContainer,
  IssuesContainer,
  SearchAndFilterContainer,
  FiltersContainer,
  BoardInfoContainer,
} from "./styles";
import {
  GoToBoard,
  ProjectContainer,
  ProjectName,
  ProjectWrapper,
} from "../Boards/styles";
import { CreateTaskButton } from "../Header/styles";
import CreateTask from "../CreateTask";
import { StyledTextField } from "../CreateTask/styles";

export interface Assignee {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Backlog" | "InProgress" | "Done";
  assignee: Assignee;
  boardId: number;
  boardName: string;
}

export default function Issues() {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<number>()
  
  // Состояния для фильтров
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [boardFilter, setBoardFilter] = useState<number[]>([]);

  const fetchTasks = async (): Promise<Task[]> => {
    const response = await axios.get<{ data: Task[] }>(
      `${API_HOST}/tasks`
    );
    return response.data.data;
  };
  const refreshTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError("Ошибка при загрузке задач");
      console.error(err);
    }
  };


  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        setError("Ошибка при загрузке задач");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Получаем уникальные статусы и доски для фильтров
  const availableStatuses = useMemo(() => {
    return Array.from(new Set(tasks.map(task => task.status)));
  }, [tasks]);

  const availableBoards = useMemo(() => {
    return Array.from(new Set(tasks.map(task => ({
      id: task.boardId,
      name: task.boardName
    }))));
  }, [tasks]);

  // Функция фильтрации задач
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Фильтр по статусу
      if (statusFilter.length > 0 && !statusFilter.includes(task.status)) {
        return false;
      }
      
      // Фильтр по доске
      if (boardFilter.length > 0 && !boardFilter.includes(task.boardId)) {
        return false;
      }
      
      // Объединенный поиск по названию задачи и исполнителю
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(query);
        const assigneeMatch = task.assignee.fullName.toLowerCase().includes(query);
        
        if (!titleMatch && !assigneeMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, [tasks, statusFilter, boardFilter, searchQuery]);

  const handleStatusFilterChange = (event: any) => {
    const value = event.target.value;
    setStatusFilter(typeof value === 'string' ? value.split(',') : value);
  };

  const handleBoardFilterChange = (event: any) => {
    const value = event.target.value;
    setBoardFilter(typeof value === 'string' ? value.split(',').map(Number) : value);
  };

  const clearAllFilters = () => {
    setStatusFilter([]);
    setBoardFilter([]);
    setSearchQuery("");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleClick = (taskId: number) => {
    setIsModalOpen(true);
    setTaskId(taskId)
  };

  if (loading) return <div>Загрузка задач...</div>;
  if (error) return <div>{error}</div>;

  return (
    <IssuesContainer>
      <SearchAndFilterContainer>
        {/* Объединенный поиск по названию задачи и исполнителю */}
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по названию задачи или исполнителю..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery && (
                  <IconButton onClick={() => setSearchQuery("")}>
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={handleMenuClick}
        >
          Фильтры
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem disabled>Фильтры задач</MenuItem>
          <Divider />

          {/* Фильтр по статусу */}
          <MenuItem>
            <FormControl fullWidth>
              <InputLabel>Статус задачи</InputLabel>
              <Select
                multiple
                value={statusFilter}
                onChange={handleStatusFilterChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {availableStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Checkbox checked={statusFilter.indexOf(status) > -1} />
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MenuItem>

          {/* Фильтр по доске */}
          <MenuItem>
            <FormControl fullWidth>
              <InputLabel>Доска</InputLabel>
              <Select
                multiple
                value={boardFilter}
                onChange={handleBoardFilterChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const board = availableBoards.find(b => b.id === value);
                      return <Chip key={value} label={board?.name || value} />;
                    })}
                  </Box>
                )}
              >
                {availableBoards.map((board) => (
                  <MenuItem key={board.id} value={board.id}>
                    <Checkbox checked={boardFilter.indexOf(board.id) > -1} />
                    {board.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MenuItem>

          <Divider />
          <MenuItem onClick={clearAllFilters}>Сбросить все фильтры</MenuItem>
        </Menu>
      </SearchAndFilterContainer>

      {/* Показать активные фильтры */}
      <FiltersContainer>
        {statusFilter.length > 0 && (
          <Chip
            label={`Статус: ${statusFilter.join(', ')}`}
            onDelete={() => setStatusFilter([])}
          />
        )}
        {boardFilter.length > 0 && (
          <Chip
            label={`Доски: ${boardFilter.map(id => {
              const board = availableBoards.find(b => b.id === id);
              return board?.name || id;
            }).join(', ')}`}
            onDelete={() => setBoardFilter([])}
          />
        )}
        {(statusFilter.length > 0 || boardFilter.length > 0) && (
          <Button size="small" onClick={clearAllFilters}>
            Очистить все
          </Button>
        )}
      </FiltersContainer>

      {/* Список отфильтрованных задач */}
      {filteredTasks.map((task) => (
        <ProjectContainer key={task.id} onClick={() => handleClick(task.id)}>
          <ProjectWrapper>
            <div>
              <ProjectName>{task.title}</ProjectName>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Chip label={task.status} size="small" />
                <Chip label={task.priority} size="small" />
              </div>
            </div>
            
            <BoardInfoContainer>
              <GoToBoard>{task.boardName}</GoToBoard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <img 
                  src={task.assignee.avatarUrl} 
                  alt={task.assignee.fullName}
                  width={24}
                  height={24}
                  style={{ borderRadius: '50%' }}
                />
                <span>{task.assignee.fullName}</span>
              </div>
              </BoardInfoContainer>
          </ProjectWrapper>
        </ProjectContainer>
      ))}

      <ButtonContainer>
        <CreateTaskButton onClick={openModal}>
          Создать задачу
        </CreateTaskButton>
        {isModalOpen && <CreateTask onClose={closeModal} taskId={taskId} onTasks={true} dissable={false} onTaskUpdate={refreshTasks}/>}
      </ButtonContainer>
    </IssuesContainer>
  );
}