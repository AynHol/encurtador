"use client";
import { useState } from "react";
import styles from "./page.module.css";
import axios from "axios";

export default function Home() {
    const [customize, setCustomize] = useState<boolean>(false);
    const [originalLink, setOriginalLink] = useState<string>("");
    const [linkCustomize, setLinkCustomize] = useState<string>("");
    const [shortLink, setShortLink] = useState<string>("");
    const [base64, setBase64] = useState<string>("");

    function handleValue(value: boolean) {
        setCustomize(value);
        setLinkCustomize("");
    }

    async function handleSubmit() {
        const shortId = customize && !!linkCustomize ? linkCustomize : null;
        const body = {
            url: originalLink,
            shortId: shortId,
        };
        const response = await axios.post("http://localhost:5500/shorten", body);
        setShortLink(`http://localhost:3000/${response.data.shortId}`);
    }

    async function handleSubmitQRCode() {
        const body = {
            url: originalLink,
        };

        const response = await axios.post("http://localhost:5500/qr-code", body);
        setBase64(response.data.base64);
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Encurtador de Link e Gerador de QRCode</h1>
                <input type="text" placeholder="Colar o link..." value={originalLink} onChange={(e) => setOriginalLink(e.target.value)} />

                <div className={styles.customizeLinks}>
                    <span>Customizar URL:</span>
                    <input type="checkbox" checked={customize} onChange={(e) => handleValue(e.target.checked)} />
                    <input type="text" placeholder="Link customizado..." value={linkCustomize} onChange={(e) => setLinkCustomize(e.target.value)} disabled={!customize} />
                </div>

                <div className={styles.buttonGroup}>
                    <button onClick={handleSubmit}>Encurtar Link</button>
                    <button onClick={handleSubmitQRCode}>Gerar QRCode</button>
                </div>
            </div>

            <div className={styles.content}>
                <h1>LINK CURTO: {shortLink}</h1>
                {!!base64 && <img src={base64} />}
            </div>
        </div>
    );
}
