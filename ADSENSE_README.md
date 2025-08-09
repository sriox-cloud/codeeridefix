# 🚀 Codeer - Free Online Compiler & Code Editor

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fcodeer.org)](https://codeer.org)
[![GitHub](https://img.shields.io/github/license/siddu-k/codeeride)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)

A powerful, free online compiler and code editor supporting 50+ programming languages. Built with Next.js, featuring real-time code execution, GitHub integration, and a clean VS Code-like interface.

## 🌟 Features

### 🔧 Core Functionality
- **50+ Programming Languages**: Python, JavaScript, Java, C++, C, Go, Rust, TypeScript, PHP, Ruby, Swift, Kotlin, Scala, and more
- **Real-time Code Execution**: Instant compilation and execution using Judge0 API
- **Syntax Highlighting**: Monaco Editor with full syntax highlighting for all supported languages
- **Auto-completion**: Intelligent code completion and error detection
- **File Management**: Create, edit, save, and manage multiple code files
- **GitHub Integration**: Automatic repository creation and file synchronization

### 🎨 User Experience
- **VS Code-like Interface**: Familiar and intuitive development environment
- **Dark Theme**: Professional dark theme optimized for coding
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Zero Setup**: No downloads or installations required
- **Fast Loading**: Optimized for speed with Next.js and Turbopack

### 🔐 Authentication & Security
- **GitHub OAuth**: Secure authentication through GitHub
- **Session Management**: Persistent user sessions with NextAuth.js
- **Secure Code Execution**: Sandboxed environment for safe code execution
- **Privacy Compliant**: GDPR and privacy-friendly data handling

### 💰 Monetization (Google AdSense Ready)
- **AdSense Integration**: Pre-configured for Google AdSense
- **Privacy Policy**: Comprehensive privacy policy for ad compliance
- **Terms of Service**: Complete terms of service
- **SEO Optimized**: Structured data, meta tags, and sitemap
- **Content Quality**: High-quality, original content for ad approval

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub OAuth App (for authentication)
- Google AdSense Account (for monetization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/siddu-k/codeeride.git
   cd codeeride
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   
   # Judge0 API (for code execution)
   JUDGE0_API_URL=https://api.codeer.org
   JUDGE0_API_KEY=your-judge0-api-key
   
   # Google AdSense (optional)
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
   ```

4. **GitHub OAuth Setup**
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Create a new OAuth App:
     - Application name: "Codeer"
     - Homepage URL: `http://localhost:3000`
     - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID and Client Secret to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 💰 Google AdSense Setup

### 1. AdSense Application
1. Visit [Google AdSense](https://www.google.com/adsense/)
2. Sign up with your Google account
3. Add your website: `https://yourdomain.com`
4. Complete the site review process

### 2. Code Integration
Once approved, update the following files:

**src/components/GoogleAd.tsx**
```javascript
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your client ID
```

**src/app/layout.tsx**
```javascript
<AdSenseScript /> // Add this component to the head
```

**public/ads.txt**
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

### 3. Ad Placement
Add ads to your pages:

```javascript
import { HeaderAd, SidebarAd, FooterAd } from '@/components/GoogleAd';

// In your component
<HeaderAd />    // Top banner
<SidebarAd />   // Sidebar rectangle
<FooterAd />    // Bottom banner
```

### 4. Privacy Compliance
- ✅ Privacy Policy: `/privacy`
- ✅ Terms of Service: `/terms`
- ✅ Cookie Consent: Built-in GDPR compliance
- ✅ Data Protection: Secure data handling

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.4.4**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Monaco Editor**: VS Code editor in the browser
- **Radix UI**: Accessible component primitives

### Backend & APIs
- **NextAuth.js**: Authentication solution
- **Judge0 API**: Code compilation and execution
- **GitHub API**: Repository management
- **Vercel**: Deployment and hosting

### SEO & Performance
- **Structured Data**: Schema.org markup
- **Sitemap**: Automatic sitemap generation
- **Meta Tags**: Comprehensive SEO meta tags
- **Performance**: Optimized Core Web Vitals
- **PWA Ready**: Service worker and manifest

## 📁 Project Structure

```
codeer/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with SEO
│   │   ├── page.tsx           # Homepage
│   │   ├── ide/               # Compiler interface
│   │   ├── privacy/           # Privacy policy
│   │   ├── terms/             # Terms of service
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── CodeEditor.tsx     # Main compiler component
│   │   ├── GoogleAd.tsx       # AdSense integration
│   │   ├── LanguageSelector.tsx # Language dropdown
│   │   └── ui/                # UI components
│   └── lib/                   # Utilities and configs
├── public/                    # Static assets
│   ├── robots.txt            # Search engine directives
│   ├── ads.txt              # AdSense verification
│   └── sitemap.xml          # Site structure
└── package.json             # Dependencies
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Environment Variables for Production
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
JUDGE0_API_URL=https://api.codeer.org
JUDGE0_API_KEY=your-judge0-api-key
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

## 📊 SEO Features

### Technical SEO
- ✅ **Meta Tags**: Comprehensive title, description, keywords
- ✅ **Open Graph**: Social media sharing optimization
- ✅ **Twitter Cards**: Twitter sharing optimization
- ✅ **Structured Data**: Schema.org markup for search engines
- ✅ **Sitemap**: XML sitemap for search engine crawling
- ✅ **Robots.txt**: Search engine directives

### Content SEO
- ✅ **High-Quality Content**: Original, valuable programming content
- ✅ **Keyword Optimization**: Targeted programming and compiler keywords
- ✅ **Internal Linking**: Strategic internal link structure
- ✅ **User Experience**: Fast loading, mobile-friendly design

### Performance
- ✅ **Core Web Vitals**: Optimized LCP, FID, CLS scores
- ✅ **Image Optimization**: Next.js Image component
- ✅ **Code Splitting**: Automatic code splitting
- ✅ **Caching**: Efficient caching strategies

## 🔧 Customization

### Adding New Languages
1. Add language to `src/components/LanguageSelector.tsx`
2. Update language mapping in `src/components/Editor.tsx`
3. Add file extension support in `src/components/CodeEditor.tsx`

### Custom Themes
Modify Tailwind CSS classes in components for custom theming.

### Additional Features
- AI Code Assistant integration
- Code sharing and collaboration
- Programming challenges and contests
- Educational content and tutorials

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 Support

- **Website**: [codeer.org](https://codeer.org)
- **Email**: support@codeer.org
- **GitHub Issues**: [Report bugs](https://github.com/siddu-k/codeeride/issues)

## 📈 Analytics & Monitoring

- **Google Analytics**: Track user engagement
- **Core Web Vitals**: Monitor performance metrics
- **Error Tracking**: Sentry integration for error monitoring
- **AdSense Analytics**: Monitor ad performance

---

**Made with ❤️ for the programming community**

*Empowering developers worldwide with free, accessible coding tools.*
