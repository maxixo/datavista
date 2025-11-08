# DataVista - Offline-First Analytics Workspace

A high-performance web application for uploading, transforming, and visualizing datasets with full offline support.

## 🚀 Features

- **Secure Authentication** - Email/password login with persistent sessions
- **Large Dataset Support** - Handle up to 50,000 rows smoothly
- **Data Transformations** - Filter, sort, group, and aggregate data in real-time
- **Interactive Charts** - Bar, line, pie, and scatter plots with Recharts
- **Offline-First** - Full functionality without internet connection
- **Auto-Sync** - Changes sync automatically when connection is restored
- **Performance Optimized** - Virtual scrolling, web workers, and memoization

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Authentication**: Supabase
- **Storage**: IndexedDB + Service Workers
- **Data Processing**: PapaParse, Web Workers

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/datavista.git
cd datavista
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run this SQL to create the datasets table:

```sql
create table datasets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table datasets enable row level security;

-- Policy: Users can only see their own datasets
create policy "Users can view own datasets"
  on datasets for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own datasets
create policy "Users can insert own datasets"
  on datasets for insert
  with check (auth.uid() = user_id);
```

## 📊 Usage

1. **Upload Data**: Drag and drop CSV or JSON files (up to 50k rows)
2. **Transform**: Apply filters, sorting, and grouping
3. **Visualize**: Create charts with drag-and-drop axis selection
4. **Work Offline**: All features work without internet
5. **Auto-Sync**: Changes sync when connection returns

## 🏗️ Project Structure

```
datavista/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth pages
│   ├── dashboard/         # Main dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── data/             # Data-related components
│   ├── charts/           # Chart components
│   ├── transforms/       # Transform controls
│   ├── ui/               # Base UI components
│   └── layout/           # Layout components
├── lib/                   # Core utilities
│   ├── integrations/     # Third-party services
│   ├── storage/          # IndexedDB & sync
│   ├── data/             # Data processing
│   ├── hooks/            # Custom hooks
│   └── utils/            # Helper functions
├── types/                 # TypeScript types
├── workers/              # Web workers
└── public/               # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

## 🎥 Demo Video

[Link to your 2-4 minute demo video showing:]
- Authentication
- Data upload and preview
- Transformations
- Chart creation
- Offline mode
- Data synchronization

## 📝 License

MIT License - feel free to use this project for learning or production!

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/yourusername)

---

Built with ❤️ for the Stage 4C Challenge