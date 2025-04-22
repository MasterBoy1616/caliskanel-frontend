import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdf(isim, plaka, marka, model, parts, toplamFiyat, ekstralar) {
  const doc = new jsPDF();

  // Başlıklar
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servisi", 20, 20);
  doc.setFontSize(14);
  doc.text("Araç Bakım Teklif Formu", 20, 30);

  // Müşteri Bilgileri
  doc.setFontSize(12);
  doc.text(`Müşteri: ${isim || "Belirtilmedi"}`, 20, 45);
  doc.text(`Plaka: ${plaka || "Belirtilmedi"}`, 20, 53);
  doc.text(`Marka: ${marka}`, 20, 61);
  doc.text(`Model: ${model}`, 20, 69);

  // Ürünler Tablosu
  autoTable(doc, {
    startY: 80,
    head: [["Ürün / İşçilik", "Adet", "Birim Fiyat (TL)", "Toplam (TL)"]],
    body: parts.map(p => [
      p.urun,
      p.adet,
      p.birim_fiyat.toLocaleString("tr-TR"),
      p.toplam.toLocaleString("tr-TR")
    ]),
    styles: { fontSize: 10, halign: 'center' },
    headStyles: { fillColor: [108, 99, 255] }, // Violet başlık rengi
  });

  // Ekstra Seçimler
  if (ekstralar.length > 0) {
    doc.setFontSize(12);
    doc.text("Ekstra Seçimler:", 20, doc.lastAutoTable.finalY + 15);
    ekstralar.forEach((ekstra, idx) => {
      doc.text(`- ${ekstra}`, 30, doc.lastAutoTable.finalY + 25 + idx * 7);
    });
  }

  // Toplam Tutar
  doc.setFontSize(14);
  doc.text(`Toplam Tutar: ${toplamFiyat.toLocaleString("tr-TR")} TL`, 20, doc.lastAutoTable.finalY + 50);

  // İletişim Bilgileri
  doc.setFontSize(12);
  const footerStart = doc.lastAutoTable.finalY + 70;
  doc.text("İletişim Bilgileri:", 20, footerStart);
  doc.text("Adres: 29 Ekim Mah. İzmir Yolu Cd No:384 Nilüfer / Bursa", 20, footerStart + 10);
  doc.text("Tel: 0224 443 57 88", 20, footerStart + 20);
  doc.text("WhatsApp: 0549 833 89 38", 20, footerStart + 30);
  doc.text("Email: caliskanel@boschservice.com.tr", 20, footerStart + 40);

  // QR kod iptal edildi!

  // PDF Kaydet
  doc.save(`Teklif_${marka}_${model}.pdf`);
}
