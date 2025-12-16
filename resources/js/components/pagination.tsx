import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null; // Don't show if only Prev/Next and no pages or just 1 page

    return (
        <div className="flex flex-wrap justify-center gap-2 mt-8">
            {links.map((link, key) => (
                link.url === null ? (
                    <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground"
                        disabled
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link key={key} href={link.url} preserveScroll>
                        <Button
                            variant={link.active ? "default" : "outline"}
                            size="sm"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    </Link>
                )
            ))}
        </div>
    );
}
