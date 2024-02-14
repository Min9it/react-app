import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import Tooltip from "@mui/material/Tooltip";
import {
  Wrapper,
  Column,
  Username,
  Payload,
  EditButton,
  DeleteButton,
  Photo,
  CreateTime,
} from "../styles/tweet";
import { ITweet } from "./ITweet";
import EditTweetForm from "./edit-tweet-form";
import { useState } from "react";
import { elapsedTime } from "../utils/timeUtil";

export default function Tweet({
  username,
  photo,
  tweet,
  userId,
  id,
  createAt,
}: ITweet) {
  const [isEditable, setEditable] = useState(false);
  const user = auth.currentUser;

  const onEdit = () => {
    setEditable((p) => !p);
  };
  const onDelete = async () => {
    const ok = confirm("Are you sure About Delete Tweet?");
    if (!ok || user?.uid != userId) return;

    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      ok;
    }
  };

  return (
    <Wrapper>
      <Column>
        {isEditable ? (
          <EditTweetForm
            photo={photo}
            tweet={tweet}
            id={id}
            setEditable={setEditable}
          />
        ) : (
          <div>
            <Username>{username}</Username>
            <Payload>{tweet}</Payload>
          </div>
        )}
        {user?.uid === userId ? (
          <div>
            {isEditable ? (
              <DeleteButton onClick={onEdit}>Cancel</DeleteButton>
            ) : (
              <div>
                <EditButton onClick={onEdit}>Edit</EditButton>
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
              </div>
            )}
          </div>
        ) : null}
      </Column>
      <Column>
        <Tooltip
          title={new Intl.DateTimeFormat("ko", {
            dateStyle: "full",
            timeStyle: "medium",
          }).format(new Date(createAt))}
        >
          <CreateTime>{elapsedTime(createAt)}</CreateTime>
        </Tooltip>
        {photo ? <Photo src={photo} /> : null}
      </Column>
    </Wrapper>
  );
}
