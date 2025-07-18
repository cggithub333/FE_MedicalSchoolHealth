"use client"

import { useEffect, useRef, useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Box,
  TextField,
  Menu,
  MenuItem as MenuItemComponent,
  Divider,
  Paper,
} from "@mui/material"
import {
  InsertDriveFile,
  FolderOpen,
  Save,
  Print,
  ContentCut,
  ContentCopy,
  ContentPaste,
  Undo,
  Redo,
  FormatBold,
  Fullscreen,
} from "@mui/icons-material"

import { CiFileOn as EmptyFile } from "react-icons/ci";
import { FaFile as TitledFile} from "react-icons/fa";
import { FaFileAlt as WritingContentFile} from "react-icons/fa";
import ItalicFormat from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';

export default function TextEditor() {

  const editorRef = useRef(null);

  const [content, setContent] = useState("")
  const [fontFamily, setFontFamily] = useState("Arial")
  const [fontSize, setFontSize] = useState(12)
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentMenu, setCurrentMenu] = useState(null)
  const [blogTitle, setBlogTitle] = useState("")
  const [showImageUpload, setShowImageUpload] = useState(false)

  const handleMenuClick = (event, menuName) => {
    setAnchorEl(event.currentTarget)
    setCurrentMenu(menuName)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setCurrentMenu(null)
  }

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const text = selection.toString().trim();
      if (text) {
        console.log("Selected text:", text);
        // You could also trigger highlight, popup, formatting, etc.
      }
    }
  };

  const fontFamilies = ["Arial", "Times New Roman", "Helvetica", "Georgia", "Verdana", "Courier New"]
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72]

  return (
    <Box  sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#a7c5d2", padding: "10px" }}
    >
      {/* Title Bar */}
      <AppBar position="static" sx={{ bgcolor: "#699cb4", color: "#333", boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "center", minHeight: "48px !important" }}>
          <Typography variant="h6" sx={{ fontWeight: "normal", fontSize: "16px", color: "#fff" }}>
            <span style={{ fontWeight: "bold" }}>Blog Editor</span> -{" "}
            {blogTitle ? 
            <>
              {content ?  <WritingContentFile style={{ verticalAlign: "middle", marginRight: "4px" }} /> : 
                          <TitledFile style={{ verticalAlign: "middle", marginRight: "4px" }} />}
              <span>{`${blogTitle}`}</span>
            </> 
            : 
            <>
              <EmptyFile style={{ verticalAlign: "middle", marginRight: "4px" }} />
              <span>Untitled Document</span>
            </>}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Menu Bar */}
      <Box sx={{ bgcolor: "#ddd", borderBottom: "1px solid #ccc" }}>
        <Box sx={{ display: "flex", px: 1 }}>
          {["File", "Insert", "View"].map((menu) => (
            <Button
              key={menu}
              onClick={(e) => handleMenuClick(e, menu)}
              sx={{
                color: "#333",
                textTransform: "none",
                fontSize: "14px",
                minWidth: "auto",
                px: 2,
                py: 1,
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              {menu}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Toolbar */}
      <Box sx={{ bgcolor: "#f8f8f8", borderBottom: "1px solid #ccc", p: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          {/* File Operations */}
          <IconButton size="small" title="New">
            <InsertDriveFile fontSize="small" />
          </IconButton>
          <IconButton size="small" title="Open">
            <FolderOpen fontSize="small" />
          </IconButton>
          <IconButton size="small" title="Save">
            <Save fontSize="small" />
          </IconButton>
          {/* <IconButton size="small" title="Print">
            <Print fontSize="small" />
          </IconButton> */}

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Edit Operations */}
          <IconButton size="small" title="Cut">
            <ContentCut fontSize="small" />
          </IconButton>
          <IconButton size="small" title="Copy">
            <ContentCopy fontSize="small" />
          </IconButton>
          <IconButton size="small" title="Paste">
            <ContentPaste fontSize="small" />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Undo/Redo */}
          <IconButton size="small" title="Undo">
            <Undo fontSize="small" />
          </IconButton>
          <IconButton size="small" title="Redo">
            <Redo fontSize="small" />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Format */}
          <IconButton size="small" title="Bold">
            <FormatBold fontSize="small" />
          </IconButton>
          <IconButton size="small" title="Italic">
            <ItalicFormat fontSize="medium" />
          </IconButton>
          <IconButton size="small" title="Underline">
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Font Family */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              displayEmpty
              sx={{ fontSize: "14px", height: "32px" }}
            >
              {fontFamilies.map((font) => (
                <MenuItem key={font} value={font} sx={{ fontSize: "14px" }}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Font Size */}
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              sx={{ fontSize: "14px", height: "32px" }}
            >
              {fontSizes.map((size) => (
                <MenuItem key={size} value={size} sx={{ fontSize: "14px" }}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }} />

          {/* Fullscreen */}
          <IconButton size="small" title="Fullscreen">
            <Fullscreen fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Text Editor Area */}
      <Box sx={{ flex: 1, p: 2, bgcolor: "#f5f5f5" }}>
        <Paper sx={{ height: "100%", p: 2, display: "flex", flexDirection: "column" }}>
          {/* Blog Title Input */}
          <TextField
            fullWidth
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            placeholder="Blog title name"
            required
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                fontWeight: "bold",
                fontSize: "18px",
              },
            }}
          />

          {/* Text Content Area */}
          <TextField
            
            multiline
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing..."
            variant="outlined"
            ref={editorRef}
            onMouseUp={handleMouseUp}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                height: "100%",
                alignItems: "flex-start",
                fontFamily: fontFamily,
                fontSize: `${fontSize}px`,
                "& fieldset": {
                  border: "1px solid #ddd",
                },
              },
              "& .MuiInputBase-input": {
                height: "100% !important",
                overflow: "auto !important",
              },
            }}
          />

          {/* Image Upload Box */}
          {showImageUpload && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: "2px dashed #699cb4",
                borderRadius: 2,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#f0f8ff",
                },
              }}
              onClick={() => document.getElementById("image-upload").click()}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#699cb4",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                +
              </Box>
              <Typography sx={{ mt: 1, color: "#699cb4" }}>Click to upload image</Typography>
            </Box>
          )}

          {/* Hidden File Input */}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                console.log("Selected image:", e.target.files[0].name)
                // Handle image upload here
                setShowImageUpload(false)
              }
            }}
          />
        </Paper>
      </Box>

      {/* Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 150 },
        }}
      >
        {currentMenu === "File" && [
          <MenuItemComponent key="new" onClick={handleMenuClose}>
            New
          </MenuItemComponent>,
          <MenuItemComponent key="open" onClick={handleMenuClose}>
            Open
          </MenuItemComponent>,
          <MenuItemComponent key="save" onClick={handleMenuClose}>
            Save
          </MenuItemComponent>,
          <MenuItemComponent key="saveas" onClick={handleMenuClose}>
            Save As...
          </MenuItemComponent>,
          <Divider key="divider1" />,
        ]}
        {currentMenu === "Edit" && [
          <MenuItemComponent key="undo" onClick={handleMenuClose}>
            Undo
          </MenuItemComponent>,
          <MenuItemComponent key="redo" onClick={handleMenuClose}>
            Redo
          </MenuItemComponent>,
          <Divider key="divider1" />,
          <MenuItemComponent key="cut" onClick={handleMenuClose}>
            Cut
          </MenuItemComponent>,
          <MenuItemComponent key="copy" onClick={handleMenuClose}>
            Copy
          </MenuItemComponent>,
          <MenuItemComponent key="paste" onClick={handleMenuClose}>
            Paste
          </MenuItemComponent>,
          <Divider key="divider2" />,
          <MenuItemComponent key="selectall" onClick={handleMenuClose}>
            Select All
          </MenuItemComponent>,
        ]}
        {currentMenu === "Insert" && [
          <MenuItemComponent
            key="image"
            onClick={() => {
              setShowImageUpload(true)
              handleMenuClose()
            }}
          >
            Image
          </MenuItemComponent>,
        ]}
        {currentMenu === "View" && [
          <MenuItemComponent key="zoom" onClick={handleMenuClose}>
            Zoom
          </MenuItemComponent>,
          <MenuItemComponent key="fullscreen" onClick={handleMenuClose}>
            Full Screen
          </MenuItemComponent>,
        ]}
        {currentMenu === "Help" && [
          <MenuItemComponent key="about" onClick={handleMenuClose}>
            About
          </MenuItemComponent>,
          <MenuItemComponent key="help" onClick={handleMenuClose}>
            Help
          </MenuItemComponent>,
        ]}
      </Menu>
    </Box>
  )
}