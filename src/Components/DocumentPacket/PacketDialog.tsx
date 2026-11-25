import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import {
  downloadPacketFile, PACKET_FILE_TYPES, reviewPacket, submitPacket,
  watchPacket, watchPacketRevisions,
} from '../../firebase/documentPacket';
import type { DocumentPacket, PacketDecision, PacketRevision } from '../../firebase/documentPacket';

const labels = {
  submitted: 'Awaiting review',
  correction_requested: 'Corrections requested',
  ready_to_file: 'Ready to file',
};

const action = 'rounded-lg bg-teal-700 px-4 py-2 text-white hover:bg-teal-800 disabled:opacity-50';
const field = 'w-full rounded-lg border border-gray-400 bg-white p-2 text-gray-900 dark:bg-gray-900 dark:text-gray-100';

export default function PacketDialog({ consignmentId, mode, onClose }: {
  consignmentId: string;
  mode: 'trader' | 'reviewer';
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const qr = useRef<HTMLCanvasElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const title = useId();
  const [packet, setPacket] = useState<DocumentPacket | null>();
  const [revisions, setRevisions] = useState<PacketRevision[]>([]);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [reviewerId, setReviewerId] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  useEffect(() => {
    return watchPacket(consignmentId, setPacket, () =>
      setLoadError(mode === 'reviewer'
        ? 'Unable to open the packet. It must be submitted and assigned to your reviewer ID.'
        : 'Unable to load the packet. Close this window and try again.'));
  }, [consignmentId, mode]);

  const hasPacket = Boolean(packet);
  useEffect(() => {
    if (hasPacket) {
      return watchPacketRevisions(consignmentId, setRevisions, () =>
        setLoadError('Unable to load packet versions. Close this window and try again.'));
    }
  }, [consignmentId, hasPacket]);

  useEffect(() => {
    if (error) errorMessage.current?.focus();
  }, [error]);

  async function perform(message: string, operation: () => Promise<void>) {
    setError('');
    setBusy(message);
    try {
      await operation();
    } catch (failure) {
      const code = (failure as { code?: string } | null)?.code;
      if (code === 'permission-denied') {
        setError('This change was denied. Check the reviewer ID or reopen the packet to see its latest status.');
      } else if (code?.startsWith('storage/')) {
        setError('File transfer failed. Try again or ask your administrator to check storage access.');
      } else {
        setError(failure instanceof Error ? failure.message : 'Unable to complete this action.');
      }
    } finally {
      setBusy('');
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('packetFiles');
    if (!(input instanceof HTMLInputElement) || packet === undefined || busy) return;
    const files = Array.from(input.files ?? []);
    void perform('Uploading documents…', async () => {
      await submitPacket(consignmentId, packet?.reviewerId ?? reviewerId.trim(), files, packet);
      form.reset();
    });
  }

  function decide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!packet || busy) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const status: PacketDecision = submitter instanceof HTMLButtonElement && submitter.value === 'ready_to_file'
      ? 'ready_to_file' : 'correction_requested';
    void perform('Saving review…', async () => {
      await reviewPacket(consignmentId, packet, status, reason);
      setReason('');
    });
  }

  function download(revision: PacketRevision, index: number) {
    void perform('Downloading document…', async () => {
      const blob = await downloadPacketFile(consignmentId, revision, index);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = revision.fileNames[index];
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    });
  }

  function downloadQr() {
    void perform('Preparing QR code…', async () => {
      const canvas = qr.current;
      if (!canvas) return;
      const pdf = new jsPDF();
      pdf.text('Sentra document packet', 20, 22);
      pdf.setFontSize(11);
      pdf.text(`Consignment: ${consignmentId}`, 20, 32);
      pdf.addImage(canvas.toDataURL(), 'PNG', 65, 44, 80, 80);
      pdf.text('Scan from the clearing dashboard using the assigned reviewer account.', 20, 140);
      pdf.save(`consignment-${consignmentId}.pdf`);
    });
  }

  const canSubmit = mode === 'trader' && (packet === null || packet?.status === 'correction_requested');
  const canReview = mode === 'reviewer' && packet?.status === 'submitted'
    && revisions.some((revision) => revision.id === packet.revisionId);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={title}
      onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/60 dark:bg-gray-800 dark:text-gray-100"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 id={title} className="text-xl font-semibold">Document packet</h2>
        <button type="button" disabled={Boolean(busy)} onClick={onClose}>Close</button>
      </div>
      {loadError ? <p role="alert">{loadError}</p> : <>
        <p role="status" className="mb-3">
          {packet === undefined ? 'Loading packet…' : packet ? `Version ${packet.version} · ${labels[packet.status]}` : 'No documents submitted.'}
          {busy && <span className="block">{busy}</span>}
        </p>
        {error && <p ref={errorMessage} tabIndex={-1} role="alert" className="mb-3 text-red-700 dark:text-red-300">{error}</p>}
        {revisions.length > 0 && (
          <ol className="my-4 space-y-3">
            {revisions.map((revision) => (
              <li key={revision.id} className="rounded-lg border border-gray-300 p-3 dark:border-gray-600">
                <h3 className="font-semibold">Version {revision.version}{revision.id === packet?.revisionId ? ' · Current' : ''}</h3>
                {revision.submittedAt && <p className="text-sm">Submitted {revision.submittedAt.toDate().toLocaleString()}</p>}
                <ul className="my-2 space-y-1">
                  {revision.fileNames.map((name, index) => (
                    <li key={index}>
                      <button type="button" className="break-all text-left underline" disabled={Boolean(busy)} onClick={() => download(revision, index)}>
                        Download {name}
                      </button>
                    </li>
                  ))}
                </ul>
                {revision.decision && <div>
                  <p className="font-medium">{labels[revision.decision.status]}</p>
                  {revision.decision.at && <p className="text-sm">Reviewed {revision.decision.at.toDate().toLocaleString()}</p>}
                  {revision.decision.reason && <p className="whitespace-pre-wrap break-words">{revision.decision.reason}</p>}
                </div>}
              </li>
            ))}
          </ol>
        )}
        {canSubmit && (
          <form method="post" onSubmit={submit} className="space-y-3">
            <fieldset disabled={Boolean(busy)} className="space-y-3">
              <legend className="font-semibold">{packet ? 'Submit corrected packet' : 'Submit documents for review'}</legend>
              {!packet && <label className="block">
                Reviewer ID (required)
                <input name="reviewerId" autoComplete="off" autoCapitalize="none" spellCheck={false}
                  maxLength={128} required value={reviewerId} onChange={(event) => setReviewerId(event.target.value)}
                  className={field} />
                <span className="block text-sm">Ask your clearing agent for their Sentra reviewer ID.</span>
              </label>}
              <label className="block">
                Packet files (required)
                <input name="packetFiles" type="file" multiple required accept={PACKET_FILE_TYPES.join(',')} className={field} />
                <span className="block text-sm">
                  {packet && 'Include the complete packet, including any unchanged files. '}
                  Up to 10 PDF, JPEG or PNG files, 10 MB each.
                </span>
              </label>
              <button type="submit" className={action}>{packet ? 'Resubmit packet' : 'Submit packet'}</button>
            </fieldset>
          </form>
        )}
        {canReview && (
          <form method="post" onSubmit={decide} className="space-y-3">
            <fieldset disabled={Boolean(busy)} className="space-y-2">
              <legend className="font-semibold">Review version {packet.version}</legend>
              <label className="block">
                Review note (required for corrections)
                <textarea name="reason" maxLength={1000} rows={3} value={reason}
                  onChange={(event) => setReason(event.target.value)} className={field} />
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="submit" value="correction_requested" className={action}>Request corrections</button>
                <button type="submit" value="ready_to_file" className={action}>Mark ready to file</button>
              </div>
            </fieldset>
          </form>
        )}
        {mode === 'trader' && packet && (
          <details className="mt-4">
            <summary className="cursor-pointer font-medium">Share consignment QR code</summary>
            <QRCodeCanvas ref={qr} value={JSON.stringify({ consignmentId })} size={160} marginSize={4}
              title="Consignment QR code for the assigned reviewer" className="my-2" />
            <button type="button" onClick={downloadQr} disabled={Boolean(busy)} className={action}>Download QR PDF</button>
          </details>
        )}
      </>}
    </dialog>
  );
}
