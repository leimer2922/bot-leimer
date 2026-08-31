const { Client, LocalAuth } = require('whatsapp-web.js');

let botActivo = true;

const client = new Client({
    authStrategy: new LocalAuth({ 
        dataPath: '/app/.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

client.on('qr', async (qr) => {
    console.log('Generando codigo para 573004005697...');
    try {
        const code = await client.requestPairingCode("573004005697");
        console.log("==============================================");
        console.log("TU CODIGO ES: " + code);
        console.log("==============================================");
        console.log("Ve a WhatsApp > Dispositivos vinculados > Vincular con numero");
        console.log("==============================================");
    } catch(err){
        console.log("Error generando codigo: ", err.message);
    }
});

client.on('ready', () => {
    console.log('¡Bot Leimer 24/7 LISTO! Ya puedes cerrar el VS');
});

client.on('message', async msg => {
    const texto = msg.body.toLowerCase().trim();

    // COMANDOS DE CONTROL
    if(texto === 'bot off'){
        botActivo = false;
        msg.reply('Bot apagado 🔴 Ya no responderé. Escribe *bot on* para activarme.');
        return;
    }
    if(texto === 'bot on'){
        botActivo = true;
        msg.reply('Bot encendido 🟢 Ya estoy activo de nuevo.');
        return;
    }

    // Si esta apagado, no hace nada
    if(!botActivo) return;

    // TUS RESPUESTAS DEL BOT AQUI
    if(texto === 'hola'){
        msg.reply('Hola soy el asistente de leimer, chatbot 24/7 activo 🔥');
    }
});

client.initialize();