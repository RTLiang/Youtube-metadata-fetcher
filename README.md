# YouTube Metadata Fetcher for Obsidian

Enhance your YouTube video notes with automatic metadata fetching and organization.

## Key Features

* **Metadata Extraction:**
  - Video title, channel name, upload date
  - Video description and duration
  - Automatic video ID extraction from URLs

* **Note Organization:**
  - Automatic note renaming to video title
  - Customizable frontmatter property names
  - Option to add description to note content

* **Customization:**
  - Multiple date format options
  - Granular control over which metadata to update
  - Secure API key storage

## Installation

1. Install through Obsidian's Community Plugins browser
2. Enable the plugin in your settings
3. Configure your YouTube API key in the plugin settings

## Usage

1. Create a new note for your YouTube video
2. Add the YouTube link to your frontmatter:
```yaml
---
YouTube Link: https://www.youtube.com/watch?v=VIDEO_ID
---
```
3. Run the "Fetch YouTube Video Info" command from the command palette
4. Your note will be updated with the video metadata

## Configuration

Access settings through Obsidian's settings panel:

* **API Key:** Your YouTube Data API v3 key (required)
* **Date Format:** Choose from multiple date formats
* **Property Names:** Customize frontmatter property names
* **Feature Toggles:** Enable/disable specific metadata updates

## API Key Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the YouTube Data API v3
4. Create an API key
5. Add the key to the plugin settings

## Support & Contribution

For support or to contribute:
* Open an issue on GitHub
* Submit a pull request
* Provide feedback on feature requests

## License

[MIT License](LICENSE)