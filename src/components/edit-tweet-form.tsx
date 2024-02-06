import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  Form,
  TextArea,
  AttachFileButton,
  AttachFileInput,
  SubmitBtn,
} from "../styles/tweet-form";
import {
  MAX_FILE_SIZE_KB,
  MAX_FILE_SIZE_MB,
  TWEET_MAX_SIZE,
} from "./tweet-file-policy";

type EditTweet = {
  photo?: string;
  tweet: string;
  id: string;
  setEditable: (b: boolean) => void;
};

export default function EditTweetForm({
  photo,
  tweet,
  id,
  setEditable,
}: EditTweet) {
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setContent(tweet);
  }, [photo, tweet]);

  const resetTweet = () => {
    setContent("");
    setFile(null);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
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

    if (!user || isLoading || content === "" || content.length > 180) return;

    try {
      setLoading(true);
      const document = doc(db, "tweets", id);

      await updateDoc(document, {
        tweet: content,
        createAt: Date.now(),
      });

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);

        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);

        await updateDoc(document, {
          photo: url,
        });

        resetTweet();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setEditable(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={TWEET_MAX_SIZE}
        placeholder={tweet}
        value={content}
        onChange={onChange}
      />
      <AttachFileButton htmlFor="editfile">
        {file ? "Photo added 👻" : "Replace photo"}
      </AttachFileButton>
      <AttachFileInput
        id="editfile"
        accept="image/*"
        type="file"
        onChange={onFileChange}
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Edit Tweet"}
        disabled={isLoading && disabled}
      />
    </Form>
  );
}
