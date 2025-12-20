// ======= CONFIG (edite aqui) =======
const SOLD_NUMBERS = 470;
const TOTAL_NUMBERS = 1000;
const CTA_LINK = "https://rifa.digital/s/pOFDjjBJABy";

// Prazo de venda: 10/01/2026 23:59:59 no horário de Brasília
// Observação: JS usa o timezone do dispositivo; isso funciona bem para a maior parte dos usuários no BR.
const SELL_DEADLINE = new Date(2026, 0, 10, 23, 59, 59); // mês 0 = janeiro

// ======= UI =======
const soldLabel = document.getElementById("soldLabel");
const remainingLabel = document.getElementById("remainingLabel");
const barFill = document.getElementById("barFill");

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function updateProgress() {
    const sold = clamp(SOLD_NUMBERS, 0, TOTAL_NUMBERS);
    const remaining = Math.max(0, TOTAL_NUMBERS - sold);
    const pct = (sold / TOTAL_NUMBERS) * 100;

    soldLabel.textContent = `Vendidos: ${sold}/${TOTAL_NUMBERS}`;
    remainingLabel.textContent = `Faltam: ${remaining}`;
    barFill.style.width = `${pct}%`;

    // destaca marcos alcançados
    const milestones = [
        { id: "ms400", n: 400 },
        { id: "ms600", n: 600 },
        { id: "ms800", n: 800 },
        { id: "ms1000", n: 1000 },
    ];
    milestones.forEach(ms => {
        const el = document.getElementById(ms.id);
        if (!el) return;
        if (sold >= ms.n) {
            el.style.borderStyle = "solid";
            el.style.borderColor = "rgba(34,197,94,.6)";
            el.style.background = "rgba(34,197,94,.12)";
        }
    });
}

function pad2(n) { return String(n).padStart(2, "0"); }

function updateCountdown() {
    const now = new Date();
    const diff = SELL_DEADLINE - now;

    const dEl = document.getElementById("d");
    const hEl = document.getElementById("h");
    const mEl = document.getElementById("m");
    const sEl = document.getElementById("s");

    if (diff <= 0) {
        dEl.textContent = "0";
        hEl.textContent = "00";
        mEl.textContent = "00";
        sEl.textContent = "00";
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    dEl.textContent = String(days);
    hEl.textContent = pad2(hours);
    mEl.textContent = pad2(mins);
    sEl.textContent = pad2(secs);
}

// Share
document.getElementById("shareBtn").addEventListener("click", async () => {
    const text = `🕊️ MISSÃO 1000 — “Age e Deus agirá!”\nR$ 10 por número • Prêmio R$ 500\nPrazo até 10/01/2026\n${CTA_LINK}`;
    try {
        if (navigator.share) {
            await navigator.share({ title: "Missão 1000", text, url: CTA_LINK });
        } else {
            await navigator.clipboard.writeText(text);
            alert("Mensagem copiada! Agora é só colar no WhatsApp 🙂");
        }
    } catch (e) {
        // fallback simples
        prompt("Copie e compartilhe:", text);
    }
});

// ======= Toggle oração =======
const togglePrayerBtn = document.getElementById("togglePrayerBtn");
const prayerContent = document.getElementById("prayerContent");

togglePrayerBtn.addEventListener("click", () => {
    const isHidden = prayerContent.classList.contains("hidden");

    if (isHidden) {
        prayerContent.classList.remove("hidden");
        prayerContent.classList.add("show");
        togglePrayerBtn.textContent = "Ocultar oração";
        togglePrayerBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        prayerContent.classList.remove("show");
        prayerContent.classList.add("hidden");
        togglePrayerBtn.textContent = "Ler oração";
    }
});



updateProgress();
updateCountdown();

setInterval(updateCountdown, 1000);
