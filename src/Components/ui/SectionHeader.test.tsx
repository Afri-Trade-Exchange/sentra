import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SectionHeader from './SectionHeader';

describe('SectionHeader', () => {
  it('renders the title', () => {
    render(<SectionHeader title="Shipments" />);
    expect(screen.getByRole('heading', { name: 'Shipments' })).toBeInTheDocument();
  });

  it('renders the action alongside the title', () => {
    render(<SectionHeader title="Shipments" action={<button>Add</button>} />);
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });
});
