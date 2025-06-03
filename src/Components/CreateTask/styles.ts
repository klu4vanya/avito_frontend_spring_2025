import { Button, FormControl, TextField } from "@mui/material";
import styled from "styled-components";
import cross from "../../assets/cross.svg";

export const CreateTaskContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 373px;
  height: 642px;
  padding: 10px;
  border-radius: 5.5;
  border: #f8f8f8 solid 5px;
  background-color: #e9eaeb;
  z-index: 100;
`;
export const CloseModalContainer = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: end;
`;

export const CrossButton = styled(Button)`
  && {
    width: 20px !important;
    height: 20px;
    min-width: 20px !important; // Material-UI часто использует min-width
    background-image: url(${cross});
    background-size: contain;
    background-repeat: no-repeat;
  }
`;
export const Title = styled.div`
  width: auto;
  height: 33px;
  font-size: 25px;
`;

export const FieldsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

export const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    width: "373px",
    height: "auto",
    backgroundColor: "#f2f2f2",
    borderRadius: "6px",
    marginTop: "5px",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "#ccc",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4500ff",
    },
  },
});

export const StyledForm = styled(FormControl)`
  width: 100%;
  height: auto;
  background-color: #f2f2f2;
  border-radius: 6px;

  & .MuiInputLabel-root {
    color: #4500ff; 
  }

  & .MuiInputLabel-root.Mui-focused {
    color: #4500ff; 
  }

  & .MuiInputLabel-root.MuiInputLabel-shrink {
    color: #4500ff;
  }

  & .MuiOutlinedInput-root {
    border-radius: 6px;
    height: auto;

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #4500ff; 
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #4500ff; 
    }
  }

  & .MuiSelect-icon {
    color: #4500ff;
  }
`;

export const ButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
`