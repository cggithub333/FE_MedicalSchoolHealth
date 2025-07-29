import { useParams } from "react-router-dom";

const BlogDetail = () => {

  const { blogId } = useParams();

  return (
    <>
      <h1>Blog Detail Page for id = {blogId}</h1>
    </>
  )

}

export default BlogDetail;