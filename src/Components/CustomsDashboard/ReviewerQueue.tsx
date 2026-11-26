import { useEffect, useId, useState } from 'react';
import { watchAssignedPackets } from '../../firebase/documentPacket';
import type { AssignedPacket } from '../../firebase/documentPacket';
import type { Consignment } from '../../types/consignment';
import Card from '../ui/Card';

const views = [
  { id: 'new', label: 'New', empty: 'No first submissions to review.' },
  { id: 'resubmitted', label: 'Resubmitted', empty: 'No corrected packets to review.' },
  { id: 'waiting', label: 'Waiting on trader', empty: 'No packets are waiting for corrections.' },
  { id: 'ready', label: 'Ready to file', empty: 'No packets are ready to file.' },
] as const;

type QueueView = typeof views[number]['id'];

function queueView(packet: AssignedPacket): QueueView {
  switch (packet.status) {
    case 'correction_requested': return 'waiting';
    case 'ready_to_file': return 'ready';
    case 'submitted': return packet.version === 1 ? 'new' : 'resubmitted';
  }
}

export default function ReviewerQueue({ reviewerId, consignments, onOpen }: {
  reviewerId: string;
  consignments: Consignment[];
  onOpen: (consignmentId: string) => void;
}) {
  const viewName = useId();
  const [selectedView, setSelectedView] = useState<QueueView>('new');
  const [packets, setPackets] = useState<AssignedPacket[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => watchAssignedPackets(reviewerId, setPackets, () => {
    setPackets(null);
    setLoadFailed(true);
  }), [reviewerId, attempt]);

  const groups: Record<QueueView, AssignedPacket[]> = { new: [], resubmitted: [], waiting: [], ready: [] };
  for (const packet of packets ?? []) {
    groups[queueView(packet)].push(packet);
  }

  const consignmentById = new Map(consignments.map((item) => [item.id, item]));
  const visible = groups[selectedView];

  return (
    <Card>
      {loadFailed ? (
        <div className="space-y-2">
          <p role="alert">Unable to load your assigned packets.</p>
          <button type="button" className="text-teal-700 underline dark:text-teal-300"
            onClick={() => { setLoadFailed(false); setAttempt((value) => value + 1); }}>
            Try again
          </button>
        </div>
      ) : packets === null ? (
        <p role="status">Loading assigned packets…</p>
      ) : (
        <>
          <fieldset className="mb-4">
            <legend className="sr-only">Filter assigned packets by status</legend>
            <div className="flex flex-wrap gap-2">
              {views.map((view) => (
                <label key={view.id} className="cursor-pointer">
                  <input type="radio" name={viewName} value={view.id} checked={selectedView === view.id}
                    onChange={() => setSelectedView(view.id)} className="peer sr-only" />
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 peer-checked:border-teal-700 peer-checked:bg-teal-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600 peer-focus-visible:ring-offset-2 dark:border-gray-600 dark:text-gray-100">
                    {view.label} <span className="tabular-nums">{groups[view.id].length}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <p role="status" className="sr-only">
            {visible.length} {visible.length === 1 ? 'packet' : 'packets'} in {views.find(view => view.id === selectedView)?.label}
          </p>

          {visible.length === 0 ? (
            <p className="py-4 text-sm text-gray-600 dark:text-gray-300">
              {views.find(view => view.id === selectedView)?.empty}
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {visible.map((packet) => {
                const consignment = consignmentById.get(packet.consignmentId);
                const reference = consignment?.declarationNumber || packet.consignmentId;
                return (
                  <li key={packet.consignmentId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="break-words font-medium">{reference}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {consignment?.traderName && `${consignment.traderName} · `}Version {packet.version}
                      </p>
                    </div>
                    <button type="button" onClick={() => onOpen(packet.consignmentId)}
                      aria-label={`Review document packet ${reference}`}
                      className="min-h-11 rounded-lg border border-teal-700 px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-gray-700">
                      Review document packet
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </Card>
  );
}
