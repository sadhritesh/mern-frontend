import React, { useState, useEffect } from "react";
import { TextInput, Select, FileInput, Button, Spinner } from "flowbite-react";
import ReactQuill from "react-quill";
import { useToast } from "../hooks/useToast";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    blogPost: ''
  });
  const { successToast, errorToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState("");
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${import.meta.env.REACT_APP_API_BASE_URL}/api/v1/post/getposts?postId=${postId}`);
        const result = await res.json();

        if (!result.success) {
          throw new Error(result.message);
        }
        setFormData(result.data.posts[0]);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPost();
  }, [setImageFile, imageFile]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }
    setLoading(true);
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await fetch(
        `${import.meta.env.REACT_APP_API_BASE_URL}/api/v1/post/update-post/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          body: data,
        }
      );
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }
      console.log(result.data);
      setLoading(false);
      setFormData({
        title: '',
        category: '',
        content: '',
        blogPost: ''
      })
      successToast(result.message);
    } catch (error) {
      setLoading(false);
      errorToast(error.message);
    }
  };
  

  const uploadImage = async (e) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const data = new FormData();

    data.append("blogPost", imageFile);

    try {
      const res = await fetch(
        `${import.meta.env.REACT_APP_API_BASE_URL}/api/v1/post/update-post-image/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          body: data,
        }
      );
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }
      console.log(result.data);
      setLoading(false);
      successToast(result.message);
      setImageFile("");
    } catch (error) {
      setLoading(false);
      errorToast(error.message);
    }
  };
  return (
    <div className="p-[1rem] w-screen">
      <h1 className="text-center text-4xl font-semibold my-[1rem]">
        Update Post
      </h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col gap-4 max-w-[80%] mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <TextInput
              type="text"
              placeholder="Title"
              className="flex-1"
              value={formData.title}
              id="title"
              onChange={(e) => handleChange(e)}
              required
            />
            <Select
              id="category"
              onChange={(e) => handleChange(e)}
              value={formData.category}
            >
              <option value="uncategorized">Select a category</option>
              <option value="javascript">Javascript</option>
              <option value="python">Python</option>
              <option value="nodejs">Nodejs</option>
              <option value="reactjs">Reactjs</option>
              <option value="nextjs">Nextjs</option>
            </Select>
          </div>
          <div className="flex flex-row gap-4 justify-between border-4 border-dotted border-teal-500 p-4">
            <FileInput
              type="file"
              accept="image/*"
              id="blogPost"
              onChange={(e) => {
                setImageFile(e.target.files[0]);
              }}
            />
            <Button
              gradientDuoTone="purpleToBlue"
              type="button"
              size="sm"
              onClick={uploadImage}
              outline
            >
              Upload Image
            </Button>
          </div>
          {formData.blogPost && (
            <img
              src={formData.blogPost}
              alt="upload"
              className="w-full h-72 object-cover"
            />
          )}

          <ReactQuill
            theme="snow"
            className="h-72 mb-10"
            value={formData.content}
            onChange={(value) => {
              setFormData((prevData) => ({ ...prevData, content: value }));
            }}
            required="true"
            as="div"
          />
          <Button gradientDuoTone="purpleToBlue" type="submit" className="my-4">
            {loading ? <Spinner /> : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
