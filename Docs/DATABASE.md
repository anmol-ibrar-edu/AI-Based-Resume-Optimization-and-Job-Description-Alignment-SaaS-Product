# 🗄️ Database Documentation

## 🗂️ How we Store Data (In Plain English)
This application uses a **PostgreSQL** database to remember everything. 
Think of it like a set of interconnected spreadsheets:
1. **Users:** Stores who you are and your password securely.
2. **Resumes:** Stores the files you upload and the skills we found in them.
3. **Job Descriptions:** Stores the jobs you want to apply for.
4. **Analyses:** The most important table. It links a User, a Resume, and a Job Description together and stores the final ATS score and tips.

Here is a visual map of how these tables connect to each other:

## 🗺️ Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ RESUMES : "uploads"
    USERS ||--o{ JOB_DESCRIPTIONS : "creates"
    USERS ||--o{ ANALYSES : "performs"
    USERS ||--o{ REVIEWS : "writes"
    RESUMES ||--o{ ANALYSES : "analyzed_in"
    JOB_DESCRIPTIONS ||--o{ ANALYSES : "compared_with"

    USERS {
        int id PK
        varchar email UK
        varchar hashed_password
        varchar full_name
        varchar role
        boolean is_active
        boolean is_verified
        timestamp last_login
        timestamp created_at
        timestamp updated_at
    }

    RESUMES {
        int id PK
        int user_id FK
        varchar filename
        varchar file_path
        varchar file_type
        int file_size
        text raw_text
        json parsed_data
        json skills
        timestamp created_at
        timestamp updated_at
    }

    JOB_DESCRIPTIONS {
        int id PK
        int user_id FK
        varchar title
        varchar company
        varchar location
        text raw_text
        json parsed_data
        json required_skills
        json keywords
        timestamp created_at
        timestamp updated_at
    }

    ANALYSES {
        int id PK
        int user_id FK
        int resume_id FK
        int job_id FK
        float ats_score
        json score_breakdown
        json matched_skills
        json missing_skills
        json extra_skills
        json matched_keywords
        json missing_keywords
        json recommendations
        text original_summary
        text improved_summary
        timestamp created_at
        timestamp updated_at
    }

    REVIEWS {
        int id PK
        int user_id FK
        text content
        int rating
        boolean is_visible
        timestamp created_at
        timestamp updated_at
    }
```

---

## Relationships Diagram

```mermaid
flowchart TD
    subgraph Users
        U[Users Table]
    end

    subgraph Content
        R[Resumes Table]
        J[Job Descriptions Table]
    end

    subgraph Results
        A[Analyses Table]
    end

    U -->|1:N| R
    U -->|1:N| J
    U -->|1:N| A
    R -->|1:N| A
    J -->|1:N| A
```

---

## Data Flow Diagram

```mermaid
flowchart LR
    A[User Registration] --> B[(Users Table)]
    C[Resume Upload] --> D[(Resumes Table)]
    E[Job Description] --> F[(Job Descriptions Table)]

    D --> G[Analysis + Career Analysis]
    F --> G
    G --> H[(Analyses Table)]

    B --> I[Authentication]
    I --> J[JWT Token]
```

---

## Tables Detail

### 1. Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_id ON users(id);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique auto-incremented identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email (used for login) |
| hashed_password | VARCHAR(255) | NOT NULL | Argon2 password hash |
| full_name | VARCHAR(100) | NOT NULL | Display name |
| role | VARCHAR(50) | DEFAULT 'user' | Access control (`user` or `admin`) |
| is_active | BOOLEAN | DEFAULT TRUE | Account enabled/disabled flag |
| is_verified | BOOLEAN | DEFAULT FALSE | Email verification flag |
| last_login | TIMESTAMP | NULLABLE | Last successful login timestamp |
| created_at | TIMESTAMP | NOT NULL | Account creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

---

### 2. Resumes Table

```sql
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    file_size INTEGER NOT NULL,
    raw_text TEXT,
    parsed_data JSONB,
    skills JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
```

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | Foreign key → users (CASCADE delete) |
| filename | VARCHAR(255) | Original uploaded filename |
| file_path | VARCHAR(500) | Server file system path |
| file_type | VARCHAR(10) | `pdf` or `docx` |
| file_size | INTEGER | File size in bytes |
| raw_text | TEXT | Extracted plain text (by resume_parser.py) |
| parsed_data | JSONB | Structured parsed data (name, contact, sections) |
| skills | JSONB | JSON array of extracted skill strings |
| created_at | TIMESTAMP | Upload timestamp |
| updated_at | TIMESTAMP | Last update time |

---

### 3. Job Descriptions Table

```sql
CREATE TABLE job_descriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    raw_text TEXT NOT NULL,
    parsed_data JSONB,
    required_skills JSONB,
    keywords JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);
```

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | Foreign key → users (CASCADE delete) |
| title | VARCHAR(255) | Job title (nullable) |
| company | VARCHAR(255) | Company name (nullable) |
| location | VARCHAR(255) | Job location (nullable) |
| raw_text | TEXT | Full job description text (required) |
| parsed_data | JSONB | Full parsed data including preferred_skills |
| required_skills | JSONB | Extracted required skills array |
| keywords | JSONB | Extracted keywords array |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update time |

---

### 4. Analyses Table

```sql
CREATE TABLE analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
    ats_score FLOAT NOT NULL,
    score_breakdown JSONB,
    matched_skills JSONB,
    missing_skills JSONB,
    extra_skills JSONB,
    matched_keywords JSONB,
    missing_keywords JSONB,
    recommendations JSONB,
    original_summary TEXT,
    improved_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_resume_id ON analyses(resume_id);
CREATE INDEX idx_analyses_job_id ON analyses(job_id);
```

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | Foreign key → users (CASCADE delete) |
| resume_id | INTEGER | Foreign key → resumes (CASCADE delete) |
| job_id | INTEGER | Foreign key → job_descriptions (CASCADE delete) |
| ats_score | FLOAT | Overall ATS compatibility score (0–100) |
| score_breakdown | JSONB | Breakdown by component (skills, keywords, etc.) |
| matched_skills | JSONB | Skills found in both resume and job |
| missing_skills | JSONB | Skills required by job but missing from resume |
| extra_skills | JSONB | Skills in resume but not in job description |
| matched_keywords | JSONB | Keywords found in both documents |
| missing_keywords | JSONB | Keywords in job but missing from resume |
| recommendations | JSONB | Prioritized improvement recommendations |
| original_summary | TEXT | Resume's professional summary (as parsed) |
| improved_summary | TEXT | AI-improved summary (nullable, future feature) |
| created_at | TIMESTAMP | Analysis run timestamp |
| updated_at | TIMESTAMP | Last update time |

---

### 5. Reviews Table

```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 NOT NULL,
    is_visible BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_reviews_user_id ON reviews(user_id);
```

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | Foreign key → users (CASCADE delete) |
| content | TEXT | Review content/testimonial |
| rating | INTEGER | Star rating (typically 1-5) |
| is_visible | BOOLEAN | Admin approval flag (default false) |
| created_at | TIMESTAMP | Review creation timestamp |
| updated_at | TIMESTAMP | Last update time |

---

## JSON Field Structures

### `score_breakdown` (Analyses)
```json
{
    "skills_score": 85,
    "keywords_score": 78,
    "experience_score": 82,
    "format_score": 90,
    "achievements_score": 75
}
```

### `skills` (Resumes)
```json
["Python", "JavaScript", "React", "PostgreSQL", "Docker"]
```

### `parsed_data` (Job Descriptions)
```json
{
    "required_skills": ["Python", "FastAPI"],
    "preferred_skills": ["Docker", "Kubernetes"],
    "keywords": ["agile", "CI/CD"],
    "experience_required": "3-5 years"
}
```

### `recommendations` (Analyses)
```json
[
    {
        "priority": "high",
        "category": "skills",
        "message": "Add Docker experience",
        "details": "Docker is listed as a required skill in the job description"
    },
    {
        "priority": "medium",
        "category": "keywords",
        "message": "Include 'microservices' keyword",
        "details": "The job description mentions microservices multiple times"
    }
]
```

---

## Cascade Delete Rules

```mermaid
flowchart TD
    A[Delete User] --> B[All User's Resumes deleted]
    A --> C[All User's Job Descriptions deleted]
    A --> D[All User's Analyses deleted]

    E[Delete Resume] --> F[All Analyses referencing this Resume deleted]
    G[Delete Job Description] --> H[All Analyses referencing this Job deleted]
```

---

## Database Operations

### Backup
```bash
docker exec resume_db pg_dump -U postgres resume_optimizer > backup.sql
```

### Restore
```bash
docker exec -i resume_db psql -U postgres resume_optimizer < backup.sql
```

### Connect
```bash
docker exec -it resume_db psql -U postgres -d resume_optimizer
```

### Common Queries
```sql
-- Get user's analysis history with resume and job info
SELECT a.id, a.ats_score, r.filename, j.title, a.created_at
FROM analyses a
JOIN resumes r ON a.resume_id = r.id
JOIN job_descriptions j ON a.job_id = j.id
WHERE a.user_id = 1
ORDER BY a.created_at DESC;

-- Average score per user
SELECT user_id, AVG(ats_score) AS avg_score, COUNT(*) AS total_analyses
FROM analyses
GROUP BY user_id
ORDER BY avg_score DESC;

-- Most recent analysis per user
SELECT DISTINCT ON (user_id) user_id, ats_score, created_at
FROM analyses
ORDER BY user_id, created_at DESC;
```

---

## Connection Configuration

The database connection is managed via `app/db/database.py`:

```python
# From app/config.py
DATABASE_URL = "postgresql://postgres:password123@localhost:5432/resume_optimizer"

# Engine created in database.py
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)
```

For Docker, the host is `db` (service name):
```env
DATABASE_URL=postgresql://postgres:password123@db:5432/resume_optimizer
```

---

## Security

- **Password Hashing**: Argon2 algorithm via `passlib[argon2]`
- **SQL Injection Protection**: All queries use SQLAlchemy ORM — no raw SQL in application code
- **Cascade Deletes**: Foreign key constraints ensure no orphaned records
- **Indexes**: Indexed on all foreign keys and the `email` field for fast queries

---

## 📊 Data Source & Methodology (ML Engine)

A common question regarding the system's architecture is how the underlying Machine Learning models were trained, where the dataset originated, and why specific data formats were chosen over raw documents.

### 1. Where was the Data Collected From?
The foundational data used for our skill matching and career prediction engines (`skills_database.py` and `career_database.py`) was synthesized from structured, industry-standard datasets (often curated from platforms like Kaggle, LinkedIn's Skill Ontology, and O*NET). These datasets provide a comprehensive taxonomy of thousands of technical and soft skills, mapped directly to specific job roles and market demands.

### 2. Why Not Use Original (Real) Resumes for Training?
We intentionally avoided using a massive corpus of raw, original PDF/DOCX resumes for training the core ML engine for several critical reasons:
- **Data Privacy & PII (GDPR Compliance):** Real resumes are heavily populated with Personally Identifiable Information (PII) such as full names, phone numbers, home addresses, and emails. Training models on unredacted data is a massive security and privacy risk.
- **Unstructured Noise & Hallucinations:** Real resumes have wildly inconsistent formatting (columns, invisible tables, images, varying fonts). Feeding raw PDFs directly into an ML training pipeline introduces excessive "noise," which severely degrades the accuracy of deterministic skill extraction. 
- **Bias Prevention:** By focusing strictly on *skills* rather than the *individuals* who possess them, the model remains unbiased against gender, age, or ethnicity indicators often implicitly present in real resumes.

### 3. Why Use CSV / Structured Data Formats?
The original datasets are processed in **CSV (Comma-Separated Values)** formats before being hardcoded into the application's memory because:
- **Tabular Precision:** CSVs allow data to be organized into strict columns (e.g., `Skill_Name`, `Category`, `Synonyms`, `Associated_Role`).
- **Computational Efficiency:** Reading and vectorizing text from a CSV is exponentially faster and lighter on memory than performing OCR or PDF parsing on thousands of files during the training phase.
- **Deterministic Tokenization:** A CSV provides a clean vocabulary that our NLP algorithms (like `spaCy`) can use to build an exact reference dictionary, ensuring that when the system analyzes a user's resume, it knows exactly what to look for without guessing.

### 4. How is the Resume Data Formatted & Trained?
The transition from raw data to a functional ML model follows a strict pipeline:
1. **Data Cleaning:** The structured CSV data is stripped of duplicates, and synonyms are mapped to a canonical format (e.g., "ReactJS", "React.js", and "React" are all mapped to the exact same token).
2. **NLP Tokenization:** We use `spaCy` (en_core_web_sm) to break the text down into lemmatized tokens, ignoring stop words and punctuation.
3. **Categorization:** Skills are programmatically grouped into distinct domains (Frontend, Cloud/DevOps, Soft Skills, etc.).
4. **Vectorization & Baseline Generation:** This cleaned, structured vocabulary is used to train our `scikit-learn` TF-IDF (Term Frequency-Inverse Document Frequency) vectorizers. By defining "perfect" theoretical job roles using this data, the system can use **Cosine Similarity** to mathematically compare a live user's resume against our clean, trained baseline to generate a highly accurate ATS score.

### 5. Why Hardcode Taxonomies in Python Instead of PostgreSQL?
A key architectural decision was converting the finalized ML taxonomy into pure Python files (`skills_database.py` and `career_database.py`) rather than storing the skills in a PostgreSQL table. This was done strictly for **High-Performance In-Memory Execution**:
- **Zero Latency Lookups**: When analyzing a resume, the NLP engine must cross-reference thousands of extracted words against thousands of known skills. If the system had to query the PostgreSQL database over the network for every word matching operation, it would create an enormous I/O bottleneck.
- **O(1) Time Complexity**: Python Dictionaries and Sets offer `O(1)` (instant) lookup times. By loading the static ML taxonomy directly into the application's RAM at runtime, the analysis completes in milliseconds.
- **Separation of Concerns**: PostgreSQL is strictly reserved for *dynamic, mutable state* (User accounts, saved PDFs, historical analysis scores), while the Python files act as *static, read-only* reference data for the ML engine.