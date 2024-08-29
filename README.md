# AI-Powered Chat Extension for Chrome

This Chrome extension enhances your browsing experience by providing an AI-powered chat interface that can understand and interact with the content of the web pages you visit.

## Features

- **AI Chat Interface**: Interact with an AI assistant directly from your browser.
- **Context-Aware Responses**: The AI uses the content of the current web page to provide more relevant answers.
- **Custom Chat Hooks**: Integrate with external services to enhance the AI's capabilities.
- **Multiple AI Models**: Support for various AI models, including GPT-4 and custom models.
- **Vision Model Support**: Ability to analyze images on web pages (for compatible models).
- **Configurable Settings**: Customize the extension's behavior to suit your needs.

## Installation

1. Download the extension files or clone the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.
5. The extension icon should now appear in your Chrome toolbar.

## Configuration

1. Click on the extension icon and select "Settings".
2. Enter your OpenAI API key in the appropriate field.
3. Choose your preferred AI model from the dropdown menu.
4. Configure any additional settings as needed.

## Usage

1. Navigate to any web page.
2. Click on the extension icon to open the chat interface.
3. Type your question or request in the chat input.
4. The AI will respond, taking into account the content of the current web page.
5. For image analysis (with compatible models), you can ask questions about images on the page.

## Custom Chat Hooks

This extension supports custom chat hooks, allowing integration with external services:

1. In the settings, enable "Chat Hooks".
2. Add new chat hook configurations, including:
   - Name
   - URL
   - Description
   - Configuration parameters
   - Authentication token (if required)
3. The extension will automatically route queries to the most relevant chat hook based on the user's input.

## Development

To modify or extend the extension:

1. Clone the repository.
2. Make your changes to the source code.
3. Test the extension locally by loading it as an unpacked extension in Chrome.
4. For the chat hook functionality, ensure you have a local server running (see `chatHookServer.js`).

## Troubleshooting

- If you encounter issues with large web pages, try refreshing the page or adjusting the context extraction settings.
- Ensure your API key is correctly entered in the settings.
- Check the browser console for any error messages.

## Privacy and Data Usage

This extension processes web page content locally and sends only necessary information to the AI service. No data is stored permanently. Please review the privacy policies of the AI service provider (e.g., OpenAI) for more information on how they handle data.

## Feedback and Contributions

We welcome feedback and contributions! Please open an issue or submit a pull request on our GitHub repository.

## License