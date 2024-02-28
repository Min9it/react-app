import { IFriend } from "../routes/friend";

export default function Followers(props: { data: Array<IFriend> | null }) {
  return (
    <>
      {props.data?.map((f) => (
        <li key={f.followAt}>{f.follow}</li>
      ))}
    </>
  );
}
