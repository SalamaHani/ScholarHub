# ScholarHub 🎓

A web platform designed to help students in Gaza and universities easily find scholarship opportunities that can open new doors for their academic and professional growth.

## 🚀 Features

- **Scholarship Discovery**: Browse 500+ scholarships from around the world
- **Smart Search & Filters**: Filter by country, degree level, funding type, and field of study
- **Deadline Tracking**: Never miss an application deadline with our organized system
- **Save Scholarships**: Bookmark opportunities for later review
- **Mobile Responsive**: Access from any device
- **Dark Mode Support**: Comfortable viewing in any environment

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/scholarhub.git
   cd scholarhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed with sample data (optional)
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
scholarhub/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   ├── scholarships/ # Scholarship pages
│   │   ├── about/        # About page
│   │   ├── contact/      # Contact page
│   │   └── saved/        # Saved scholarships
│   ├── components/
│   │   ├── layout/       # Navbar, Footer
│   │   ├── scholarships/ # Scholarship cards, filters
│   │   └── ui/           # shadcn/ui components
│   └── lib/
│       ├── prisma.ts     # Prisma client
│       └── utils.ts      # Utility functions
├── tailwind.config.ts    # Tailwind configuration
├── package.json          # Dependencies
└── README.md
```

## 🎨 Customization

### Colors
Edit `src/app/globals.css` to customize the theme colors:

```css
:root {
  --primary: 217 91% 60%;       /* Blue */
  --primary-foreground: 210 40% 98%;
  /* ... other colors */
}
```

### Components
All UI components are in `src/components/ui/` and follow shadcn/ui patterns.

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with sample data |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Made with Love

Made with ❤️ for students in Gaza 🇵🇸

---

**ScholarHub** - Opening doors to education, one scholarship at a time.
