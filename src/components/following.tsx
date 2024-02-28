import { useEffect } from "react";
import { IFriend } from "../routes/friend";
import { elapsedTime } from "../utils/time-util";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Following(props: { data: Array<IFriend> | null }) {
  useEffect(() => {
    const getUserByUid = async (uid: string) => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("User data:", docSnap.data());
      } else {
        console.log("No such user!");
      }
    };

    getUserByUid("VXfXCLa8pEasrOxiUERmpRacci93");
  }, []);

  return (
    <>
      {props.data?.map((f) => (
        <li key={f.followAt}>{`${f.follow}(${elapsedTime(
          f.followAt
        )}부터 팔로잉)`}</li>
      ))}
    </>
  );
}
