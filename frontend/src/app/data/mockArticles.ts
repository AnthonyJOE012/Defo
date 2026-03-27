export type ArticleCategory = "Design News" | "Paper" | "Design Award";

export interface Article {
  id: string;
  title: string;
  description: string;
  category: ArticleCategory;
  date: string; // YYYY-MM-DD format
  imageUrl: string;
}

// Generate articles for March 2026
export const mockArticles: Article[] = [
  // March 1
  { id: "1", title: "The Future of Minimalist Design in 2026", description: "Exploring how minimalist design principles are evolving in the modern digital landscape.", category: "Design News", date: "2026-03-01", imageUrl: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGVzaWduJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3NDU3MjYyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  
  // March 2
  { id: "2", title: "Color Theory Research Paper", description: "An in-depth analysis of color psychology and its impact on user experience design.", category: "Paper", date: "2026-03-02", imageUrl: "https://images.unsplash.com/photo-1667242197579-10b000f004da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvciUyMHRoZW9yeSUyMHBhbGV0dGV8ZW58MXx8fHwxNzc0NjAwNjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "3", title: "Breaking: New Design System Released", description: "Major tech company unveils comprehensive design system for modern applications.", category: "Design News", date: "2026-03-02", imageUrl: "https://images.unsplash.com/photo-1769149068959-b11392164add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBzeXN0ZW0lMjBjb21wb25lbnRzfGVufDF8fHx8MTc3NDU5MjIzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  
  // March 3
  { id: "4", title: "Red Dot Award Winners 2026", description: "This year's Red Dot Award celebrates the most innovative product designs.", category: "Design Award", date: "2026-03-03", imageUrl: "https://images.unsplash.com/photo-1614036417651-efe5912149d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZGVzaWduJTIwYXdhcmR8ZW58MXx8fHwxNzc0NjAwNjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  
  // March 4
  { id: "5", title: "Typography Trends for Mobile Apps", description: "Latest trends in mobile typography and how they improve readability.", category: "Design News", date: "2026-03-04", imageUrl: "https://images.unsplash.com/photo-1663000805988-1f83a6492b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjB0eXBvZ3JhcGh5fGVufDF8fHx8MTc3NDYwMDY4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  
  // March 5
  { id: "6", title: "UX Research Methodology Paper", description: "Comprehensive guide to conducting effective user experience research in 2026.", category: "Paper", date: "2026-03-05", imageUrl: "https://images.unsplash.com/photo-1582601231162-132ca60713d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwZXhwZXJpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc3NDUyMTg1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  
  // March 6
  { id: "7", title: "Accessibility in Modern Web Design", description: "Essential principles for creating accessible and inclusive web experiences.", category: "Design News", date: "2026-03-06", imageUrl: "https://images.unsplash.com/photo-1762798973828-ca7294a61281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBhY2Nlc3NpYmlsaXR5JTIwZGVzaWdufGVufDF8fHx8MTc3NDYwMDY4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  
  // March 7
  { id: "8", title: "IF Design Award Ceremony Highlights", description: "Coverage of the prestigious IF Design Award ceremony and winning projects.", category: "Design Award", date: "2026-03-07", imageUrl: "https://images.unsplash.com/photo-1656761961894-117269b59278?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBhd2FyZCUyMGNlcmVtb255fGVufDF8fHx8MTc3NDYwMDY4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  
  // March 8 (today)
  { id: "9", title: "AI-Powered Design Tools Revolution", description: "How artificial intelligence is transforming the design workflow and creativity.", category: "Design News", date: "2026-03-08", imageUrl: "https://images.unsplash.com/photo-1711723774084-df734aaae53e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZGVzaWdufGVufDF8fHx8MTc3NDYwMDY4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "10", title: "Interaction Design Patterns Study", description: "Research on effective interaction patterns in mobile and web applications.", category: "Paper", date: "2026-03-08", imageUrl: "https://images.unsplash.com/photo-1723283207299-aa59d7b17275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmFjdGlvbiUyMGRlc2lnbiUyMHBhdHRlcm5zfGVufDF8fHx8MTc3NDYwMDY4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  
  // March 9
  { id: "11", title: "Sustainable Design Practices", description: "Environmental considerations in modern product and graphic design.", category: "Design News", date: "2026-03-09", imageUrl: "https://images.unsplash.com/photo-1755124130062-891f856c8a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGRlc2lnbiUyMHByYWN0aWNlc3xlbnwxfHx8fDE3NzQ2MDA2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  
  // March 10
  { id: "12", title: "Design Sprint Methodology Research", description: "Academic paper on the effectiveness of design sprints in product development.", category: "Paper", date: "2026-03-10", imageUrl: "https://images.unsplash.com/photo-1647013302881-3f19103fd9f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBzcHJpbnQlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NzQ2MDA2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
];

// Helper function to get articles by date
export function getArticlesByDate(date: string): Article[] {
  return mockArticles.filter(article => article.date === date);
}

// Helper function to get articles by category
export function getArticlesByCategory(category: ArticleCategory | "all"): Article[] {
  if (category === "all") return mockArticles;
  return mockArticles.filter(article => article.category === category);
}

// Helper function to get dates that have articles
export function getDatesWithArticles(): string[] {
  return [...new Set(mockArticles.map(article => article.date))];
}

// Helper function to get article count by category
export function getArticleCountByCategory(category: ArticleCategory | "all"): number {
  return getArticlesByCategory(category).length;
}