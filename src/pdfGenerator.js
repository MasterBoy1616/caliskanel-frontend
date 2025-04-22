import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdf(isim, plaka, marka, model, parts, toplamFiyat, ekstralar) {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");

  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servisi - Bakım Teklifi", 20, 20);

  doc.setFontSize(12);
  doc.text(`Müşteri: ${isim}`, 20, 35);
  doc.text(`Plaka: ${plaka}`, 20, 43);
  doc.text(`Marka: ${marka}`, 20, 51);
  doc.text(`Model: ${model}`, 20, 59);

  autoTable(doc, {
    startY: 70,
    head: [["Ürün / İşçilik", "Adet", "Birim Fiyat (TL)", "Toplam (TL)"]],
    body: parts.map(p => [
      p.urun,
      p.adet,
      p.birim_fiyat.toLocaleString("tr-TR"),
      p.toplam.toLocaleString("tr-TR")
    ]),
    styles: { fontSize: 10, halign: 'center' },
    headStyles: { fillColor: [108, 99, 255] }, // Violet Başlık
  });

  if (ekstralar.length > 0) {
    doc.setFontSize(12);
    doc.text("Ekstra Seçimler:", 20, doc.lastAutoTable.finalY + 15);
    ekstralar.forEach((ekstra, idx) => {
      doc.text(`- ${ekstra}`, 30, doc.lastAutoTable.finalY + 25 + idx * 8);
    });
  }

  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(`Toplam Tutar: ${toplamFiyat.toLocaleString("tr-TR")} TL`, 20, doc.lastAutoTable.finalY + 50);

  doc.save(`Teklif_${marka}_${model}.pdf`);
}
