# dwsim
Developer Week Simulator

## Alternanza Scuola Lavoro 2018

Questo è il centro stella che mette a disposizione via REST una serie di informazioni

E' stato richiesto ai ragazzi di quarta informatica di costruire tre programmi, che gestiscano in modo estremamente semplificato questi argomenti:

1. Anagrafica Clienti
2. Fatture Clienti
3. Registrazioni contabili Clienti

Ogni progetto dovrebbe mettere a disposizione degli altri due i propri dati via chiamate REST

Ogni progetto dovrebbe recuperare dagli altri due i dati del cliente e presentarli in un unica situazione

## Tecnologia

* NodeJS
* Express
* Google Application Engine

## Utilizzo

`npm start`

poi aprire il browser su http://localhost:8080

## Deploy su Google Application Engine

`gcloud app deploy --project` codiceprogetto

### Nota Bene

il CORS è stato disabilitato, nei commenti si vede la parte da remmare per riattivarlo
