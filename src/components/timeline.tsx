import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
  setEdit: (editable: boolean) => void;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function TimeLine() {
  const [tweets, setTweet] = useState<ITweet[] | null>([]);
  const [isEditable, setEditable] = useState(false);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createAt", "desc"),
        limit(25)
      );

      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { photo, tweet, userId, username, createdAt } = doc.data();

          return {
            id: doc.id,
            photo,
            tweet,
            userId,
            username,
            createdAt,
            setEdit: setEditable,
          };
        });
        setTweet(tweets);
      });
    };

    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  useEffect(() => {
    console.log(isEditable);
  }, [isEditable]);

  return (
    <Wrapper>
      {tweets?.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
