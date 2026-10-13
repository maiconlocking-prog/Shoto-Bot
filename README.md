# Shoto-Bot

WhatsApp Bot modular construído com **zapo-js** (fork do Baileys).

## Características

- Sistema modular de comandos
- Anti-spam, anti-link, anti-mídia, auto-download, auto-sticker
- Menus interativos com botões preservados
- Suporte a grupos e privado
- Banco de dados em JSON
- Alta performance

## Instalação

```bash
git clone https://github.com/maiconlocking-prog/Shoto-Bot.git
cd Shoto-Bot
npm install
```

## Configuração

Edite `settings/settings.json`:

```json
{
  "bot": {
    "name": "Shoto-Bot",
    "prefix": "-"
  },
  "owner": {
    "name": "Seu Nome",
    "number": "5511999999999"
  },
  "api": {
    "provider": "waguri",
    "baseUrl": "https://hana-apis.xyz",
    "key": "SUA_CHAVE"
  }
}
```

## Iniciar

```bash
npm start
```

Escaneie o QR Code que aparecer no terminal.

## Estrutura

Veja `ESTRUTURA.md` para detalhes completos da estrutura do projeto.

## Scripts

- `npm start` - Inicia o bot
- `npm run dev` - Inicia com watch mode
- `npm run clean` - Limpa arquivos temporários

## Licença

MIT
