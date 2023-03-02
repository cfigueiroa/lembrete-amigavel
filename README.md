# Seja bem-vindo ao "Lembrete Amigável"!

Este é um bot de lembrete para eventos baseado no WhatsApp, que usa a biblioteca [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js). Ele se conecta ao WhatsApp Web, lê um arquivo ICS de uma URL especificada e agenda lembretes para eventos futuros.

## Instalação

Para usar este bot, você precisará ter o [Node.js](https://nodejs.org/en/download/) instalado em seu computador. Em seguida, siga os seguintes passos:

1. Clone este repositório para sua máquina local:

`git clone https://github.com/cfigueiroa/lembrete-amigavel.git`

2. Navegue até a pasta do projeto:

`cd lembrete-amigavel`

3. Instale as dependências usando o npm:

`npm install`

4. Renomeie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente necessárias:

```
GROUP_ID=<id do grupo no WhatsApp>
ICS_FILE_URL=<url para o arquivo ICS>
REMINDER_TIME_IN_MINUTES=<tempo de antecedência para o lembrete, em minutos>
```

5. Execute o bot:

`npm start`

## Como funciona

O bot usa a biblioteca [ical.js](https://github.com/kewisch/ical.js) para ler o arquivo ICS da URL especificada e extrair informações sobre os eventos futuros. Em seguida, usa a biblioteca [node-schedule](https://github.com/node-schedule/node-schedule) para agendar um lembrete para cada evento com a antecedência especificada na variável de ambiente `REMINDER_TIME_IN_MINUTES`. Quando o tempo de lembrete chegar, o bot envia uma mensagem para o grupo especificado na variável de ambiente `GROUP_ID` usando a biblioteca [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).

## Contribuição

Se você deseja contribuir para este projeto, siga as seguintes etapas:

1. Clone o repositório:

`git clone https://github.com/cfigueiroa/lembrete-amigavel.git`

2. Crie uma branch para suas alterações:

`git checkout -b my-feature`

3. Faça as alterações e envie-as para a branch criada:

```
git add .
git commit -m "Adicionando minha nova funcionalidade"
git push origin my-feature
```

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais informações.
