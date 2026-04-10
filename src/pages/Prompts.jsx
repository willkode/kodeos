import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PromptCard from '../components/PromptCard';
import { Search, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const categories = [
  'Landing Pages',
  'Auth Flows',
  'Dashboards',
  'E-commerce',
  'Admin Panels',
  'Forms',
  'Real-time',
  'AI Integration',
  'Animations',
  'State Management'
];

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

export default function Prompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        const allPrompts = await base44.entities.Prompt.list('-created_date', 200);
        setPrompts(allPrompts);
      } catch (err) {
        console.error('Error loading prompts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filtered = prompts.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || p.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Navbar */}
      <nav className="border-b border-border/30 backdrop-blur-md bg-background/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold neon-glow font-mono">KodeOS</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button size="sm" variant="outline" onClick={() => base44.auth.logout()}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Prompt <span className="neon-glow">Library</span>
          </h1>
          <p className="text-muted-foreground">
            {filtered.length} prompts available • Organized by use case
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border/30"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-border/30">
                  Category {selectedCategory && `(${selectedCategory})`}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border/30">
                <DropdownMenuItem onClick={() => setSelectedCategory('')}>
                  All Categories
                </DropdownMenuItem>
                {categories.map(cat => (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'bg-primary/10' : ''}
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Difficulty Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-border/30">
                  Difficulty {selectedDifficulty && `(${selectedDifficulty})`}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border/30">
                <DropdownMenuItem onClick={() => setSelectedDifficulty('')}>
                  All Levels
                </DropdownMenuItem>
                {difficulties.map(diff => (
                  <DropdownMenuItem
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={selectedDifficulty === diff ? 'bg-primary/10' : ''}
                  >
                    {diff}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {(selectedCategory || selectedDifficulty || search) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                  setSelectedDifficulty('');
                }}
                className="border-primary/30"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No prompts found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}