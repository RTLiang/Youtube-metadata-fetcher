const obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
    youtubeApiKey: '',
    dateFormat: 'YYYY-MM-DD',
    authorPropertyName: 'Author', // Default Author property name
    datePropertyName: 'Date',   // Default Date property name
    enableRenameNote: true,     // 新增：启用/禁用 自动重命名笔记 功能，默认启用
    enableUpdateAuthor: true,   // 新增：启用/禁用 更新作者信息 功能，默认启用
    enableUpdateDate: true     // 新增：启用/禁用 更新日期信息 功能，默认启用
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
            .addText(text => text
                .setPlaceholder('Enter your API key')
                .setValue(this.plugin.settings.youtubeApiKey)
                .onChange(async (value) => {
                    console.log('API Key: ' + value);
                    this.plugin.settings.youtubeApiKey = value;
                    await this.plugin.saveSettings();
                }));

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
                        console.log('Date Format: ' + value);
                        this.plugin.settings.dateFormat = value;
                        await this.plugin.saveSettings();
                    });
            });

        // Feature Toggles
        new obsidian.Setting(containerEl)
            .setName('Enable Note Renaming')
            .setDesc('Turn this on to automatically rename the note to the video title.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableRenameNote)
                .onChange(async (value) => {
                    console.log('Enable Rename Note: ' + value);
                    this.plugin.settings.enableRenameNote = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('Enable Author Update')
            .setDesc('Turn this on to automatically update the "Author" property in frontmatter.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableUpdateAuthor)
                .onChange(async (value) => {
                    console.log('Enable Update Author: ' + value);
                    this.plugin.settings.enableUpdateAuthor = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('Enable Date Update')
            .setDesc('Turn this on to automatically update the "Date" property in frontmatter.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableUpdateDate)
                .onChange(async (value) => {
                    console.log('Enable Update Date: ' + value);
                    this.plugin.settings.enableUpdateDate = value;
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
                // 1-7. Get active file, frontmatter, link, videoId, apiKey, apiUrl, fetch data (Same as before, no changes needed)
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
                        const uploadDate = videoItem.snippet.publishedAt; // ISO 8601 format

                        new obsidian.Notice(`Data fetched! Title: ${videoTitle}, Author: ${channelTitle}, Date: ${uploadDate}`);

                        // --- Step 3: New Code to Update Note (功能开关控制) ---

                        // 9. Sanitize video title for filename
                        const sanitizedTitle = this.sanitizeFilename(videoTitle);
                        const newFilename = sanitizedTitle + '.md';

                        // 10. Rename the note file (根据开关判断是否执行)
                        if (this.settings.enableRenameNote) {
                            try {
                                await this.app.fileManager.renameFile(activeFile, newFilename);
                                new obsidian.Notice(`Note renamed to: ${sanitizedTitle}`);
                            } catch (renameError) {
                                console.error('Error renaming file:', renameError);
                                new obsidian.Notice(`Error renaming note. See console for details.`);
                            }
                        }

                        // 11. Update frontmatter with Author and Date (根据开关判断是否执行)
                        if (this.settings.enableUpdateAuthor || this.settings.enableUpdateDate) {
                            try {
                                await this.app.fileManager.processFrontMatter(activeFile, (fm) => {
                                    const authorPropertyName = this.settings.authorPropertyName;
                                    const datePropertyName = this.settings.datePropertyName;

                                    if (this.settings.enableUpdateAuthor) {
                                        fm[authorPropertyName] = channelTitle;
                                    }

                                    // --- 日期格式化 ---
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
                                });
                                new obsidian.Notice(`Frontmatter updated based on enabled settings.`);
                            } catch (frontmatterError) {
                                console.error('Error updating frontmatter:', frontmatterError);
                                new obsidian.Notice(`Error updating frontmatter. See console for details.`);
                            }
                        } else {
                            new obsidian.Notice("Note title renamed, but frontmatter update skipped as both 'Update Author' and 'Update Date' are disabled.");
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

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
};