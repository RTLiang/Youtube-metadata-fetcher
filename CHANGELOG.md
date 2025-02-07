## v0.0.1 - Initial Release - YouTube Metadata Fetcher Plugin

**Features:**

*   **Automatic YouTube Video Metadata Fetching:**
    *   Now you can automatically enrich your Obsidian notes about YouTube videos with key metadata!
    *   Simply add a YouTube video link to the `链接` property in your note's frontmatter.
    *   Run the "Fetch YouTube Video Info" command, and the plugin will:
        *   Fetch the video title, author (channel name), and upload date from YouTube.
        *   Rename your note to the video title (cleaned for Obsidian).
        *   Update your note's frontmatter with "Author" and "Date" properties.

*   **Customizable Date Format:**
    *   You can now choose your preferred date format for the "Date" property in your notes.
    *   Go to `Settings -> Community Plugins -> YouTube Metadata Fetcher` to select from various formats like `YYYY-MM-DD`, `MM-DD-YYYY`, `DD-MM-YYYY`, `YYYY/MM/DD`, `MM/DD/YYYY`, `DD/MM/YYYY`, or keep the original ISO 8601 format.

*   **Customizable Frontmatter Property Names:**
    *   Want to use different names for "Author" and "Date" in your frontmatter? No problem!
    *   In the plugin settings, you can now customize the property names for both "Author" and "Date" to your liking.

**How to Get Started:**

1.  **Install the "YouTube Metadata Fetcher" plugin** from Obsidian Community Plugins.
2.  **Enable the plugin** in Community Plugins settings.
3.  **Enter your YouTube API Key** in the plugin settings (you'll need to create one from Google Cloud Console - see plugin description for instructions).
4.  **Create a new Obsidian note** for a YouTube video.
5.  **Add frontmatter** to your note, including the `链接` property with the YouTube video URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`).
6.  **Run the "Fetch YouTube Video Info" command** (using `Ctrl+P` or `Cmd+P`).
7.  Enjoy your automatically updated and organized YouTube video notes!

**Initial Release Notes:**

This is the first release of the YouTube Metadata Fetcher plugin.  Please report any issues or feature requests on [Plugin's GitHub Repository -  *You'll add this link later when you create a repository*].