import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateNews from '../create';
import { vi } from 'vitest';
import React from 'react';

// Mock Inertia
vi.mock('@inertiajs/react', () => ({
    useForm: ({ title, content, ...initialValues }: any) => ({
        data: { title, content, ...initialValues },
        setData: vi.fn(),
        post: vi.fn(),
        processing: false,
        errors: {},
    }),
    Head: ({ title }: any) => <title>{title}</title>,
}));

vi.mock('@/layouts/app-layout', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

// Mock simple components to avoid complex rendering issues in unit test
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/image-upload', () => ({
    ImageUpload: () => <div>Image Upload Mock</div>,
    MultiImageUpload: () => <div>Multi Image Upload Mock</div>,
}));

vi.mock('@/components/rich-text-editor', () => ({
    default: ({ value, onChange, label }: any) => (
        <div>
            <label>{label}</label>
            <textarea
                data-testid="rich-text-editor"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    ),
}));

describe('CreateNews Page', () => {
    const mockCategories = [
        { id: 1, name: 'Technology', slug: 'technology' },
        { id: 2, name: 'Science', slug: 'science' },
    ];

    it('renders the create news form correctly', () => {
        render(<CreateNews categories={mockCategories as any} type="news" />);

        expect(screen.getByText('Create New Article')).toBeInTheDocument();
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument(); // From Valid RichTextEditor mock
        expect(screen.getByText('Create Article')).toBeInTheDocument();
    });

    it('renders the create hero article form correctly when type is hero', () => {
        render(<CreateNews categories={mockCategories as any} type="hero" />);

        expect(screen.getByText('Create New Hero Article')).toBeInTheDocument();
    });

    // Note: Since we rely heavily on Inertia's useForm hook which we mocked 
    // to include internal state logic in a simplified way, 
    // deep integration testing of state updates relies on the mock implementation.
    // Real integration tests would use Cypress or Playwright.
    // Here we verify the component structure and successful rendering.
});
