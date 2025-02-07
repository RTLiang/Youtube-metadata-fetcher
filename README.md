# YouTube Metadata Fetcher - Obsidian Plugin

This Obsidian plugin automatically fetches metadata (title, author, and upload date) from YouTube videos and updates your notes.

## Features
- Fetches YouTube video metadata using the YouTube Data API v3
- Automatically renames note files using the video title
- Updates frontmatter with:
  - Video title
  - Channel/author name
  - Upload date (in YYYY-MM-DD format)
- Supports various YouTube URL formats

## Installation
1. Go to Settings → Community plugins in Obsidian
2. Search for "YouTube Metadata Fetcher"
3. Install and enable the plugin

## Configuration
1. Obtain a YouTube Data API v3 key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Go to Settings → YouTube Metadata Fetcher
3. Enter your API key in the settings tab

## Usage
1. Create a new note with YouTube link in the frontmatter:
   ```yaml
   链接: https://www.youtube.com/watch?v=example
   ```
2. Run the "Fetch YouTube Video Info" command:
   - Open the Command Palette (Ctrl/Cmd + P)
   - Search for "Fetch YouTube Video Info"
   - Execute the command
3. The plugin will:
   - Fetch video metadata
   - Rename the note file using the video title
   - Update frontmatter with author and date information

## Requirements
- Obsidian v1.0.0 or higher
- YouTube Data API v3 key

## Troubleshooting
- Ensure your API key is valid and has YouTube Data API v3 enabled
- Check the console for error messages (Ctrl/Cmd + Shift + I)
- Make sure the YouTube link is in the correct format in the frontmatter

## Support
For issues or feature requests, please open an issue on the [GitHub repository](https://github.com/your-repo-url).

## License
MIT License

## Author
Raydon Liang