import { styled } from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  &:last-child:not(:first-child) {
    align-items: center;
  }
`;
export const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
export const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
export const CreateTime = styled.span`
  font-weight: 300;
  font-size: 10px;
  font-color: lightgray;
  float: right;
`;

export const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
export const EditButton = styled.button`
  background-color: skyblue;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;
export const DeleteButton = styled.button`
  background-color: tomato;
  margin-left: 6px;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;
export const TimelineWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;
export const HomeWrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  grid-template-rows: 1fr 5fr;
`;
