import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_HOST } from "../../api";
import axios from "axios";
import {
  BoardsContainer,
  GoToBoard,
  ProjectContainer,
  ProjectName,
  ProjectWrapper,
} from "./styles";
import { BoardName } from "../Board/styles";

interface Board {
  id: number;
  name: string;
  description: string;
  taskCount: number;
}

interface ApiResponse {
  data: Board[];
}

export default function Boards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get<ApiResponse>(`${API_HOST}/boards`);
        setBoards(response.data.data);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.message
            : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);
  
  const handleBoardClick = (boardId: number, boardName: string) => {
    navigate(`/board/${boardId}`, { 
      state: { 
        boardName: boardName 
      } 
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <BoardsContainer>
      {boards.map((board) => (
        <ProjectContainer key={board.id}>
          <ProjectWrapper>
            <ProjectName>{board.name}</ProjectName>
            <GoToBoard onClick={() => handleBoardClick(board.id, board.name)}>
              Перейти к доске
            </GoToBoard>
          </ProjectWrapper>
        </ProjectContainer>
      ))}
    </BoardsContainer>
  );
}