import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";
import "./SpotliraTheme.css";

const API_URL = "https://caliskanel-bcs-teklif.onrender.com";

function Home() {
  const [markalar, setMarkalar] = useState([]);
  const [modeller, setModeller] = useState([]);
  const [selectedMarka, setSelectedMarka] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [ekstralar, setEkstralar] = useState([]);
  const [selectedEkstralar, setSelectedEkstralar] = useState([]);
  const [isim, setIsim] = useState("");
  const [plaka, setPlaka] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/markalar`)
      .then(res => setMarkalar(res.data))
      .catch(err => console.error(err));

    axios.get(`${API_URL}/api/ekstralar`)
      .then(res => setEkstralar(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleMarkaChange = (e) => {
    const marka = e.target.value;
    setSelectedMarka(marka);
    setSelectedModel("");
    setParts([]);
    if (marka) {
      setLoading(true);
      axios.get(`${API_URL}/api/modeller?marka=${encodeURIComponent(marka)}`)
        .then(res => {
          setModeller(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    if (selectedMarka && model) {
      setLoading(true);
      axios.get(`${API_URL}/api/parcalar?marka=${encodeURIComponent(selectedMarka)}&model=${encodeURIComponent(model)}`)
        .then(res => {
          setParts(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  const handleEkstraChange = (ekstra) => {
    let updated = [...selectedEkstralar];
    if (updated.includes(ekstra)) {
      updated = updated.filter(e => e !== ekstra);
    } else {
      updated.push(ekstra);
    }
    setSelectedEkstralar(updated);
  };

  const toplamFiyat = parts.reduce((acc, part) => acc + part.toplam, 0);

  return (
    <div className="container">
      <header className="header">
        <img src="/logo-caliskanel.png" alt="Caliskanel Logo" className="logo" />
        <img src="/logo-bosch.png" alt="Bosch Logo" className="logo" />
      </header>

      <div className="form">
        <input
          type="text"
          placeholder="İsim Soyisim"
          value={isim}
          onChange={(e) => setIsim(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Plaka"
          value={plaka}
          onChange={(e) => setPlaka(e.target.value)}
          className="input"
        />

        <select value={selectedMarka} onChange={handleMarkaChange} className="select">
          <option value="">Marka Seçin</option>
          {markalar.map((marka, idx) => (
            <option key={idx} value={marka}>{marka}</option>
          ))}
        </select>

        <select value={selectedModel} onChange={handleModelChange} className="select" disabled={!selectedMarka}>
          <option value="">Model Seçin</option>
          {modeller.map((model, idx) => (
            <option key={idx} value={model}>{model}</option>
          ))}
        </select>

        <div className="extras">
          {ekstralar.map((ekstra, idx) => (
            <label key={idx} className="extra-label">
              <input
                type="checkbox"
                checked={selectedEkstralar.includes(ekstra.ad)}
                onChange={() => handleEkstraChange(ekstra.ad)}
              />
              {ekstra.ad}
            </label>
          ))}
        </div>
      </div>

      {loading && <div className="loading">Yükleniyor...</div>}

      {parts.length > 0 && (
        <table className="price-table">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Adet</th>
              <th>Birim Fiyat</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part, idx) => (
              <tr key={idx}>
                <td>{part.urun}</td>
                <td>{part.adet}</td>
                <td>{part.birim_fiyat.toLocaleString()} TL</td>
                <td>{part.toplam.toLocaleString()} TL</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {parts.length > 0 && (
        <>
          <div className="total">
            Toplam: {toplamFiyat.toLocaleString()} TL
          </div>
          <button
            className="button"
            onClick={() => generatePdf(isim, plaka, selectedMarka, selectedModel, parts, toplamFiyat, selectedEkstralar)}
          >
            PDF Teklif Oluştur
          </button>
        </>
      )}

      <footer className="footer">
        <h3>Çalışkanel Bosch Car Servisi</h3>
        <p>Adres: 29 Ekim Mah. İzmir Yolu Cd No:384 Nilüfer / Bursa</p>
        <p>Tel: 0224 443 57 88 - WhatsApp: 0549 833 89 38</p>
        <p>Email: caliskanel@boschservice.com.tr</p>
        <a href="https://maps.app.goo.gl/sDn5JUQEQDKZuP5EA" target="_blank" rel="noopener noreferrer">
          Konum için tıklayın
        </a>
      </footer>
    </div>
  );
}

export default Home;
