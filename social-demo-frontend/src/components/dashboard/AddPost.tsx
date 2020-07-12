import React from "react";
import { useForm } from "react-hook-form";

import { getUserName } from "../../auth";

type AddPostType = {
  onAddPost: (data: Record<string, any>) => void;
};

const AddPost: React.FC<AddPostType> = ({ onAddPost }) => {
  const { register, handleSubmit, formState: {isValid}, reset } = useForm(
    { mode: "onChange" },
  );

  const onSubmit = (data: Record<string, any>) => {
    reset();
    onAddPost(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label">{getUserName()}, What are you doing?</label>
          <div className="control">
            <textarea
              name="content"
              ref={register({ required: true })}
              className="textarea"
              cols={30}
              rows={3}
            >
            </textarea>
          </div>
        </div>
        <div className="field is-grouped is-grouped-right">
          <div className="control">
            <button
              disabled={!isValid}
              className="button is-primary"
              type="submit"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddPost;
