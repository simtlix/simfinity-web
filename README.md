

# Simfinity Web
> A Next.js web application for managing Simfinity API entities

This project provides a modern web interface for interacting with Simfinity GraphQL APIs. It was migrated from Direflow to Next.js for better performance, development experience, and maintainability.

## Features

- **Modern React Application**: Built with Next.js and React 17
- **Ant Design UI**: Beautiful and responsive user interface
- **GraphQL Integration**: Dynamic schema discovery and data management
- **Internationalization**: Multi-language support with react-intl
- **Entity Management**: CRUD operations for all API entities
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- **Node.js**: Version 18.17.0 or higher (recommended: Node.js 20+)
- **npm**: Package manager (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/simtlix/simfinity-web.git
   cd simfinity-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build the application for production
- `npm run start` - Start production server on port 3001
- `npm run lint` - Run ESLint for code quality

## Configuration

### GraphQL API Endpoint

The application connects to a GraphQL API. You can configure the endpoint in `pages/index.js`:

```javascript
export default function Home() {
  return <App url="http://localhost:3000/graphql" />;
}
```

### Default API

By default, the application connects to the Series Sample API at:
`https://multiscreen-techgroup.rj.r.appspot.com/graphql`

To use a different API, update the URL in `pages/index.js`.

## Project Structure

```
simfinity-web/
├── components/          # Main App component
├── pages/              # Next.js pages
│   ├── _app.js        # App wrapper with providers
│   ├── _document.js   # HTML document configuration
│   └── index.js       # Main page
├── src/
│   ├── components/     # Application components
│   │   ├── CRUD/      # CRUD operations
│   │   ├── Form/      # Form components
│   │   ├── Table/     # Table components
│   │   └── utils.js   # Utility functions
│   └── lang/          # Internationalization files
├── styles/            # Global styles
├── public/            # Static assets
└── next.config.js     # Next.js configuration
```

## Technology Stack

- **Framework**: Next.js 15.4.5
- **React**: 18.2.0
- **UI Library**: Ant Design 5.12.0
- **HTTP Client**: Axios 1.6.0
- **Internationalization**: react-intl 6.5.0
- **Date Handling**: Moment.js 2.29.4

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add pages in `pages/` directory
3. Update styles in `styles/globals.css`
4. Add translations in `src/lang/`

### Building for Production

```bash
npm run build
npm run start
```

## Migration from Direflow

This project was successfully migrated from Direflow to Next.js. The migration included:

- ✅ Complete removal of Direflow dependencies
- ✅ Migration to Next.js architecture
- ✅ Updated component structure
- ✅ Modern development workflow
- ✅ Improved build process
- ✅ Better performance and maintainability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the terms specified in the LICENSE file.

## Support

For support and questions, please open an issue on GitHub or contact the development team.
