
import { createNewBlog } from "@api/common/create-new-blog";

const useCreateNewBlog = () => {
  const createBlog = async (blogData) => {
    try {
      await createNewBlog(blogData);
      return { success: true };
    } catch (error) {
      throw new Error("Failed to create blog: " + error.message);
    }
  };

  return { createBlog };
};

export default useCreateNewBlog;