
import { updateBlogById } from "@api/common/update-blog-by-id";

const useUpdateBlogById = () => {
  const updateBlog = async (blogId, blogData) => {
    try {
      await updateBlogById(blogId, blogData);
      return { success: true };
    } catch (error) {
      throw new Error("Failed to update blog: " + error.message);
    }
  };

  return { updateBlog };
};

export default useUpdateBlogById;