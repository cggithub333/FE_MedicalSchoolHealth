import {
  Stack, Typography, 
  Avatar, Button, 
  CardActions, CardMedia, 
  CardContent, Card
} from "@mui/material";

import { Person, Verified } from "@mui/icons-material"
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

import { useNavigate } from "react-router-dom";
import { showErrorToast } from "@utils/toast-utils";

const BlogCard = ({ blog, height = "500px", isInAdminPower = false, isRelatedBlogs = false, handleNavigateDetail }) => {

  const navigate = useNavigate();

  const handleNavigateEditPage = () => {
    if (!blog || !blog.blogId) {
      showErrorToast("Edit is not available for this blog. Choose another blog and continue editing.");
      return;
    }
    // else:
    navigate(`/blogs/manage/edit/${blog.blogId}`);
  }

  return (
    <Card sx={styleCard(isInAdminPower, isRelatedBlogs)}>
      <CardMedia
        sx={{ height: height, objectFit: "cover" }}
        image={blog?.imageUrl || "/assets/images/default-blog-image.jpg"}
        title={blog?.title || "Blog Title"}
        onClick={() => handleNavigateDetail(blog?.blogId)}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ color: 'text.secondary', fontSize: isRelatedBlogs ? "1.2rem" : "2rem" }}>
          {blog?.title || "Medical Blog"}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
          component="div"
          dangerouslySetInnerHTML={{
            __html: isRelatedBlogs
              ? blog?.content.split(/\s+/).slice(0, 25).join(' ') + '...'
              : blog?.content,
          }}
        />

      </CardContent>
      {!isRelatedBlogs && (
        <Stack direction="row" spacing={2} alignItems="center" justifyContent={'space-between'} sx={{ mt: 2, padding: 3 }}>
          <Stack direction={"row"} spacing={3} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 32, height: 32, bgcolor: "#56a8ed" }}>
                <Person fontSize="small" />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {blog.author?.name}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Verified fontSize="small" sx={{ color: "#56a8ed" }} />
              <Typography variant="body2" color="text.secondary">
                Verified by {blog.verifierName}
              </Typography>
            </Stack>
          </Stack>

          {isInAdminPower && (
            <Stack component={Button} direction={'row'} spacing={1} alignItems="center" onClick={handleNavigateEditPage}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "#56a8ed" }}>
                <AutoFixHighIcon fontSize="small" />
              </Avatar>
              <Typography variant="body2" fontWeight={'600'} color="text.secondary">
                Edit this blog
              </Typography>
            </Stack>
          )}
        </Stack>
      )}
    </Card>
  );
}

const styleCard = (isInAdminPower, isRelatedBlogs) => {

  const baseStyles = {
    maxWidth: "100%",
    transition: "transform 0.2s, box-shadow 0.2s"
  };

  if (isRelatedBlogs) {
    baseStyles["cursor"] = "pointer";
    baseStyles["&:hover"] = {
      transform: "translateY(-4px)",
      boxShadow: 4,
    };
  }

  return baseStyles;
}

export default BlogCard;