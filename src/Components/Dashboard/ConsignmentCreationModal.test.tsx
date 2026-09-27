import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ConsignmentCreationModal from './ConsignmentCreationModal';

const addDocMock = vi.fn();
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'consignments-collection'),
  addDoc: (...args: unknown[]) => addDocMock(...args),
  Timestamp: { now: () => 'now' },
}));

vi.mock('../../firebase/firebaseConfig', () => ({
  db: {},
}));

vi.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'trader-1', email: 'trader@example.com' } }),
}));

const renderModal = (onCreated = vi.fn(), onClose = vi.fn()) => {
  render(<ConsignmentCreationModal isOpen onClose={onClose} onCreated={onCreated} />);
  return { onCreated, onClose };
};

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByPlaceholderText('Enter trader name'), 'Acme Traders');
  await user.type(screen.getByPlaceholderText('Describe the goods in detail'), 'Ten crates of ceramic tiles');
  const valueInput = screen.getByPlaceholderText('Enter estimated value');
  await user.clear(valueInput);
  await user.type(valueInput, '500');
};

describe('ConsignmentCreationModal validation', () => {
  beforeEach(() => {
    addDocMock.mockReset();
  });

  it('shows validation errors and does not submit when fields are invalid', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: /Create Consignment/ }));

    expect(await screen.findByText('Trader name is required')).toBeInTheDocument();
    expect(screen.getByText('Description must be at least 10 characters')).toBeInTheDocument();
    expect(addDocMock).not.toHaveBeenCalled();
  });

  it('rejects a goods description shorter than 10 characters', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByPlaceholderText('Enter trader name'), 'Acme Traders');
    await user.type(screen.getByPlaceholderText('Describe the goods in detail'), 'too short');
    await user.click(screen.getByRole('button', { name: /Create Consignment/ }));

    expect(await screen.findByText('Description must be at least 10 characters')).toBeInTheDocument();
    expect(addDocMock).not.toHaveBeenCalled();
  });

  it('submits a valid form and hands the new id back to the caller', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    addDocMock.mockResolvedValueOnce({ id: 'new-consignment-id' });
    const user = userEvent.setup();
    const { onCreated } = renderModal();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /Create Consignment/ }));

    await waitFor(() =>
      expect(addDocMock).toHaveBeenCalledWith(
        'consignments-collection',
        expect.objectContaining({
          traderId: 'trader-1',
          traderName: 'Acme Traders',
          description: 'Ten crates of ceramic tiles',
          estimatedValue: 500,
        })
      )
    );

    expect(await screen.findByText('Consignment Created Successfully!')).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(1500);
    expect(onCreated).toHaveBeenCalledWith('new-consignment-id');
    vi.useRealTimers();
  });

  it('shows a submit error and keeps the form open when the save fails', async () => {
    addDocMock.mockRejectedValueOnce(new Error('network down'));
    const user = userEvent.setup();
    renderModal();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /Create Consignment/ }));

    expect(await screen.findByText('Failed to create consignment. Please try again.')).toBeInTheDocument();
    expect(screen.queryByText('Consignment Created Successfully!')).not.toBeInTheDocument();
  });
});
