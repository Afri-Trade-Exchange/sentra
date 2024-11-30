declare module 'react-qr-scanner' {
  import { Component } from 'react';

  interface QrScannerProps {
    onError: (error: unknown) => void;
    onScan: (data: string | null) => void;
    style?: React.CSSProperties;
  }

  export default class QrScanner extends Component<QrScannerProps> {}
}
