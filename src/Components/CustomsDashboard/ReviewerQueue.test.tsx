import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { watchAssignedPackets } from '../../firebase/documentPacket';
import type { AssignedPacket } from '../../firebase/documentPacket';
import ReviewerQueue from './ReviewerQueue';

vi.mock('../../firebase/documentPacket', () => ({ watchAssignedPackets: vi.fn() }));

it('shows each assigned packet in one view and moves it after a resubmission', () => {
  let receive: (packets: AssignedPacket[]) => void = () => {};
  const unsubscribe = vi.fn();
  vi.mocked(watchAssignedPackets).mockImplementation((_, next) => {
    receive = next;
    return unsubscribe;
  });
  const open = vi.fn();
  const { unmount } = render(<ReviewerQueue reviewerId="reviewer-one" consignments={[]} onOpen={open} />);
  expect(watchAssignedPackets).toHaveBeenCalledWith('reviewer-one', expect.any(Function), expect.any(Function));

  const packets: AssignedPacket[] = [
    { consignmentId: 'first', version: 1, status: 'submitted' },
    { consignmentId: 'corrected', version: 2, status: 'submitted' },
    { consignmentId: 'waiting', version: 1, status: 'correction_requested' },
    { consignmentId: 'complete', version: 2, status: 'ready_to_file' },
  ];
  act(() => receive(packets));
  const packetList = () => within(screen.getByRole('list'));

  expect(packetList().getByRole('button', { name: 'Review document packet first' })).toBeVisible();
  expect(packetList().getAllByRole('listitem')).toHaveLength(1);
  fireEvent.click(screen.getByRole('radio', { name: 'Resubmitted 1' }));
  fireEvent.click(packetList().getByRole('button', { name: 'Review document packet corrected' }));
  expect(open).toHaveBeenCalledWith('corrected');
  fireEvent.click(screen.getByRole('radio', { name: 'Waiting on trader 1' }));
  expect(packetList().getByRole('button', { name: 'Review document packet waiting' })).toBeVisible();
  fireEvent.click(screen.getByRole('radio', { name: 'Ready to file 1' }));
  expect(packetList().getByRole('button', { name: 'Review document packet complete' })).toBeVisible();

  act(() => receive(packets.map(packet => packet.consignmentId === 'waiting'
    ? { ...packet, status: 'submitted', version: 2 } : packet)));
  fireEvent.click(screen.getByRole('radio', { name: 'Waiting on trader 0' }));
  expect(screen.getByText('No packets are waiting for corrections.')).toBeVisible();
  fireEvent.click(screen.getByRole('radio', { name: 'Resubmitted 2' }));
  expect(packetList().getByRole('button', { name: 'Review document packet waiting' })).toBeVisible();
  unmount();
  expect(unsubscribe).toHaveBeenCalledOnce();
});
