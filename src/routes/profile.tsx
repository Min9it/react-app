import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/ITweet";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Form = styled.form`
  width: 20%;
`;
const NameInput = styled.input`
  width: 100%;
  font-size: 18px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
const EditProfile = styled.label`
  width: 24px;
  height: 24px;
  overflow: hidden;
  border-radius: 50%;
  cursor: pointer;
  align-items: center;
  justify-content: center;
`;
const EditBtn = styled.img`
  height: 24px;
  background-color: black;
  padding-left: 3px;
`;

const EditButton = styled.button`
  background-color: skyblue;
  color: white;
  font-weight: 200;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;
const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 200;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
`;

export default function Profile() {
  let user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[] | null>([]);
  const [nickname, setNickname] = useState(user?.displayName);
  const [isEditable, setEditable] = useState(false);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;

    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);

      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const fetchTweet = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createAt", "desc"),
      limit(25)
    );

    const snapshot = await getDocs(tweetQuery);

    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  const initEditState = () => {
    setNickname(user?.displayName);
    onClickEdit();
  };
  const onClickEdit = () => {
    setEditable((b) => !b);
  };
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const ok = confirm(`Are you sure about change nickname to [${nickname}]?`);

    if (ok) {
      e.preventDefault();

      if (user) {
        await updateProfile(user, { displayName: nickname });

        const qry = query(
          collection(db, "tweets"),
          where("userId", "==", user?.uid)
        );
        const snap = await getDocs(qry);

        snap.docs.forEach((doc) => {
          updateDoc(doc.ref, { username: user?.displayName });
        });

        user = auth.currentUser;
      }
    }

    initEditState();
  };

  useEffect(() => {
    setNickname(user?.displayName);
    fetchTweet();
  }, [user?.displayName]);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        <AvatarImg src={avatar ?? "/avatar.svg"} />
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {isEditable ? (
        <Form onSubmit={onSubmit}>
          <NameInput
            name="nickname"
            type="text"
            value={nickname ?? ""}
            onChange={onChangeName}
          />
          <EditButton type="submit">Edit</EditButton>
          <DeleteButton type="button" onClick={initEditState}>
            Cancel
          </DeleteButton>
        </Form>
      ) : (
        <Name>
          {nickname ?? "Anonymous"}
          <EditProfile htmlFor="nickname">
            <EditBtn src="/edit.svg" onClick={onClickEdit} />
          </EditProfile>
        </Name>
      )}
      <Tweets>
        {tweets?.length == 0
          ? "I haven't posted any tweets yet :("
          : tweets?.map((tweet) => <Tweet key={tweet.id} {...tweet} />)}
      </Tweets>
    </Wrapper>
  );
}
