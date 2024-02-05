import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  Form,
  TextArea,
  AttachFileButton,
  AttachFileInput,
  SubmitBtn,
} from "./tweetFormStyles";

export default function PostTweetForm() {
  const TWEET_MAX_SIZE = 1800;
  const MAX_FILE_SIZE_MB = 1;
  const MAX_FILE_SIZE_KB = MAX_FILE_SIZE_MB * 1024 * 1024;
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const resetTweet = () => {
    setTweet("");
    setFile(null);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      //upload file when file size is less than 1MB
      if (files[0].size < MAX_FILE_SIZE_KB) {
        setFile(files[0]);
        setDisabled(false);
      } else {
        alert(`upload file size is less than ${MAX_FILE_SIZE_MB}MB`);
        setDisabled(true);
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const user = auth.currentUser;
    e.preventDefault();

    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setLoading(true);

      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);

        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);

        await updateDoc(doc, {
          photo: url,
        });

        resetTweet();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={TWEET_MAX_SIZE}
        placeholder="What is happening?"
        value={tweet}
        onChange={onChange}
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added 👻" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        id="file"
        accept="image/*"
        type="file"
        onChange={onFileChange}
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
        disabled={isLoading && disabled}
      />
    </Form>
  );
}
