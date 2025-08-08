# 🚀 Codeer IDE - Online Code Editor

A powerful online IDE built with Next.js, featuring real-time code execution, GitHub integration, and a clean VS Code-like interface.

## ✨ Features

### 🎯 Core Features
- **Multi-language Support**: JavaScript, Python, Java, C++, C, C#, Go, Rust, PHP, Ruby
- **Real-time Code Execution**: Powered by Judge0 API with execution statistics
- **Syntax Highlighting**: Monaco Editor (VS Code's editor) with dark theme
- **File Management**: Create, edit, and delete files with GitHub integration
- **Clean UI**: ShadCN UI components with black, white, and gray color scheme

### 🔐 Authentication
- **GitHub OAuth**: Secure login with GitHub
- **Guest Mode**: Continue without login (no data persistence)
- **Auto Repository Creation**: Creates `codeer-ide-files` repo on first login

### 💾 GitHub Integration
- **Auto-save to GitHub**: Save your code files directly to your GitHub repository
- **File Synchronization**: Load and manage files from your GitHub repo
- **Repository Management**: Automatic repository creation and management

### 📊 Execution Analytics
- **Runtime Statistics**: Execution time, memory usage
- **Compile Output**: View compilation errors and warnings
- **Real-time Output**: See your code results instantly

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Editor**: Monaco Editor (VS Code's editor)
- **UI Components**: ShadCN/UI, Radix UI
- **Authentication**: NextAuth.js with GitHub Provider
- **Database**: Supabase (for user management)
- **Code Execution**: Judge0 API via RapidAPI
- **Version Control**: GitHub API integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- GitHub OAuth App
- Supabase project (optional, for user management)
- RapidAPI account for Judge0 (for code execution)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd codeer-ide
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth (Required for GitHub integration)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Supabase (Optional, for user management)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Judge0 API (Required for code execution)
RAPIDAPI_KEY=your-rapidapi-key-for-judge0
```

### 3. GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App with:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and Client Secret to your `.env.local`

### 4. Judge0 API Setup
1. Visit [Judge0 on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce/)
2. Subscribe to the free plan
3. Copy your API key to `.env.local`

### 5. Supabase Setup (Optional)
1. Create a project at [Supabase](https://supabase.com)
2. Add the URL and anon key to `.env.local`
3. Create the users table:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    avatar_url TEXT,
    github_username VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your IDE!

## 🎮 Usage

### Getting Started
1. **Guest Mode**: Click "Continue without login" to start coding immediately
2. **GitHub Login**: Login with GitHub to save and sync your files

### Writing Code
1. **Select Language**: Choose from the dropdown in the sidebar
2. **Write Code**: Use the Monaco editor with full syntax highlighting
3. **Run Code**: Click the "Run Code" button to execute
4. **View Output**: See results and execution statistics in the output panel

### File Management (GitHub Users)
1. **Create Files**: Click the "+" button in the Files section
2. **Save to GitHub**: Use "Save to GitHub" button to persist your code
3. **Load Files**: Click on any file in the Files panel to load it
4. **Auto Repository**: Your files are saved to `codeer-ide-files` repository

### Supported Languages
- **JavaScript** (Node.js)
- **Python 3**
- **Java**
- **C++**
- **C**
- **C#**
- **Go**
- **Rust**
- **PHP**
- **Ruby**

## 🏗️ Architecture

### Component Structure
```
src/
├── app/
│   ├── page.tsx                 # Main IDE page
│   ├── login/                   # Login page
│   └── api/                     # API routes
│       ├── execute/             # Code execution
│       ├── github-files/        # GitHub file management
│       ├── save-code/           # Save code to GitHub
│       └── auth/                # NextAuth configuration
├── components/
│   ├── CodeEditor.tsx           # Main IDE component
│   ├── Editor.tsx               # Monaco editor wrapper
│   ├── Navbar.tsx               # Navigation bar
│   ├── OutputPanel.tsx          # Code output display
│   ├── LanguageSelector.tsx     # Language selection
│   ├── FileManager.tsx          # GitHub file management
│   └── ui/                      # ShadCN UI components
└── lib/
    └── supabase.ts              # Database configuration
```

### API Endpoints
- `POST /api/execute` - Execute code using Judge0
- `GET /api/github-files` - List files from GitHub repository
- `POST /api/github-files` - Create new file in GitHub repository
- `DELETE /api/github-files` - Delete file from GitHub repository
- `POST /api/save-code` - Save current code to GitHub

## 🎨 Customization

### Themes
The IDE uses a clean dark theme with:
- **Background**: Black (`#000000`)
- **Panels**: Gray-900 (`#111827`)
- **Borders**: Gray-800 (`#1f2937`)
- **Text**: White and Gray tones
- **Accents**: Green for success, Red for errors

### Adding Languages
To add a new language:
1. Add language definition to `LanguageSelector.tsx`
2. Update language mappings in `CodeEditor.tsx`
3. Add Judge0 language ID mapping
4. Update file extension mappings

## 🚨 Troubleshooting

### Common Issues
1. **Monaco Editor not loading**: Make sure `@monaco-editor/react` is installed
2. **Code execution fails**: Check your RapidAPI key and Judge0 subscription
3. **GitHub integration not working**: Verify GitHub OAuth app configuration
4. **Supabase errors**: Check your environment variables and table structure

### Debug Mode
Enable debug logging by adding to `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code's editor
- [Judge0](https://judge0.com/) - Code execution engine
- [ShadCN/UI](https://ui.shadcn.com/) - Beautiful UI components
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [GitHub API](https://docs.github.com/en/rest) - Repository management

---

**Built with ❤️ for developers who love clean, functional code editors!**
