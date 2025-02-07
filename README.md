# YouTube Metadata Fetcher for Obsidian

This Obsidian plugin fetches metadata from YouTube videos and updates the frontmatter of your notes.

## Features

* Fetches video title, author, upload date, description, and duration.
* Updates frontmatter with fetched data (configurable property names).
* Option to automatically rename the note to the video title.
* Customizable date format.
* Requires a YouTube Data API v3 key.

## Installation

1.  Download this plugin.
2.  Place the plugin folder in your Obsidian vault's plugins folder.
3.  Enable the plugin in Obsidian's settings.

## Configuration

You can configure the plugin's settings through Obsidian's settings panel.  The settings include:

* **YouTube API Key:**  Your YouTube Data API v3 key (required).  This is stored securely.
* **Date Format:**  The format for the date in the frontmatter (e.g., YYYY-MM-DD, MM-DD-YYYY).
* **Property Names:**  Customize the names of the frontmatter properties for author, date, description, and duration.
* **Feature Toggles:** Enable or disable features such as automatic note renaming, updating frontmatter properties, and adding the description to the note content.

## Usage

1.  Create a note in Obsidian.
2.  Add the YouTube video link to the frontmatter using the key `链接` (link).  For example:
    ```yaml
    ---
    链接: https://www.youtube.com/watch?v=dQw4w9WgXcQ
    ---
    ```
3.  Run the "Fetch YouTube Video Info" command (available in the command palette).

## API Key

To obtain a YouTube Data API v3 key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the YouTube Data API v3.
4. Create an API key.

Remember to replace `"YOUR_API_KEY"` with your actual API key in the plugin settings.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

[Specify your license here]
