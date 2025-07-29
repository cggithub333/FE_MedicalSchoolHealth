import {
  Stack, Typography, 
  Avatar, Button, 
  CardActions, CardMedia, 
  CardContent, Card
} from "@mui/material";

import { Person, Verified } from "@mui/icons-material"
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const BlogCard = ({ blog, height = "500px", isInAdminPower = false }) => {
  return (
    <Card sx={{ maxWidth: "100%" }}>
      <CardMedia
        sx={{ height: height, objectFit: "cover" }}
        image={blog?.imageUrl || "/assets/images/default-blog-image.jpg"}
        title={blog?.title || "Blog Title"}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {blog?.title || "Medical Blog"}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {blog?.content || "No content available"}
        </Typography>
      </CardContent>
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
          <Stack component={Button} direction={'row'} spacing={1} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#56a8ed" }}>
              <AutoFixHighIcon fontSize="small" />
            </Avatar>
            <Typography variant="body2" fontWeight={'600'} color="text.secondary">
              Edit this blog
            </Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

export default BlogCard;