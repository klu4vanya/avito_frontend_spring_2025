import styled from "styled-components";

export const BoardWrapper = styled.div`
    /* margin-top: 5%; */
    background: #f5f5f5;
    width: 90%;
    margin: 0 auto;
    padding: 20px 0 0 20px;
`

export const BoardContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
`;

export const BoardName = styled.div`
  width: auto;
  height: 35px;
  font-size: 30px;
  color: #555961;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ColumnTitle = styled.h3`
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
  color: #93969A;
`;

export const Task = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #C4CAF0;
  color: #6F7580;

  &:hover {
    background-color: #BFD0ED;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

export const TaskPriority = styled.div<{ color: string }>`
  width: fit-content;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  color: white;
  font-size: 12px;
  margin-bottom: 8px;
`;

export const TaskDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin: 8px 0;
`;

export const TaskAssignee = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  img {
    border-radius: 50%;
  }
`;