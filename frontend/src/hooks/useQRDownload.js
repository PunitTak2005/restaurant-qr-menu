import { useRef } from "react";
import html2canvas from "html2canvas";

export default function useQRDownload() {
  const ref = useRef();
  const downloadQR = () => {
    html2canvas(ref.current).then((canvas) => {
      const url = canvas.toDataURL();
      const link = document.createElement("a");
      link.download = "qr.png";
      link.href = url;
      link.click();
    });
  };
  return [ref, downloadQR];
}
