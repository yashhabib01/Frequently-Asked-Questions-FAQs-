# Frequenlty Asked Question (FAQs)

The FAQ service is a system that allows users to add, retrieve, and translate frequently asked questions and support rich text formatting . It supports multiple languages, with translations stored in a database and cached using Redis for fast access. The service uses MongoDB for data storage and integrates Google Translate for automatic translations. It also provides a REST API for seamless interaction with frontend applications. 🚀

### **Hosted URLs**

- **Backend**: [https://frequently-asked-questions-fa-qs.vercel.app/](https://frequently-asked-questions-fa-qs.vercel.app/)
- **Frontend**: [https://frequently-asked-questions-fa-qs-go49.vercel.app/](https://frequently-asked-questions-fa-qs-go49.vercel.app/)

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [FAQs System](#faqs-system)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
  - [1. Setup FAQs](#1-add-faq)
  - [2. Get FAQs](#2-get-faqs)
  - [3. Delete FAQs](#3-delete-faqs)
- [Database and Query Design](#database-and-query-design)
- [Improvements](#improvements)

## Project Overview

This system provides API endpoints and a frontend interface to:

- **Create a FAQ** with an fixed language as english via the frontend or API.
- **Retrieve FAQ with specific language** (default is english),via the frontend or API

The **React frontend** communicates with the backend through these API endpoints, providing users with a seamless interface to create FAQs and retrive FAQS in different language.

## ASSUMPTIONS

- Considering that input question and answer will be in english language

## Tech Stack

- **Node.js**: Javascript Backend runtime.
- **Express**: Web framework for building REST APIs.
- **Mongodb**: NoSQL document-oriented database that stores data in FAQs.
- **React**: For Frontend development with AntD.
- **Redis**: Data store used for caching frequently accessed FAQs, improving performance and reducing database load.
- **Google Translate**: Used for automatically translating FAQs into multiple languages.

## FAQ System

### Fetching FAQs (GET /faqs?lang=)

- When a request is made, it first checks Redis cache for FAQs in the requested language.
- If cached FAQs are found, they are returned immediately for fast response.
- If no cache exists, FAQs are fetched from MongoDB.
- If the requested language is not English and translations exist in the database, those are used.
- If translations do not exist, the system automatically translates the FAQs.
- The translated FAQs are then stored in Redis with a 2-minute expiry to optimize subsequent requests.

### Strategy Behind 2-Minute Expiry for Other Languages

- The English FAQs remain static and are fetched directly from MongoDB.
- Other languages are dynamically translated and cached for 2 minutes.
  - This ensures that frequently requested languages respond faster without querying MongoDB or translating repeatedly.
  - It prevents stale data issues—if FAQs are updated, new translations will be fetched after cache expiration.
  - If a translation is requested before expiry, it is served from cache, reducing load on the translation service and database.

### Creating a New FAQ (POST /faqs)

- New FAQs are added to MongoDB and immediately stored in the Redis cache for English.
- Cached FAQs in other languages are not updated instantly; they will be regenerated on the next request after cache expiration.

### Deleting an FAQ (DELETE /faqs/:id)

- The system first validates the given ID.
- If the FAQ exists, it is removed from MongoDB.
- Cached FAQs (English) are updated by removing the deleted FAQ.

### Handling Translations

- If an FAQ is requested in a language that does not exist in MongoDB, automatic translation occurs.
- These translations are then stored in Redis with a 2-minute expiry.
- If a translated FAQ is later updated, the cache will naturally refresh on the next request after expiry.

### Performance Optimization

- Using Redis caching reduces the number of MongoDB queries.
- 2-minute cache expiration ensures up-to-date translations without excessive API calls.
- Only non-English FAQs are cached dynamically, while English FAQs remain permanently available.
- The system balances fast retrieval and data consistency effectively.

## Setup Instructions

### Backend

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd Frequently-Asked-Questions-FAQs-/backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the project root and add the following:

   ```bash
   DB_URI=<your_database_host>
   REDIS_PASSWORD=<your_redis_password>
   REDIS_HOST=<your_redis_host>
   REDIS_PORT=<your_redis_port>
   PORT=8000
   ```

4. **Run the Application**:

   ```
   npm run dev
   ```

5. **API Base URL**: `http://localhost:8000`

### Frontend

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd Frequently-Asked-Questions-FAQs-/frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the project root and add the following:

   ```bash
    VITE_APP_SERVER_URL=http://localhost:8000/api
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

## Testing

- Run the test
  ```bash
  npm test
  ```

## API Endpoints

### 1. Add FAQ

- **Endpoint**: `POST /faqs`
- **Description**: Creates a new FAQ with in english language.
- **Request**:
  ```json
  {
    "question": "What is react?",
    "answer": "<p>React is a <strong>JavaScript library</strong> for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.</p>"
  }
  ```
- **Response**:
  ```json
  {
    "question": "What is the virtual DOM in React?",
    "answer": "<p>The <strong>virtual DOM</strong> is a lightweight copy of the actual DOM. React uses it to improve performance by minimizing direct DOM manipulations. When the state of a component changes, React updates the virtual DOM first, then efficiently updates the real DOM.</p>",
    "translations": {
      "en": {
        "question": "What is the virtual DOM in React?",
        "answer": "<p>The <strong>virtual DOM</strong> is a lightweight copy of the actual DOM. React uses it to improve performance by minimizing direct DOM manipulations. When the state of a component changes, React updates the virtual DOM first, then efficiently updates the real DOM.</p>"
      }
    },
    "_id": "679f7290c35aff24c7259f48",
    "createdAt": "2025-02-02T13:26:40.461Z",
    "updatedAt": "2025-02-02T13:26:40.461Z",
    "__v": 0
  }
  ```

### 2. Get FAQS

- **Endpoint**: `GET /faqs`
- **Description**: Retrieves FAQ in specific language, default is(english).
- **Query Parameters**:
  - `lang`: For retrieving FAQs in lang language .
- **Request**:
  `/faqs?lang=hi`
- **Response**:
  ```json
  [
    {
        "id":1
        "question": "क्या प्रतिक्रिया है?",
        "answer": "<html><head></head><body><p>प्रतिक्रिया एक है<strong>जावास्क्रिप्ट लाइब्रेरी</strong>उपयोगकर्ता इंटरफेस के निर्माण के लिए। यह फेसबुक और व्यक्तिगत डेवलपर्स और कंपनियों के एक समुदाय द्वारा बनाए रखा जाता है।</p></body></html>"
    },
    ...
  ]
  ```

### 3. Delete FAQS

- **Endpoint**: `Delete /faqs`
- **Description**: Deletes a single faq.
- **Query Parameters**:
  - `id`: Mongodb id of FAQ , that is needed to delete.
- **Request**:
  `/faqs/id`
- **Response**:
  ```json
  {
    "message": "FAQ deleted successfully.",
    "deletedFAQ": {
      "_id": "679fbb0edd396fe06a6dff98",
      "question": "Namaste in English",
      "answer": "<p>Namaste in Hindi</p>",
      "translations": {
        "en": {
          "question": "Namaste in English",
          "answer": "<p>Namaste in Hindi</p>"
        }
      },
      "createdAt": "2025-02-02T18:35:58.696Z",
      "updatedAt": "2025-02-02T18:35:58.696Z",
      "__v": 0
    }
  }
  ```

## Database and Query Design

### Database Structure

- **FAQ Schema** - question (String, Required) – Stores the FAQ's main question; it must be provided. - answer (String, Required) – Stores the corresponding answer; it must be provided. - translations (Object, Optional) – Stores multilingual versions of the FAQ:
  Each key is a language code (e.g., "es" for Spanish, "fr" for French).
  The value is an object containing: question (String) Translated question.
  answer (String) Translated answer. - Timestamps (createdAt, updatedAt) – Automatically tracks when the FAQ is created and last modified.

### Query Design

1. **`POST /faqs`**:

   - Validates Input: Ensures that both question and answer are provided in the request body.
   - Stores in Database: Saves the FAQ in MongoDB, initializing the English translation.
   - Updates Redis Cache: Retrieves the cached English FAQs from Redis, appends the new entry, and updates the cache.
     Ensures
   - Fast Retrieval: Maintains an up-to-date English cache in Redis to minimize database queries.

2. **`GET /faqs?lang`**:

   - Checks Redis Cache: Looks for FAQs in the requested language; returns cached data if available.
   - Fetches from Database: If the cache is empty, retrieves all FAQs from MongoDB.
   - Handles Translations: Uses pre-existing translations if available; otherwise, translates and stores the result.
   - Caches Translated Data: Stores non-English FAQs in Redis for 2 minutes to enhance performance.
   - Optimized Data Flow: Ensures efficient retrieval while dynamically handling multilingual support.

3. **`Delete /faqs/:id`**:

   - Validates FAQ ID: Ensures the provided ID is a valid MongoDB ObjectId before proceeding.
   - Checks Existence: Queries MongoDB to check if the FAQ exists before attempting deletion.
   - Updates Redis Cache:: Removes the FAQ entry from MongoDB if found.
   - Caches Translated Data: If the FAQ existed in the cache, it updates the cached data by removing the deleted entry.
   - Handles Errors Gracefully: Returns appropriate error messages for invalid IDs, missing records, or server issues.

## Improvements

1. **Asynchronous FAQ Translation**:

   - Note: Use asynchronous translation only if scaling the translation process becomes difficult or if the network is very busy. This method helps avoid performance bottlenecks and ensures the system remains responsive under heavy load.
   - Use BullMQ or RabbitMQ to handle FAQ translation asynchronously, reducing the API response time..
   - Push a new FAQ to the queue when it's added, and a worker process will handle the translation in the background, updating the FAQ once the translation is complete.
   - This way, users don’t have to wait for the FAQ to be translated before it's accessible.

2. **Schema and API Level improvements**:

   - **Translation Object**: Add a status in value so we can update failed translation as well.
   - **GET `/faqs` API**: Send pagination metaData along with the transactions[] for better UX like `totalRows`, `currentPage`, etc.

3. **Logging**

   - Implement proper logging mechanism using Winston, Morgan for structured logs
