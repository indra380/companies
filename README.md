# Companies Directory

A modern, responsive web application for browsing and filtering company directories. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- **Company Browsing**: Browse through a curated list of companies with detailed information
- **Advanced Filtering**: Filter companies by industry, location, size, funding stage, and more
- **Smart Search**: Real-time search across company names, descriptions, technologies, and tags
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **View Modes**: Switch between grid and list view layouts

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **Custom Hooks**: Comprehensive set of reusable React hooks for data management
- **State Management**: React Context API with useReducer for scalable state management
- **API Integration**: RESTful API integration with error handling and loading states
- **Performance**: Optimized with debounced search, lazy loading, and efficient re-renders
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **SEO Friendly**: Semantic HTML structure and meta tags

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Development**: Vite, ESLint, PostCSS
- **Mock API**: JSON Server
- **Deployment**: Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd companies-directory
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Install Tailwind CSS forms plugin:
```bash
npm install @tailwindcss/forms
```

## 🚀 Development

### Start Development Server
```bash
# Start the React app
npm run dev

# Start the mock API (in another terminal)
npm run api

# Or start both simultaneously
npm run start:full
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Mock API**: http://localhost:3001

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run api` - Start JSON Server mock API

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── company/        # Company-specific components
│   └── filters/        # Filter and search components
├── context/            # React Context for state management
├── hooks/              # Custom React hooks
├── services/           # API services and external integrations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports

data/
└── companies.json     # Mock company data for development

public/
├── favicon.svg        # Application favicon
└── ...               # Other static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#0ea5e9 to #3b82f6)
- **Secondary**: Gray scale for text and backgrounds
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (primary), JetBrains Mono (code)
- **Font Weights**: 300, 400, 500, 600, 700
- **Responsive Scaling**: Automatic scaling across breakpoints

### Components
All components follow a consistent design system with:
- Consistent spacing (Tailwind spacing scale)
- Rounded corners (8px, 12px for cards)
- Subtle shadows and hover effects
- Smooth animations and transitions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Companies Directory
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_VERSION=1.0.0
VITE_ITEMS_PER_PAGE=12
VITE_DEBOUNCE_DELAY=300
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_EXPORT_FEATURES=true
VITE_ENABLE_ADVANCED_FILTERS=true
```

### API Configuration
The app uses JSON Server for development. For production, update the API endpoints in:
- `src/services/api.ts`
- `.env.production`

## 📱 Features in Detail

### Company Filtering
- **Industry**: Filter by technology, healthcare, finance, etc.
- **Location**: Filter by city, state, or country
- **Company Size**: From startups to enterprises
- **Funding Stage**: Pre-seed to IPO
- **Technologies**: Filter by tech stack
- **Employee Count**: Min/max employee range
- **Rating**: Minimum rating threshold
- **Remote Work**: Companies offering remote positions
- **Founded Year**: Date range filtering

### Search Functionality
- Real-time search with debouncing
- Search across multiple fields:
  - Company name
  - Description
  - Industry
  - Technologies
  - Tags
- Auto-suggestions and highlighting

### View Modes
- **Grid View**: Card-based layout with rich visuals
- **List View**: Compact list with essential information
- **Responsive**: Automatically adapts to screen size

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎣 Custom Hooks

This project includes a comprehensive set of custom React hooks for better code reusability and separation of concerns:

### Data Management Hooks
- **`useCompanies`** - Fetch and manage companies with filtering and pagination
- **`useCompany`** - Fetch a single company by ID
- **`useCompanyMutations`** - Handle CRUD operations (create, update, delete)
- **`useFilterOptions`** - Fetch available filter options
- **`useCompanySearch`** - Search companies with debouncing

### Utility Hooks
- **`useAsync`** - Handle async operations with loading states
- **`useForm`** - Form state management with validation
- **`useModal`** - Modal state management (open/close/toggle)
- **`usePagination`** - Pagination logic and controls
- **`useLocalStorage`** - Persistent local storage state
- **`useDebounce`** - Debounce values to prevent excessive API calls
- **`useTheme`** - Dark/light theme management
- **`useInfiniteScroll`** - Infinite scrolling implementation
- **`useWindowSize`** - Track window size changes
- **`useClickOutside`** - Handle clicks outside elements
- **`useKeyboardShortcut`** - Handle keyboard shortcuts

### Usage Example
```tsx
import { useCompanies, useModal, useDebounce } from './hooks';

const MyComponent = () => {
  const { companies, loading, updateFilters } = useCompanies();
  const { isOpen, openModal, closeModal } = useModal();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    updateFilters({ searchTerm: debouncedSearch });
  }, [debouncedSearch]);

  return (
    // Component JSX
  );
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Add proper JSDoc comments
- Test thoroughly across devices
- Maintain consistent code style

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Images by [Unsplash](https://unsplash.com/)
- Built with [Vite](https://vitejs.dev/)