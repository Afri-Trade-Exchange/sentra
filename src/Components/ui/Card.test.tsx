import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Card from './Card';

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>Hello world</Card>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('applies the requested padding size', () => {
    render(<Card padding="sm">content</Card>);
    expect(screen.getByText('content')).toHaveClass('p-4');
  });

  it('defaults to large padding and merges extra classes', () => {
    render(<Card className="col-span-2">content</Card>);
    const el = screen.getByText('content');
    expect(el).toHaveClass('p-6');
    expect(el).toHaveClass('col-span-2');
  });
});
