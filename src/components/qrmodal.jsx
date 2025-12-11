import { QRCodeCanvas } from 'qrcode.react';

export default function QRModal({ isOpen, onClose, url }) {
  if (!isOpen) return null;

  const downloadQR = () => {
    const canvas = document.getElementById('qr-gen');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode.png';
    downloadLink.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 w-[350px] text-center">
        <h2 className="text-xl font-semibold mb-4 text-white">
          QR Code Short Link
        </h2>

        <div className="flex justify-center mb-4">
          <QRCodeCanvas
            id="qr-gen"
            value={url}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>

        <p className="text-gray-300 break-all mb-4">{url}</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={downloadQR}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Download PNG
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
