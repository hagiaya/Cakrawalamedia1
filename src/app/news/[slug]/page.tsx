import { Metadata } from 'next';
import { articles, categories } from '@/lib/data';
import ClientPage from './ClientPage';

type Props = {
    params: { slug: string | string[] };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props
): Promise<Metadata> {
    const slugValue = params?.slug;
    const slug = (Array.isArray(slugValue) ? slugValue[0] : slugValue) || '';

    // Check if category
    const categoryMatch = categories.find(c => c.toLowerCase() === slug.toLowerCase());
    if (categoryMatch) {
        return {
            title: `${categoryMatch} News - WebCakrawala`,
            description: `Latest news and updates from ${categoryMatch} category`,
        }
    }

    // Check if article
    const article = articles.find(a => a.id === slug);
    if (article) {
        return {
            title: article.title,
            description: article.excerpt,
            openGraph: {
                images: [article.image],
            },
        }
    }

    return {
        title: 'WebCakrawala News',
        description: 'Trusted news source'
    }
}

export default function Page() {
    return <ClientPage />;
}
