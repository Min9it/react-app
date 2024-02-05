import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import {
  Wrapper,
  Column,
  Username,
  Payload,
  EditButton,
  DeleteButton,
  Photo,
} from "./tweetStyles";

export default function tweet({
  username,
  photo,
  tweet,
  userId,
  id,
  setEdit,
}: ITweet) {
  const user = auth.currentUser;

  const onEdit = async () => {
    console.log("onEdit is worked!!!");
    setEdit(true);
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
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <div>
            <EditButton onClick={onEdit}>Edit</EditButton>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
          </div>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
