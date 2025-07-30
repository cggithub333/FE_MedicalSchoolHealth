
import request from "@api/request";

export const createNewBlog = async (blogData) => {

  try {
    await request.post("blogs", blogData);
  }
  catch (error) {
    throw new Error("Failed to create blog: " + error.message);
  }

}