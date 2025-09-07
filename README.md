# Quiz Generator VTF

A modern web application for generating customized quizzes using AI models, with support for both local Ollama and OpenRouter API integration.

## Features

- **AI-Powered Quiz Generation**: Create quizzes on any subject using AI models
- **Multiple AI Sources**: Choose between local Ollama models or OpenRouter API
- **Customizable Difficulty Levels**: Select from easy, medium, or hard difficulty settings
- **Quiz History**: View and retake previously generated quizzes
- **User Profiles**: Personalized experience with user profiles
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Malaysian Education System Focus**: Quizzes tailored for the Malaysian education context

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **AI Integration**: Ollama (local) and OpenRouter API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- For local AI: [Ollama](https://ollama.ai/) installed and running

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/quiz-generator-vtf.git
   cd quiz-generator-vtf
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory (optional for OpenRouter API)
   ```
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **First-time Setup**: Enter your name to create a user profile
2. **Configure Settings**: 
   - Choose between Ollama (local) or OpenRouter API
   - For Ollama: Ensure Ollama is running locally and set the URL (default: http://localhost:11434)
   - For OpenRouter: Enter your API key
   - Select your preferred AI model

3. **Generate a Quiz**:
   - Enter a subject
   - Select difficulty level
   - Click "Generate Quiz"

4. **Take the Quiz**: Answer the questions and see your results

5. **Review History**: Access previously generated quizzes from the dashboard

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally

## License

[MIT](LICENSE)

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Ollama](https://ollama.ai/)
- [OpenRouter](https://openrouter.ai/)
