const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const P = require("pino")
let estadoBot = true
const MI_NUMERO = "573004005697"

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth")
    const sock = makeWASocket({ auth: state, logger: P({ level: "silent" }) })
    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async (u) => {
        const { connection } = u
        if (connection === 'open') console.log("✅ BOT 573004005697 CONECTADO PARA SIEMPRE")
        if (connection === 'close') start()
    })

    if (!sock.authState.creds.registered) {
        console.log("Generando tu UNICO codigo para 573004005697...")
        await new Promise(r => setTimeout(r, 5000))
        try {
            let code = await sock.requestPairingCode(MI_NUMERO)
            console.log("==============================")
            console.log("TU CODIGO UNICO ES:", code)
            console.log("==============================")
        } catch(e){ console.log("Espera 2 min:", e.message) }
    }

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        const from = msg.key.remoteJid
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").trim()
        const esOwner = from.includes(MI_NUMERO)

        if (text === ".off" && esOwner) { estadoBot = false; await sock.sendMessage(from, { text: "❌ Bot APAGADO. Escribe.on para encender" }); return }
        if (text === ".on" && esOwner) { estadoBot = true; await sock.sendMessage(from, { text: "✅ Bot ENCENDIDO" }); return }
        if (!estadoBot) return

        await sock.sendMessage(from, { text: "Bot activo 🤖. Escribe.off para apagar" })
    })
}
start()