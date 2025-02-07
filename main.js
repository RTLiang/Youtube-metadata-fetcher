const obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
    // API Configuration
    youtubeApiKey: '',

    // Date Formatting
    dateFormat: 'YYYY-MM-DD',

    // Property Names
    authorPropertyName: 'Author',
    datePropertyName: 'Date',
    descriptionPropertyName: 'description',
    durationPropertyName: 'duration',

    // Feature Toggles
    enableRenameNote: true,
    enableUpdateAuthor: true,
    enableUpdateDate: true,
    enableUpdateDescription: false,
    enableUpdateDuration: false,
    enableAddDescriptionToNoteContent: false // New: Toggle for adding description to note content, default off

};

class YouTubeMetadataFetcherSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'YouTube Metadata Fetcher Settings' });

        // API Key Setting
        new obsidian.Setting(containerEl)
            .setName('YouTube API Key')
            .setDesc('Enter your YouTube Data API v3 key here.')
            .addText(text => {
                text
                    .setPlaceholder('Enter your API key')
                    .setValue(this.plugin.settings.youtubeApiKey)
                    .onChange(async (value) => {
                        this.plugin.settings.youtubeApiKey = value;
                        await this.plugin.saveSettings();
                    });
                text.inputEl.type = 'password'; // This line hides the API key
            });

        // Date Format Setting
        new obsidian.Setting(containerEl)
            .setName('Date Format')
            .setDesc('Choose the format for the Date in frontmatter.')
            .addDropdown(dropdown => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');

                dropdown
                    .addOptions({
                        'YYYY-MM-DD': `YYYY-MM-DD (${year}-${month}-${day})`,
                        'MM-DD-YYYY': `MM-DD-YYYY (${month}-${day}-${year})`,
                        'DD-MM-YYYY': `DD-MM-YYYY (${day}-${month}-${year})`,
                        'YYYY/MM/DD': `YYYY/MM/DD (${year}/${month}/${day})`,
                        'MM/DD/YYYY': `MM/DD/YYYY (${month}/${day}/${year})`,
                        'DD/MM/YYYY': `DD/MM/YYYY (${day}/${month}/${year})`,
                        'auto': 'Auto (ISO 8601 - As received from YouTube)'
                    })
                    .setValue(this.plugin.settings.dateFormat || 'YYYY-MM-DD')
                    .onChange(async (value) => {
                        this.plugin.settings.dateFormat = value;
                        await this.plugin.saveSettings();
                    });
            });

        // Author Property Name Setting
        new obsidian.Setting(containerEl)
            .setName('Author Property Name')
            .setDesc('Customize the frontmatter property name for video author/channel.')
            .addText(text => text
                .setPlaceholder('e.g., 作者, Author, Creator')
                .setValue(this.plugin.settings.authorPropertyName || 'Author')
                .onChange(async (value) => {
                    this.plugin.settings.authorPropertyName = value;
                    await this.plugin.saveSettings();
                }));

        // Date Property Name Setting
        new obsidian.Setting(containerEl)
            .setName('Date Property Name')
            .setDesc('Customize the frontmatter property name for video upload date.')
            .addText(text => text
                .setPlaceholder('e.g., 日期, Date, Uploaded')
                .setValue(this.plugin.settings.datePropertyName || 'Date')
                .onChange(async (value) => {
                    this.plugin.settings.datePropertyName = value;
                    await this.plugin.saveSettings();
                }));

        // Feature Toggles
        new obsidian.Setting(containerEl)
            .setName('Enable Note Renaming')
            .setDesc('Turn this on to automatically rename the note to the video title.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableRenameNote)
                .onChange(async (value) => {
                    this.plugin.settings.enableRenameNote = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('Enable Author Update')
            .setDesc('Turn this on to automatically update the "Author" property in frontmatter.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableUpdateAuthor)
                .onChange(async (value) => {
                    this.plugin.settings.enableUpdateAuthor = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('Enable Date Update')
            .setDesc('Turn this on to automatically update the "Date" property in frontmatter.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableUpdateDate)
                .onChange(async (value) => {
                    this.plugin.settings.enableUpdateDate = value;
                    await this.plugin.saveSettings();
                }));

        // Description Settings
        new obsidian.Setting(containerEl)
            .setName('Enable Description Update')
            .setDesc('Turn this on to automatically update the "Description" property in frontmatter with video description.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableUpdateDescription)
                .onChange(async (value) => {
                    this.plugin.settings.enableUpdateDescription = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('Description Property Name')
            .setDesc('Customize the frontmatter property name for video description.')
            .addText(text => text
                .setPlaceholder('e.g., 视频简介, Description, Summary')
                .setValue(this.plugin.settings.descriptionPropertyName || '视频简介')
                .onChange(async (value) => {
                    this.plugin.settings.descriptionPropertyName = value;
                    await this.plugin.saveSettings();
                }));

        // Duration Settings
        new obsidian.Setting(containerEl)
            .setName('Enable Duration Update')
            .setDesc('Turn this on to automatically update the "Duration" property in frontmatter with video duration.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableUpdateDuration)
                .onChange(async (value) => {
                    this.plugin.settings.enableUpdateDuration = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('Duration Property Name')
            .setDesc('Customize the frontmatter property name for video duration.')
            .addText(text => text
                .setPlaceholder('e.g., 视频时长, Duration, Length')
                .setValue(this.plugin.settings.durationPropertyName || '视频时长')
                .onChange(async (value) => {
                    this.plugin.settings.durationPropertyName = value;
                    await this.plugin.saveSettings();
                }));
        new obsidian.Setting(containerEl)
            .setName('Enable Add Description to Note Content')
            .setDesc('Turn this on to automatically add the video description to the beginning of the note content.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableAddDescriptionToNoteContent)
                .onChange(async (value) => {
                    this.plugin.settings.enableAddDescriptionToNoteContent = value;
                    await this.plugin.saveSettings();
                }));
    }
}


module.exports = class YouTubeMetadataFetcher extends obsidian.Plugin {
    async onload() {
        await this.loadSettings();

        // This adds a simple command that you can trigger
        this.addCommand({
            id: 'fetch-youtube-metadata',
            name: 'Fetch YouTube Video Info',
            editorCallback: async (editor, view) => {
                const activeFile = this.app.workspace.getActiveFile();

                if (!activeFile) {
                    new obsidian.Notice('No active file found!');
                    return;
                }

                const frontmatter = this.app.metadataCache.getFileCache(activeFile)?.frontmatter;

                if (!frontmatter) {
                    new obsidian.Notice('No frontmatter found in this file!');
                    return;
                }

                const youtubeLink = frontmatter['链接'];

                if (!youtubeLink) {
                    new obsidian.Notice('No "链接" (link) property found in frontmatter!');
                    return;
                }

                new obsidian.Notice(`Link found: ${youtubeLink} - Now fetching data...`);

                const videoId = this.extractVideoId(youtubeLink);
                if (!videoId) {
                    new obsidian.Notice('Invalid YouTube link or could not extract video ID.');
                    return;
                }

                const apiKey = this.settings.youtubeApiKey;
                if (!apiKey) {
                    new obsidian.Notice('YouTube API Key not set in plugin settings!');
                    return;
                }

                const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;

                try {
                    const response = await fetch(apiUrl);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();

                    if (data.items && data.items.length > 0) {
                        const videoItem = data.items[0];
                        const videoTitle = videoItem.snippet.title;
                        const channelTitle = videoItem.snippet.channelTitle;
                        const uploadDate = videoItem.snippet.publishedAt;
                        const videoDescription = videoItem.snippet.description;
                        const videoDurationISO = videoItem.contentDetails.duration;

                        new obsidian.Notice(`Data fetched! Title: ${videoTitle}, Author: ${channelTitle}, Date: ${uploadDate}`);

                        const sanitizedTitle = this.sanitizeFilename(videoTitle);
                        const newFilename = sanitizedTitle + '.md';

                        if (this.settings.enableRenameNote) {
                            try {
                                await this.app.fileManager.renameFile(activeFile, newFilename);
                                new obsidian.Notice(`Note renamed to: ${sanitizedTitle}`);
                            } catch (renameError) {
                                console.error('Error renaming file:', renameError);
                                new obsidian.Notice(`Error renaming note. See console for details.`);
                            }
                        }

                        if (this.settings.enableUpdateAuthor || this.settings.enableUpdateDate || this.settings.enableUpdateDescription || this.settings.enableUpdateDuration) {
                            try {
                                await this.app.fileManager.processFrontMatter(activeFile, (fm) => {
                                    const authorPropertyName = this.settings.authorPropertyName;
                                    const datePropertyName = this.settings.datePropertyName;
                                    const descriptionPropertyName = this.settings.descriptionPropertyName;
                                    const durationPropertyName = this.settings.durationPropertyName;

                                    if (this.settings.enableUpdateAuthor) {
                                        fm[authorPropertyName] = channelTitle;
                                    }

                                    const dateFormat = this.settings.dateFormat;
                                    let formattedDate = uploadDate;

                                    if (dateFormat === 'YYYY-MM-DD') {
                                        formattedDate = uploadDate.substring(0, 10);
                                    } else if (dateFormat === 'MM-DD-YYYY') {
                                        const dateParts = uploadDate.substring(0, 10).split('-');
                                        formattedDate = `${dateParts[1]}-${dateParts[2]}-${dateParts[0]}`;
                                    } else if (dateFormat === 'DD-MM-YYYY') {
                                        const dateParts = uploadDate.substring(0, 10).split('-');
                                        formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                                    } else if (dateFormat === 'YYYY/MM/DD') {
                                        formattedDate = uploadDate.substring(0, 10).replace(/-/g, '/');
                                    } else if (dateFormat === 'MM/DD/YYYY') {
                                        const dateParts = uploadDate.substring(0, 10).split('-');
                                        formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
                                    } else if (dateFormat === 'DD/MM/YYYY') {
                                        const dateParts = uploadDate.substring(0, 10).split('-');
                                        formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                                    }

                                    if (this.settings.enableUpdateDate) {
                                        fm[datePropertyName] = formattedDate;
                                    }

                                    if (this.settings.enableUpdateDescription) {
                                        fm[descriptionPropertyName] = videoDescription;
                                    }

                                    if (this.settings.enableUpdateDuration) {
                                        fm[durationPropertyName] = this.formatDuration(videoDurationISO);
                                    }
                                });
                                new obsidian.Notice(`Frontmatter updated based on enabled settings.`);
                            } catch (frontmatterError) {
                                console.error('Error updating frontmatter:', frontmatterError);
                                new obsidian.Notice(`Error updating frontmatter. See console for details.`);
                            }
                        } else {
                            new obsidian.Notice("Note title renamed, but frontmatter update skipped as all frontmatter update options are disabled.");
                        }

                        if (this.settings.enableAddDescriptionToNoteContent) {
                            try {
                                const descriptionContent = `## Video Description\n\n${videoDescription}\n\n---\n\n`; // Format description

                                let currentContent = editor.getValue();
                                let newContent = descriptionContent + currentContent; // Default to prepend

                                const lines = currentContent.split('\n');
                                let frontmatterEndLine = -1;
                                let frontmatterStartFound = false;

                                for (let i = 0; i < lines.length; i++) {
                                    const line = lines[i].trim();
                                    if (i === 0 && line === '---') {
                                        frontmatterStartFound = true; // Found frontmatter start at the first line
                                    } else if (frontmatterStartFound && line === '---') {
                                        frontmatterEndLine = i;      // Found the second '---', marking the end
                                        break;                             // Stop searching after finding the end
                                    }
                                }

                                if (frontmatterEndLine !== -1) {
                                    // Frontmatter found, insert after
                                    const frontmatterSection = lines.slice(0, frontmatterEndLine + 1).join('\n') + '\n'; // Include '---' line and newline
                                    const contentAfterFrontmatter = lines.slice(frontmatterEndLine + 1).join('\n');

                                    newContent = frontmatterSection + descriptionContent + contentAfterFrontmatter;
                                } else {
                                    // No frontmatter, prepend (fallback)
                                    newContent = descriptionContent + currentContent;
                                }

                                editor.setValue(newContent);
                                new obsidian.Notice('Video description added after frontmatter (robust).'); // Updated notice

                            } catch (contentError) {
                                console.error('Error adding description to note content after frontmatter (robust):', contentError);
                                new obsidian.Notice('Error adding description to note content after frontmatter (robust). See console for details.');
                            }
                        }

                    } else {
                        new obsidian.Notice('No video data found for this link.');
                    }

                } catch (error) {
                    console.error('Error fetching YouTube data:', error);
                    new obsidian.Notice(`Failed to fetch YouTube data. See console for details.`);
                }
            }
        });

        // This adds a settings tab so the user can configure the API key.
        this.addSettingTab(new YouTubeMetadataFetcherSettingTab(this.app, this));

        // If the plugin hooks up any global DOM events (like listeners on document or window)
        // You should unload them when the plugin is unloaded.
        this.registerDomEvent(document, 'click', (evt) => {
            //console.log('click', evt); // You can uncomment this for debugging later if needed
        });

        // When registering intervals, this function will automatically clear the interval when the plugin is unloaded.
        this.registerInterval(window.setInterval(() => console.log('setInterval'), 1 * 60 * 1000));
    }

    onunload() {
        // Clean up anything when the plugin is disabled/unloaded (if needed)
    }

    extractVideoId(url) {
        const videoIdRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|youtube\.googleapis\.com\/embed\/)([a-zA-Z0-9_-]+)/;
        const match = url.match(videoIdRegex);
        return match ? match[1] : null;
    }

    sanitizeFilename(title) {
        // Remove or replace characters that are invalid in filenames
        return title.replace(/[/\\?%*:|"<>]/g, '-').trim(); // Replace with dash, trim whitespace
    }

    formatDuration(isoDuration) {
        // Simple ISO 8601 duration parsing (improve as needed)
        const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match) return isoDuration; // Handle invalid formats
        let hours = parseInt(match[1] || '0', 10);
        let minutes = parseInt(match[2] || '0', 10);
        let seconds = parseInt(match[3] || '0', 10);
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
};
