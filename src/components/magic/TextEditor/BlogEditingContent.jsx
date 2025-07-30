"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Typography,
  Divider,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Avatar
} from "@mui/material"

import { ImNewspaper } from "react-icons/im";
import { PiBroomFill } from "react-icons/pi";

import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Image as ImageIcon,
  Save as SaveIcon,
  Link as LinkIcon,
} from "@mui/icons-material"
import { showErrorToast, showSuccessToast } from "@utils/toast-utils";

import './BlogEditingContent.css' 

const BlogEditingContent = ({ blog }) => {
  const [title, setTitle] = useState(blog?.title || "")
  const [imageUrl, setImageUrl] = useState(blog?.imageUrl || "")
  const [content, setContent] = useState(blog?.content || "")

  // Update state when blog prop changes
  useEffect(() => {
    setTitle(blog?.title || "");
    setImageUrl(blog?.imageUrl || "");
    setContent(blog?.content || "");
  }, [blog]);

  const [fontSize, setFontSize] = useState("16")
  const [fontFamily, setFontFamily] = useState("Arial")
  const [isUploading, setIsUploading] = useState(false)
  const contentRef = useRef(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [showWarning, setShowWarning] = useState(false)
  const fileInputRef = useRef(null)

  // Font options
  const fontFamilies = ["Arial", "Georgia", "Times New Roman", "Helvetica", "Verdana", "Courier New", "Comic Sans MS"]

  const fontSizes = ["12", "14", "16", "18", "20", "24", "28", "32", "36"]

  // Execute formatting commands
  const executeCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value)
    contentRef.current?.focus()
  }, [])

  // Handle removing formatting
  const handleRemoveFormat = () => {
    executeCommand("removeFormat")
  }

  // Handle bold formatting
  const handleBold = () => {
    executeCommand("bold")
  }

  // Handle italic formatting
  const handleItalic = () => {
    executeCommand("italic")
  }

  // Handle underline formatting
  const handleUnderline = () => {
    executeCommand("underline")
  }

  // Handle font family change
  const handleFontFamilyChange = (event) => {
    const newFontFamily = event.target.value
    setFontFamily(newFontFamily)
    executeCommand("fontName", newFontFamily)
  }

  // Handle font size change
  const handleFontSizeChange = (event) => {
    const newFontSize = event.target.value
    setFontSize(newFontSize)

    // For font size, we need to use a different approach since execCommand fontSize uses 1-7 scale
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if (!range.collapsed) {
        const span = document.createElement("span")
        span.style.fontSize = `${newFontSize}px`
        try {
          range.surroundContents(span)
        } catch (e) {
          // If surroundContents fails, extract and wrap content
          const contents = range.extractContents()
          span.appendChild(contents)
          range.insertNode(span)
        }
        selection.removeAllRanges()
      }
    }
    contentRef.current?.focus()
  }

  // (Link logic removed)

  // Handle warning close
  const handleWarningClose = () => {
    setShowWarning(false)
  }

  // Handle image upload with file explorer
  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Simulate your image upload logic
      // Replace this with your actual upload implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a temporary URL for preview (replace with your actual upload result)
      const uploadedImageUrl = URL.createObjectURL(file)
      setImageUrl(uploadedImageUrl)

      // Here you would typically upload to your server and get back a permanent URL
      // const formData = new FormData();
      // formData.append('image', file);
      // const response = await fetch('/api/upload', { method: 'POST', body: formData });
      // const { imageUrl } = await response.json();
      // setImageUrl(imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error)
    } finally {
      setIsUploading(false)
      // Clear the file input
      event.target.value = ""
    }
  }

  // Get the HTML content from the editor
  const getContent = () => {
    return contentRef.current?.innerHTML || ""
  }

  const isValidBlogData = () => {

    // debug:
    console.log("Validating blog data...")
    console.log("Title:", title)
    console.log("Content:", getContent())
    console.log("Image URL:", imageUrl)

    const blogTitle = title.trim();
    const blogContent = getContent().trim();

    const blogTitleLength = blogTitle ? blogTitle.trim().split(/\s+/).length : 0;
    const blogContentLength = blogContent ? blogContent.trim().split(/\s+/).length : 0;

    if (blogTitleLength < 3) {
      showErrorToast("Blog title must be at least 3 words long.");
      return false;
    }

    if (blogContentLength < 20) {
      showErrorToast("Blog content must be at least 20 words long.");
      return false;
    }

    return true;
  }

  // Handle save/submit
  const handleSave = () => {
    const blogData = {
      title: title.trim(),
      content: getContent().trim(),
      imageUrl: imageUrl.trim(),
    }

    if (!isValidBlogData()) {
      return;
    }

    // else:
    showSuccessToast("Blog post saved successfully!");
  }

  // Handle paste to clean up formatting if needed
  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }

  // Set initial content in the editor when content changes
  useEffect(() => {
    if (contentRef.current && content) {
      contentRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <Box sx={{ width: "100%", height: "100%", mx: "auto", p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <Avatar sx={{ bgcolor: "#5ca8ea" }}>
          <ImNewspaper />
        </Avatar>
        <Typography variant="h5" sx={{ textTransform: "uppercase" }}>
          Edit Blog Post
        </Typography>
      </Box>

      {/* Title Input */}
      <TextField
        fullWidth
        label="Blog Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 3 }}
        placeholder="Enter your blog title..."
      />

      {/* Image Upload and Preview */}
      <Box sx={{ mb: 3 }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          style={{ display: "none" }}
        />
        {/* <Button
          variant="outlined"
          startIcon={<ImageIcon />}
          onClick={handleImageUpload}
          disabled={isUploading}
          sx={{ mb: 2 }}
        >
          {isUploading ? "Uploading..." : "Upload Featured Image"}
        </Button> */}

        {imageUrl && (
          <Card sx={{ maxWidth: 500, mb: 2 }}>
            <CardMedia component="img" height="200" image={imageUrl} alt="Featured image preview" />
          </Card>
        )}
      </Box>

      {/* Editor Toolbar */}
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          {/* Formatting Buttons */}

          <IconButton onClick={handleRemoveFormat} color="primary" title="Remove Formatting">
            <PiBroomFill />
          </IconButton>

          <IconButton onClick={handleBold} color="primary" title="Bold">
            <FormatBold />
          </IconButton>

          <IconButton onClick={handleItalic} color="primary" title="Italic">
            <FormatItalic />
          </IconButton>

          <IconButton onClick={handleUnderline} color="primary" title="Underline">
            <FormatUnderlined />
          </IconButton>

          {/* Link icon removed */}

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Font Family Selector */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Font Family</InputLabel>
            <Select value={fontFamily} label="Font Family" onChange={handleFontFamilyChange}>
              {fontFamilies.map((font) => (
                <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Font Size Selector */}
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Size</InputLabel>
            <Select value={fontSize} label="Size" onChange={handleFontSizeChange}>
              {fontSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}px
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </Paper>

      {/* Content Editor */}
      <Paper
        elevation={1}
        sx={{
          minHeight: 400,
          p: 2,
          border: "1px solid #e0e0e0",
          "&:focus-within": {
            borderColor: "primary.main",
          },
        }}
      >
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning={true}
          className="editor-content"
          onPaste={handlePaste}
          onInput={() => setContent(contentRef.current.innerHTML)}
          style={{
            minHeight: "350px",
            outline: "none",
            fontSize: "16px",
            lineHeight: "1.6",
            fontFamily: fontFamily,
          }}
          data-placeholder="Start writing your blog content here..."
        />
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={!title.trim()}>
          Save Blog Post
        </Button>
      </Box>

      {/* Preview of data structure */}
      {/* <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Preview of data to be sent:
        </Typography>
        <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
          <pre style={{ fontSize: "12px", overflow: "auto" }}>
            {JSON.stringify(
              {
                title: title,
                content: getContent(),
                imageUrl: imageUrl,
              },
              null,
              2,
            )}
          </pre>
        </Paper>
      </Box> */}
      {/* Link Creation Dialog removed */}

      {/* Warning Snackbar */}
      <Snackbar
        open={showWarning}
        autoHideDuration={3000}
        onClose={handleWarningClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleWarningClose} severity="warning" sx={{ width: "100%" }}>
          Please select some text first to create a link!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default BlogEditingContent;