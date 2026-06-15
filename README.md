# AI Customer Feedback Dashboard - INTP302

A web application where users submit customer feedback, receive AI-powered sentiment analysis, and view historical feedback records through a simple dashboard.

Built with Next.js, Azure AI Language Service, Azure Table Storage, and deployed using Azure App Service.

---
## Live Demo
**Deployed Application:**

https://luckyaisentiment-h5dxgpcbdtfqe0a7.canadacentral-01.azurewebsites.net/

---
## Setup

```bash
git clone https://github.com/helaniedom/midterm-ai-feedback.git

cd midterm-ai-feedback

npm install

npm run dev
```

Application runs locally at:

```text
http://localhost:3000
```

---

## Environment Variables

| Variable                        | Description                     |
| ------------------------------- | ------------------------------- |
| AZURE_LANGUAGE_ENDPOINT         | Azure AI Language endpoint URL  |
| AZURE_LANGUAGE_KEY              | Azure AI Language API key       |
| AZURE_STORAGE_CONNECTION_STRING | Azure Storage connection string |

Create a `.env.local` file and configure the required values.

Environment variables are stored locally and are not committed to the repository.

---

## Azure Services

* Azure App Service: hosts the deployed application
* Azure AI Language Service: performs sentiment analysis
* Azure Table Storage: stores customer feedback records

---

## Features

* Sentiment Analysis
* Confidence Scores
* Feedback History
* Dashboard Statistics
* Sentiment Filtering

Users can submit feedback, view sentiment analysis results, and review previously analyzed feedback stored in Azure Table Storage.

---

## Known Limitations

* Mixed sentiment may not always be classified as expected.
* Supports text-based sentiment analysis only.
* No user authentication in the current version.
* Human review is recommended for important business decisions.

---

## License

Educational use only for INTP302 Emerging Trends in Software Development.
