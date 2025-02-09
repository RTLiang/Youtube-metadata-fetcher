## v0.0.1 - Initial Release - YouTube Metadata Fetcher Plugin

**Features:**

* **Comprehensive YouTube Video Metadata Fetching:**
  * Automatically enrich your Obsidian notes with detailed YouTube video metadata
  * Add a YouTube video link to the `YouTube Link` property in your note's frontmatter
  * Run the "Fetch YouTube Video Info" command to:
    * Fetch video title, author (channel name), upload date, description, and duration
    * Optionally rename your note to the video title (cleaned for Obsidian)
    * Update your note's frontmatter with customizable property names
    * Optionally add video description to note content

* **Advanced Customization:**
  * Customizable date format (multiple options including ISO 8601)
  * Customizable frontmatter property names for all metadata fields
  * Granular control over which metadata to update via feature toggles

* **Robust Implementation:**
  * Secure API key storage (masked in settings)
  * Comprehensive error handling and user feedback
  * Smart frontmatter detection and handling
  * Automatic video ID extraction from various YouTube URL formats

**How to Get Started:**

1. Install the "YouTube Metadata Fetcher" plugin from Obsidian Community Plugins
2. Enable the plugin in Community Plugins settings
3. Obtain and enter your YouTube API Key in the plugin settings
4. Create a new Obsidian note for a YouTube video
5. Add frontmatter with the `YouTube Link` property containing the video URL
6. Run the "Fetch YouTube Video Info" command (using `Ctrl+P` or `Cmd+P`)
7. Enjoy your automatically updated and organized YouTube video notes!

**Initial Release Notes:**

This is the first release of the YouTube Metadata Fetcher plugin. Please report any issues or feature requests on the plugin's GitHub repository.