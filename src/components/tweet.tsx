import { auth, db, storage } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import Tooltip from "@mui/material/Tooltip";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
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
import { useEffect, useState } from "react";
import { elapsedTime } from "../utils/time-util";
import { Unsubscribe } from "firebase/auth";

export default function Tweet({
  username,
  photo,
  tweet,
  userId,
  id,
  createAt,
}: ITweet) {
  const [isEditable, setEditable] = useState(false);
  const [isLike, setLike] = useState(false);
  const user = auth.currentUser;

  const onClickToggleLike = async () => {
    setLike((p) => !p);
    if (user && !isLike) {
      await addDoc(collection(db, "likes"), {
        like: user?.uid,
        tweet: id,
        tweetOwner: userId,
      });
    } else {
      //FIXME: Unlike 수정
      await deleteDoc(doc(db, "likes", id));
    }
  };

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

  useEffect(() => {
    if (!user) return;
    let unsubscribe: Unsubscribe | null = null;

    const fetchLikes = async () => {
      const fetchQry = query(
        collection(db, "likes"),
        where("like", "==", user.uid),
        where("tweet", "==", id)
      );

      unsubscribe = await onSnapshot(fetchQry, (snapshot) => {
        const likes = snapshot.docs.find((doc) => doc.data().tweet === id);
        setLike(!!likes);
      });
    };

    fetchLikes();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

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
        {isLike ? (
          <FavoriteRoundedIcon onClick={onClickToggleLike} />
        ) : (
          <FavoriteBorderRoundedIcon onClick={onClickToggleLike} />
        )}
      </Column>
    </Wrapper>
  );
}
