# Integração com o Telegram (seu bot)

O projeto usa **polling** do Telegraf: não é obrigatório HTTPS público; roda no seu PC ou servidor com saída para `api.telegram.org`.

## 1. Criar o bot no Telegram

1. Abra o Telegram e fale com [@BotFather](https://t.me/BotFather).
2. Envie `/newbot` e siga as instruções (nome + `@username` terminando em `bot`).
3. Copie o **token** que o BotFather envia (formato `123456789:AAH…`).

**Segurança:** não cole o token em chats, issues nem commits. Use só no arquivo `.env` local (já está no `.gitignore`).

## 2. Configurar `.env` na raiz do projeto

Na pasta `bot-rpg-telegram`:

```bash
cp .env.example .env   # se ainda não existir
```

Edite `.env`:

```env
DATABASE_URL="postgresql://rpg:rpg@localhost:5432/rpg?schema=public"
BOT_TOKEN=cole_aqui_o_token_sem_aspas
PORT=3000
```

- Espaços no início/fim do token são ignorados pelo app.
- Se o Postgres não for o do `docker-compose`, ajuste `DATABASE_URL`.

## 3. Subir o banco e a API

```bash
docker compose up -d
npm install
npx prisma migrate dev
npm run start:dev
```

No log você deve ver algo como **`Telegram bot em polling.`**  
Se aparecer **`BOT_TOKEN ausente`**, o Nest não leu o `.env` (caminho errado ou variável vazia).

## 4. Testar no Telegram

1. Abra uma conversa **privada** com o seu bot (recomendado em **M1** — criação de personagem usa mensagem de texto para o nome).
2. Envie **`/start`**.
3. Use **Criar personagem** e complete o fluxo; depois **`/personagem`** para ver a ficha.

## Problemas comuns

| Sintoma | O que fazer |
|--------|----------------|
| Bot não responde | Confirme token no `.env`; reinicie `npm run start:dev`; veja firewall/VPN bloqueando Telegram. |
| Erro de Prisma / DB | `docker compose ps`; Postgres na porta 5432; `DATABASE_URL` igual ao usuário/senha do compose. |
| `409 Conflict` / bot estranho | Outro processo usando o mesmo token — pare outra instância ou outro `npm run start:dev`. |
| Callback dos botões não faz nada | Use chat privado; em grupos M1 não foi validado. |
| Log `ETIMEDOUT` / `answerCallbackQuery` / `api.telegram.org` | Sua máquina não alcançou a API do Telegram (rede, firewall, VPN, DNS). Teste: `curl -I https://api.telegram.org`. O Nest pode reiniciar (`InstanceLoader` no log) por **watch mode** ou Ctrl+C — isso **não** é o bug; o bug é a rede até o Telegram. |

## Webhook (futuro)

Hoje é só **polling**. Para produção em servidor com HTTPS, dá para migrar para webhook depois (mudança em `BotService`).
