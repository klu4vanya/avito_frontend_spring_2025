import React, { useState } from "react";
import {
  CreateTaskButton,
  HeaderButton,
  HeaderContainer,
  LinkContainer,
} from "./styles";
import CreateTask from "../CreateTask";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const refreshPage = () => {
    const currentPath = window.location.pathname;
    if (currentPath === '/issues' || currentPath === '/') {
      window.location.reload(); 
    }
  };

  return (
    <HeaderContainer>
      <LinkContainer>
        <HeaderButton to="/issues">Все задачи</HeaderButton>
        <HeaderButton to="/boards">Проекты</HeaderButton>
      </LinkContainer>
      <CreateTaskButton onClick={openModal}>Создать задачу</CreateTaskButton>
      {isModalOpen && <CreateTask onClose={closeModal} onTaskUpdate={refreshPage}/>}
    </HeaderContainer>
  );
}