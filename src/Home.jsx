import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";
import "./SpotliraTheme.css";

function Home() {
  const [markalar, setMarkalar] = useState([]);
  const [modeller, setModeller] = useState([]);
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [parcalar, setParcalar] = useState([]);
  const [isim, setIsim] = useState("");
  const [plaka, setPlaka] = useState("");

  const API_BASE_URL = "https://caliskanel-bcs-teklif.onrender.com";

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/markalar`)
      .then((res) => setMarkalar(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (secilenMarka) {
      axios.get(`${API_BASE_URL}/api/modeller?marka=${encodeURIComponent(secilenMarka)}`)
        .then((res) => setModeller(res.data))
        .catch((err) => console.error(err));
    } else {
      setModeller([]);
    }
  }, [secilenMarka]);

  useEffect(() => {
    if (secilenMarka && secilenModel) {
      axios.get(`${API_BASE_URL}/api/parcalar?marka=${encodeURIComponent(secilenMarka)}&model=${encodeURIComponent(secilenModel)}`)
        .then((res) => setParcalar(res.data))
        .catch((err) => console.error(err));
    } else {
      setParcalar([]);
    }
  }, [secilenMarka, secilenModel]);

  const toplamFiyat = parcalar.reduce((acc, item) => acc + (item.toplam || 0), 0);

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

        <select
          value={secilenMarka}
          onChange={(e) => setSecilenMarka(e.target.value)}
          className="select"
        >
          <option value="">Marka Seçin</option>
          {markalar.map((marka, idx) => (
            <option key={idx} value={marka}>
              {marka}
            </option>
          ))}
        </select>

        <select
          value={secilenModel}
          onChange={(e) => setSecilenModel(e.target.value)}
          className="select"
          disabled={!secilenMarka}
        >
          <option value="">Model Seçin</option>
          {modeller.map((model, idx) => (
            <option key={idx} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {parcalar.length > 0 && (
        <>
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
              {parcalar.map((parca, idx) => (
                <tr key={idx}>
                  <td>{parca.urun}</td>
                  <td>{parca.adet}</td>
                  <td>{parca.birim_fiyat.toLocaleString()} TL</td>
                  <td>{parca.toplam.toLocaleString()} TL</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total">
            Toplam: {toplamFiyat.toLocaleString()} TL
          </div>

          <button
            className="button"
            onClick={() =>
              generatePdf(isim, plaka, secilenMarka, secilenModel, parcalar, toplamFiyat)
            }
          >
            PDF Teklif Oluştur
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
