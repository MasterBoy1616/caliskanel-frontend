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
        <img src="/logo-caliskanel.png"
