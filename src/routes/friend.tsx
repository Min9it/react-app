import { Unsubscribe } from "firebase/auth";
import Following from "../components/following";
import { auth, db } from "../firebase";
import { Wrapper } from "../styles/tweet";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Followers from "../components/followers";

export interface IFriend {
  follow: string;
  follower: string;
  followAt: number;
}

export default function Friend() {
  const user = auth.currentUser;
  const [follower, setFollower] = useState<Array<IFriend> | null>([]);
  const [following, setFollowing] = useState<Array<IFriend> | null>([]);
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchFriend = async (path: string) => {
      if (!user) return;
      const qry = query(collection(db, path), where("follow", "==", user.uid));

      unsubscribe = await onSnapshot(qry, (snapshot) => {
        const friend = snapshot.docs.map((doc) => {
          const { follow, follower, followAt } = doc.data();
          return { follow, follower, followAt };
        });

        if (path === "follower") {
          setFollower(friend);
        } else if (path === "following") {
          setFollowing(friend);
        }
      });
    };

    fetchFriend("following");
    fetchFriend("follower");

    return () => {
      unsubscribe && unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Wrapper>
        <Followers data={follower} />
        <Following data={following} />
      </Wrapper>
    </>
  );
}
