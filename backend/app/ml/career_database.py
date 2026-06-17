"""
File: ml/career_database.py
Purpose: A curated database of 25+ professional career paths with associated required skills, salary ranges, and growth metrics for career matching.
Missing Impact: The career analysis engine would have no target roles to compare resumes against, making it impossible to suggest career paths.
"""

CAREER_DATABASE = {

    # ─── WEB DEVELOPMENT ───────────────────────────────────────────────────────

    "Frontend Developer": {
        "field": "Web Development",
        "alternate_titles": [
            "Front-End Developer", "UI Developer", "Frontend Engineer",
            "React Developer", "Angular Developer", "Vue Developer",
        ],
        "required_skills": ["HTML", "CSS", "JavaScript"],
        "important_skills": [
            "React", "Angular", "Vue", "TypeScript", "Tailwind CSS",
            "Bootstrap", "Sass", "Redux", "REST API", "Git",
        ],
        "bonus_skills": [
            "Next.js", "Gatsby", "GraphQL", "Jest", "Cypress",
            "Webpack", "Vite", "Figma", "Responsive Design", "Accessibility",
        ],
        "min_skills_needed": 4,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$50k-$75k"},
            "Mid": {"years": "2-5", "salary": "$75k-$110k"},
            "Senior": {"years": "5-8", "salary": "$110k-$150k"},
            "Lead": {"years": "8+", "salary": "$140k-$180k"},
        },
        "market_demand": "High",
        "growth_rate": "23%",
        "description": "Frontend developers build user-facing parts of websites using HTML, CSS, JavaScript, and modern frameworks.",
    },

    "Backend Developer": {
        "field": "Web Development",
        "alternate_titles": [
            "Back-End Developer", "API Developer", "Python Developer",
            "Node.js Developer", "Java Developer", ".NET Developer",
        ],
        "required_skills": ["Python", "Java", "Node.js", "C#"],
        "important_skills": [
            "SQL", "PostgreSQL", "MongoDB", "REST API", "Django",
            "Flask", "FastAPI", "Express", "Spring Boot", "Docker", "Git",
        ],
        "bonus_skills": [
            "Redis", "RabbitMQ", "Kafka", "GraphQL",
            "Kubernetes", "AWS", "Microservices", "CI/CD", "Linux",
        ],
        "min_skills_needed": 4,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$55k-$80k"},
            "Mid": {"years": "2-5", "salary": "$80k-$120k"},
            "Senior": {"years": "5-8", "salary": "$120k-$165k"},
            "Lead": {"years": "8+", "salary": "$150k-$190k"},
        },
        "market_demand": "High",
        "growth_rate": "25%",
        "description": "Backend developers build server-side logic, APIs, databases, and core application functionality.",
    },

    "Full Stack Developer": {
        "field": "Web Development",
        "alternate_titles": [
            "Full-Stack Engineer", "Web Developer", "MERN Stack Developer",
            "MEAN Stack Developer", "Software Developer",
        ],
        "required_skills": ["JavaScript", "HTML", "CSS"],
        "important_skills": [
            "React", "Node.js", "Python", "TypeScript", "SQL",
            "PostgreSQL", "MongoDB", "Express", "REST API", "Git", "Docker",
        ],
        "bonus_skills": [
            "Next.js", "Django", "FastAPI", "AWS", "Redis",
            "GraphQL", "Kubernetes", "CI/CD", "Testing", "Agile",
        ],
        "min_skills_needed": 6,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$55k-$80k"},
            "Mid": {"years": "2-5", "salary": "$85k-$125k"},
            "Senior": {"years": "5-8", "salary": "$125k-$170k"},
            "Lead": {"years": "8+", "salary": "$160k-$200k"},
        },
        "market_demand": "Very High",
        "growth_rate": "27%",
        "description": "Full Stack developers work on both frontend and backend, building complete web applications.",
    },

    # ─── MOBILE ────────────────────────────────────────────────────────────────

    "Android Developer": {
        "field": "Mobile Development",
        "alternate_titles": ["Android Engineer", "Kotlin Developer", "Mobile Developer (Android)"],
        "required_skills": ["Kotlin", "Java", "Android"],
        "important_skills": [
            "Android Studio", "Jetpack Compose", "Room", "Retrofit",
            "Coroutines", "MVVM", "Git", "REST API", "Firebase",
        ],
        "bonus_skills": ["Dagger", "Hilt", "Unit Testing", "Material Design", "CI/CD"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$55k-$80k"},
            "Mid": {"years": "2-5", "salary": "$80k-$120k"},
            "Senior": {"years": "5+", "salary": "$120k-$160k"},
        },
        "market_demand": "High",
        "growth_rate": "22%",
        "description": "Android developers build mobile applications for Android devices using Kotlin or Java.",
    },

    "iOS Developer": {
        "field": "Mobile Development",
        "alternate_titles": ["iOS Engineer", "Swift Developer", "Apple Developer"],
        "required_skills": ["Swift", "iOS", "Xcode"],
        "important_skills": [
            "SwiftUI", "UIKit", "Core Data", "Combine",
            "REST API", "Git", "App Store",
        ],
        "bonus_skills": ["Objective-C", "ARKit", "Core ML", "WidgetKit", "CI/CD"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$60k-$85k"},
            "Mid": {"years": "2-5", "salary": "$85k-$130k"},
            "Senior": {"years": "5+", "salary": "$130k-$170k"},
        },
        "market_demand": "High",
        "growth_rate": "20%",
        "description": "iOS developers build applications for Apple devices using Swift and SwiftUI.",
    },

    "React Native Developer": {
        "field": "Mobile Development",
        "alternate_titles": ["Cross-Platform Developer", "Mobile Developer (React Native)"],
        "required_skills": ["React Native", "JavaScript", "React"],
        "important_skills": ["TypeScript", "Redux", "REST API", "Git", "Expo", "Firebase"],
        "bonus_skills": ["Native Modules", "iOS", "Android", "CI/CD"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$55k-$80k"},
            "Mid": {"years": "2-5", "salary": "$80k-$120k"},
            "Senior": {"years": "5+", "salary": "$120k-$160k"},
        },
        "market_demand": "High",
        "growth_rate": "24%",
        "description": "React Native developers build cross-platform mobile apps using JavaScript and React.",
    },

    "Flutter Developer": {
        "field": "Mobile Development",
        "alternate_titles": ["Dart Developer", "Cross-Platform Developer (Flutter)"],
        "required_skills": ["Flutter", "Dart"],
        "important_skills": ["REST API", "Firebase", "Git", "Provider", "Bloc"],
        "bonus_skills": ["iOS", "Android", "CI/CD", "Unit Testing"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$50k-$75k"},
            "Mid": {"years": "2-4", "salary": "$75k-$110k"},
            "Senior": {"years": "4+", "salary": "$110k-$150k"},
        },
        "market_demand": "Growing",
        "growth_rate": "30%",
        "description": "Flutter developers build beautiful cross-platform apps using Dart.",
    },

    # ─── DATA & AI ─────────────────────────────────────────────────────────────

    "Data Analyst": {
        "field": "Data & Analytics",
        "alternate_titles": ["Business Analyst", "BI Analyst", "Analytics Engineer"],
        "required_skills": ["SQL", "Excel"],
        "important_skills": [
            "Python", "Tableau", "Power BI", "Pandas",
            "Data Visualization", "Statistics", "R",
        ],
        "bonus_skills": ["NumPy", "Matplotlib", "ETL", "A/B Testing", "Looker", "dbt"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$45k-$65k"},
            "Mid": {"years": "2-5", "salary": "$65k-$95k"},
            "Senior": {"years": "5+", "salary": "$95k-$130k"},
        },
        "market_demand": "Very High",
        "growth_rate": "35%",
        "description": "Data Analysts collect, process, and analyze data to help businesses make informed decisions.",
    },

    "Data Scientist": {
        "field": "Data Science & AI",
        "alternate_titles": ["ML Scientist", "Applied Scientist", "Research Scientist"],
        "required_skills": ["Python", "Machine Learning", "Statistics"],
        "important_skills": [
            "Pandas", "NumPy", "scikit-learn", "SQL", "TensorFlow",
            "PyTorch", "Data Visualization", "Jupyter", "Deep Learning", "NLP",
        ],
        "bonus_skills": ["Spark", "R", "Keras", "A/B Testing", "MLflow", "Databricks"],
        "min_skills_needed": 5,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$70k-$95k"},
            "Mid": {"years": "2-5", "salary": "$95k-$140k"},
            "Senior": {"years": "5-8", "salary": "$140k-$190k"},
            "Lead": {"years": "8+", "salary": "$180k-$250k"},
        },
        "market_demand": "Very High",
        "growth_rate": "36%",
        "description": "Data Scientists use machine learning and statistics to extract insights and build predictive models.",
    },

    "Machine Learning Engineer": {
        "field": "Data Science & AI",
        "alternate_titles": ["ML Engineer", "AI Engineer", "Deep Learning Engineer"],
        "required_skills": ["Python", "Machine Learning", "Deep Learning"],
        "important_skills": [
            "TensorFlow", "PyTorch", "scikit-learn", "Docker",
            "AWS", "SQL", "NumPy", "Pandas", "MLflow", "REST API",
        ],
        "bonus_skills": ["Kubernetes", "Spark", "SageMaker", "NLP", "Computer Vision", "LLM", "RAG"],
        "min_skills_needed": 5,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$80k-$110k"},
            "Mid": {"years": "2-5", "salary": "$110k-$160k"},
            "Senior": {"years": "5+", "salary": "$160k-$220k"},
        },
        "market_demand": "Very High",
        "growth_rate": "40%",
        "description": "ML Engineers build, deploy, and optimize machine learning models in production systems.",
    },

    "AI Engineer": {
        "field": "Artificial Intelligence",
        "alternate_titles": ["Generative AI Engineer", "LLM Engineer", "AI Developer"],
        "required_skills": ["Python", "Machine Learning"],
        "important_skills": [
            "LLM", "OpenAI", "Langchain", "RAG", "Prompt Engineering",
            "TensorFlow", "PyTorch", "NLP", "Docker", "REST API", "Git",
        ],
        "bonus_skills": [
            "Fine-Tuning", "Hugging Face", "AI Agents", "CrewAI",
            "AutoGen", "Kubernetes", "AWS",
        ],
        "min_skills_needed": 4,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$85k-$115k"},
            "Mid": {"years": "2-5", "salary": "$115k-$170k"},
            "Senior": {"years": "5+", "salary": "$170k-$250k"},
        },
        "market_demand": "Extremely High",
        "growth_rate": "50%",
        "description": "AI Engineers build AI-powered applications using LLMs, generative AI, and modern AI tools.",
    },

    "Data Engineer": {
        "field": "Data Engineering",
        "alternate_titles": ["ETL Developer", "Big Data Engineer", "Data Pipeline Engineer"],
        "required_skills": ["Python", "SQL"],
        "important_skills": [
            "Spark", "Airflow", "Kafka", "AWS", "Docker",
            "PostgreSQL", "ETL", "Data Warehouse", "dbt", "Snowflake",
        ],
        "bonus_skills": ["Kubernetes", "Databricks", "BigQuery", "Redshift", "Terraform"],
        "min_skills_needed": 4,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$65k-$90k"},
            "Mid": {"years": "2-5", "salary": "$90k-$135k"},
            "Senior": {"years": "5+", "salary": "$135k-$185k"},
        },
        "market_demand": "Very High",
        "growth_rate": "32%",
        "description": "Data Engineers build and maintain data pipelines, warehouses, and infrastructure for data processing.",
    },

    "MLOps Engineer": {
        "field": "Data Science & AI",
        "alternate_titles": ["ML Platform Engineer", "AI Infrastructure Engineer"],
        "required_skills": ["Python", "Docker", "Machine Learning"],
        "important_skills": [
            "Kubernetes", "MLflow", "AWS", "CI/CD", "Airflow",
            "Terraform", "Git", "Linux", "Prometheus", "Grafana",
        ],
        "bonus_skills": ["SageMaker", "Vertex AI", "Feature Store", "Model Monitoring", "Spark"],
        "min_skills_needed": 5,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$75k-$100k"},
            "Mid": {"years": "2-5", "salary": "$100k-$150k"},
            "Senior": {"years": "5+", "salary": "$150k-$200k"},
        },
        "market_demand": "Very High",
        "growth_rate": "38%",
        "description": "MLOps Engineers deploy, monitor, and manage ML models in production.",
    },

    # ─── DEVOPS & CLOUD ────────────────────────────────────────────────────────

    "DevOps Engineer": {
        "field": "DevOps & Cloud",
        "alternate_titles": ["SRE", "Platform Engineer", "Site Reliability Engineer", "Build Engineer"],
        "required_skills": ["Linux", "Docker", "CI/CD"],
        "important_skills": [
            "Kubernetes", "AWS", "Terraform", "Git", "Jenkins",
            "GitHub Actions", "Python", "Bash", "Ansible", "Prometheus", "Grafana",
        ],
        "bonus_skills": ["Azure", "GCP", "Helm", "ArgoCD", "Istio", "ELK Stack", "Vault"],
        "min_skills_needed": 5,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$65k-$90k"},
            "Mid": {"years": "2-5", "salary": "$90k-$140k"},
            "Senior": {"years": "5-8", "salary": "$140k-$190k"},
            "Lead": {"years": "8+", "salary": "$175k-$220k"},
        },
        "market_demand": "Very High",
        "growth_rate": "28%",
        "description": "DevOps Engineers automate deployments, manage infrastructure, and ensure system reliability.",
    },

    "Cloud Engineer": {
        "field": "DevOps & Cloud",
        "alternate_titles": ["Cloud Architect", "AWS Engineer", "Azure Engineer", "GCP Engineer"],
        "required_skills": ["AWS", "Azure", "GCP"],
        "important_skills": [
            "Docker", "Kubernetes", "Terraform", "Linux",
            "Networking", "Security", "CI/CD", "Python", "IAM",
        ],
        "bonus_skills": ["Serverless", "Lambda", "Cost Optimization", "CDK", "Pulumi"],
        "min_skills_needed": 4,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$70k-$95k"},
            "Mid": {"years": "2-5", "salary": "$95k-$145k"},
            "Senior": {"years": "5+", "salary": "$145k-$200k"},
        },
        "market_demand": "Very High",
        "growth_rate": "30%",
        "description": "Cloud Engineers design and manage cloud infrastructure on AWS, Azure, or GCP.",
    },

    # ─── SECURITY ─────────────────────────────────────────────────────────────

    "Cybersecurity Analyst": {
        "field": "Cybersecurity",
        "alternate_titles": ["Security Analyst", "SOC Analyst", "Threat Analyst"],
        "required_skills": ["Network Security", "Linux"],
        "important_skills": [
            "SIEM", "Firewall", "IDS", "Vulnerability Assessment",
            "Penetration Testing", "Python", "OWASP", "Encryption",
        ],
        "bonus_skills": ["Splunk", "Wireshark", "Metasploit", "Nmap", "CISSP", "Zero Trust"],
        "min_skills_needed": 4,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$55k-$80k"},
            "Mid": {"years": "2-5", "salary": "$80k-$120k"},
            "Senior": {"years": "5+", "salary": "$120k-$170k"},
        },
        "market_demand": "Very High",
        "growth_rate": "33%",
        "description": "Cybersecurity Analysts protect organizations from cyber threats and security breaches.",
    },

    # ─── DESIGN & UX ──────────────────────────────────────────────────────────

    "UX Designer": {
        "field": "Design",
        "alternate_titles": ["UI/UX Designer", "Product Designer", "Interaction Designer"],
        "required_skills": ["Figma", "UX Design"],
        "important_skills": [
            "UI Design", "Wireframing", "Prototyping", "User Research",
            "Usability Testing", "Design System", "Adobe XD",
        ],
        "bonus_skills": ["HTML", "CSS", "Framer", "Motion Design", "Accessibility", "A/B Testing"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$50k-$75k"},
            "Mid": {"years": "2-5", "salary": "$75k-$110k"},
            "Senior": {"years": "5+", "salary": "$110k-$160k"},
        },
        "market_demand": "High",
        "growth_rate": "20%",
        "description": "UX Designers create user-centered designs through research, wireframing, and prototyping.",
    },

    # ─── QA ───────────────────────────────────────────────────────────────────

    "QA Engineer": {
        "field": "Quality Assurance",
        "alternate_titles": ["Test Engineer", "SDET", "Automation Engineer", "QA Analyst"],
        "required_skills": ["Testing", "Test Automation"],
        "important_skills": [
            "Selenium", "Cypress", "Jest", "Python", "JavaScript",
            "SQL", "Git", "Postman", "API Testing", "CI/CD",
        ],
        "bonus_skills": ["Playwright", "JMeter", "Performance Testing", "Docker", "K6"],
        "min_skills_needed": 4,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$45k-$65k"},
            "Mid": {"years": "2-5", "salary": "$65k-$100k"},
            "Senior": {"years": "5+", "salary": "$100k-$145k"},
        },
        "market_demand": "High",
        "growth_rate": "18%",
        "description": "QA Engineers ensure software quality through manual and automated testing strategies.",
    },

    # ─── MANAGEMENT ───────────────────────────────────────────────────────────

    "Technical Lead": {
        "field": "Engineering Management",
        "alternate_titles": ["Tech Lead", "Lead Developer", "Staff Engineer", "Principal Engineer"],
        "required_skills": ["Leadership", "System Design"],
        "important_skills": [
            "Python", "JavaScript", "Java", "Architecture", "Microservices",
            "AWS", "Docker", "Code Review", "Mentoring", "Agile", "Git",
        ],
        "bonus_skills": ["Kubernetes", "CI/CD", "Technical Writing", "Stakeholder Management"],
        "min_skills_needed": 6,
        "experience_levels": {
            "Lead": {"years": "5-8", "salary": "$140k-$190k"},
            "Staff": {"years": "8-12", "salary": "$180k-$250k"},
            "Principal": {"years": "12+", "salary": "$220k-$300k+"},
        },
        "market_demand": "High",
        "growth_rate": "15%",
        "description": "Technical Leads guide engineering teams, make architectural decisions, and mentor developers.",
    },

    "Product Manager": {
        "field": "Product Management",
        "alternate_titles": ["PM", "Product Owner", "APM", "Senior Product Manager"],
        "required_skills": ["Product Management", "Agile"],
        "important_skills": [
            "Jira", "User Stories", "Analytics", "SQL",
            "A/B Testing", "Stakeholder Management", "Scrum", "Communication",
        ],
        "bonus_skills": ["Python", "Data Analysis", "Figma", "API Knowledge", "Market Research"],
        "min_skills_needed": 4,
        "experience_levels": {
            "APM": {"years": "0-2", "salary": "$70k-$100k"},
            "PM": {"years": "2-5", "salary": "$100k-$150k"},
            "Senior PM": {"years": "5-8", "salary": "$150k-$200k"},
            "Director": {"years": "8+", "salary": "$200k-$280k"},
        },
        "market_demand": "High",
        "growth_rate": "20%",
        "description": "Product Managers define product strategy, prioritize features, and work with engineering to deliver value.",
    },

    # ─── BLOCKCHAIN ───────────────────────────────────────────────────────────

    "Blockchain Developer": {
        "field": "Blockchain & Web3",
        "alternate_titles": ["Smart Contract Developer", "Web3 Developer", "Solidity Developer"],
        "required_skills": ["Solidity", "Blockchain"],
        "important_skills": [
            "Ethereum", "Web3.js", "Ethers.js", "Smart Contracts",
            "JavaScript", "TypeScript", "Hardhat", "Git",
        ],
        "bonus_skills": ["React", "Node.js", "IPFS", "Polygon", "Chainlink", "OpenZeppelin"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$70k-$100k"},
            "Mid": {"years": "2-4", "salary": "$100k-$160k"},
            "Senior": {"years": "4+", "salary": "$160k-$250k"},
        },
        "market_demand": "Medium",
        "growth_rate": "25%",
        "description": "Blockchain developers build decentralized applications and smart contracts.",
    },

    # ─── GAME DEV ─────────────────────────────────────────────────────────────

    "Game Developer": {
        "field": "Game Development",
        "alternate_titles": ["Unity Developer", "Unreal Developer", "Game Programmer"],
        "required_skills": ["C++", "C#", "Unity"],
        "important_skills": [
            "Game Development", "Unreal Engine", "3D Math", "Physics",
            "OpenGL", "Game Design", "Git", "OOP",
        ],
        "bonus_skills": ["Shader Programming", "Networking", "Animation", "Blender", "VR", "AR"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$50k-$70k"},
            "Mid": {"years": "2-5", "salary": "$70k-$110k"},
            "Senior": {"years": "5+", "salary": "$110k-$160k"},
        },
        "market_demand": "Medium",
        "growth_rate": "16%",
        "description": "Game developers create video games using engines like Unity and Unreal.",
    },

    # ─── ARCHITECTURE ─────────────────────────────────────────────────────────

    "Software Architect": {
        "field": "Software Engineering",
        "alternate_titles": ["Solutions Architect", "System Architect", "Enterprise Architect"],
        "required_skills": ["System Design", "Architecture"],
        "important_skills": [
            "Microservices", "Cloud", "AWS", "Docker", "Kubernetes",
            "Design Patterns", "Security", "Scalability", "API Design", "Leadership",
        ],
        "bonus_skills": ["Multi-Cloud", "Event-Driven Architecture", "Domain-Driven Design", "Kafka"],
        "min_skills_needed": 6,
        "experience_levels": {
            "Architect": {"years": "8-12", "salary": "$160k-$220k"},
            "Principal": {"years": "12+", "salary": "$200k-$300k+"},
        },
        "market_demand": "High",
        "growth_rate": "15%",
        "description": "Software Architects design system architecture and make high-level technical decisions.",
    },

    # ─── DATABASE ─────────────────────────────────────────────────────────────

    "Database Administrator": {
        "field": "Database Management",
        "alternate_titles": ["DBA", "Database Engineer", "Data Architect"],
        "required_skills": ["SQL", "PostgreSQL", "MySQL"],
        "important_skills": [
            "Database Design", "Performance Tuning", "Backup & Recovery",
            "MongoDB", "Redis", "Oracle", "Linux", "Cloud Databases",
        ],
        "bonus_skills": ["AWS RDS", "Azure SQL", "Elasticsearch", "Data Modeling", "ETL", "Python"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$55k-$75k"},
            "Mid": {"years": "2-5", "salary": "$75k-$110k"},
            "Senior": {"years": "5+", "salary": "$110k-$155k"},
        },
        "market_demand": "Medium",
        "growth_rate": "10%",
        "description": "DBAs manage, optimize, and secure database systems.",
    },

    # ─── EMBEDDED ─────────────────────────────────────────────────────────────

    "Embedded Systems Engineer": {
        "field": "Embedded & IoT",
        "alternate_titles": ["Firmware Engineer", "Embedded Developer", "IoT Engineer"],
        "required_skills": ["C", "C++", "Embedded Systems"],
        "important_skills": ["RTOS", "Microcontroller", "ARM", "I2C", "SPI", "UART", "Linux"],
        "bonus_skills": ["IoT", "MQTT", "Bluetooth", "Arduino", "Raspberry Pi"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$60k-$80k"},
            "Mid": {"years": "2-5", "salary": "$80k-$120k"},
            "Senior": {"years": "5+", "salary": "$120k-$165k"},
        },
        "market_demand": "Medium",
        "growth_rate": "15%",
        "description": "Embedded Engineers develop software for hardware devices and IoT systems.",
    },

    # ─── DESIGN & CREATIVE ───────────────────────────────────────────────────

    "Web Designer": {
        "field": "Design & Creative",
        "alternate_titles": ["Website Designer", "Creative Web Designer", "Digital Designer", "UI Web Designer"],
        "required_skills": ["HTML", "CSS"],
        "important_skills": ["Figma", "Adobe XD", "Photoshop", "Illustrator", "JavaScript",
                             "WordPress", "Responsive Design", "UI Design", "Wireframing", "Bootstrap"],
        "bonus_skills": ["React", "Sass", "Animation", "SEO", "Branding",
                         "Typography", "Color Theory", "Adobe Creative Suite"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$40k-$60k"},
            "Mid":    {"years": "2-5", "salary": "$60k-$90k"},
            "Senior": {"years": "5+",  "salary": "$90k-$130k"},
        },
        "market_demand": "High",
        "growth_rate": "16%",
        "description": "Web Designers create visually appealing, user-friendly websites combining design principles with HTML/CSS.",
    },

    "Graphic Designer": {
        "field": "Design & Creative",
        "alternate_titles": ["Visual Designer", "Brand Designer", "Creative Designer", "Digital Designer"],
        "required_skills": ["Photoshop", "Illustrator"],
        "important_skills": ["Adobe Creative Suite", "Figma", "Typography", "Branding",
                             "Color Theory", "InDesign", "Logo Design", "UI Design"],
        "bonus_skills": ["After Effects", "Video Editing", "Motion Design", "Social Media Graphics"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$35k-$52k"},
            "Mid":    {"years": "2-5", "salary": "$52k-$78k"},
            "Senior": {"years": "5+",  "salary": "$78k-$110k"},
        },
        "market_demand": "Medium",
        "growth_rate": "3%",
        "description": "Graphic Designers create visual content for print and digital media using Adobe Creative Suite.",
    },

    "UI Designer": {
        "field": "Design & Creative",
        "alternate_titles": ["UI/UX Designer", "Interface Designer", "Product Designer"],
        "required_skills": ["Figma", "UI Design"],
        "important_skills": ["Adobe XD", "Photoshop", "Illustrator", "Wireframing",
                             "Prototyping", "Design System", "Typography", "Color Theory"],
        "bonus_skills": ["HTML", "CSS", "Motion Design", "Accessibility", "A/B Testing"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$48k-$68k"},
            "Mid":    {"years": "2-5", "salary": "$68k-$100k"},
            "Senior": {"years": "5+",  "salary": "$100k-$145k"},
        },
        "market_demand": "High",
        "growth_rate": "18%",
        "description": "UI Designers craft beautiful, intuitive interfaces focusing on visual design and interaction.",
    },

    "WordPress Developer": {
        "field": "Web Development",
        "alternate_titles": ["WordPress Designer", "WP Developer", "CMS Developer",
                             "WordPress Theme Developer", "WordPress Plugin Developer"],
        "required_skills": ["WordPress", "PHP"],
        "important_skills": ["HTML", "CSS", "JavaScript", "MySQL",
                             "WooCommerce", "Elementor", "SEO", "Git"],
        "bonus_skills": ["React", "REST API", "Gutenberg", "Performance Optimization"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$35k-$55k"},
            "Mid":    {"years": "2-5", "salary": "$55k-$85k"},
            "Senior": {"years": "5+",  "salary": "$85k-$120k"},
        },
        "market_demand": "High",
        "growth_rate": "12%",
        "description": "WordPress Developers build and customize websites using WordPress CMS, themes, and plugins.",
    },

    "Content Writer": {
        "field": "Content & Marketing",
        "alternate_titles": ["Copywriter", "Content Creator", "Technical Writer",
                             "Blog Writer", "SEO Writer", "Content Strategist"],
        "required_skills": ["Content Writing", "Copywriting"],
        "important_skills": ["SEO", "Blogging", "Research", "Editing",
                             "WordPress", "Social Media", "Email Marketing"],
        "bonus_skills": ["Graphic Design", "Video Scripting", "Analytics", "Canva"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$30k-$45k"},
            "Mid":    {"years": "2-5", "salary": "$45k-$70k"},
            "Senior": {"years": "5+",  "salary": "$70k-$100k"},
        },
        "market_demand": "High",
        "growth_rate": "10%",
        "description": "Content Writers create compelling written content for websites, blogs, and marketing campaigns.",
    },

    "Social Media Manager": {
        "field": "Content & Marketing",
        "alternate_titles": ["Social Media Specialist", "Digital Marketing Specialist", "Community Manager"],
        "required_skills": ["Social Media", "Content Creation"],
        "important_skills": ["Instagram", "Facebook", "LinkedIn", "TikTok",
                             "Canva", "Hootsuite", "Analytics", "Copywriting"],
        "bonus_skills": ["Paid Ads", "SEO", "Email Marketing", "Video Editing", "Google Analytics"],
        "min_skills_needed": 3,
        "experience_levels": {
            "Junior": {"years": "0-2", "salary": "$32k-$48k"},
            "Mid":    {"years": "2-5", "salary": "$48k-$70k"},
            "Senior": {"years": "5+",  "salary": "$70k-$100k"},
        },
        "market_demand": "High",
        "growth_rate": "11%",
        "description": "Social Media Managers grow brand presence and engagement across social platforms.",
    },
}



# ─── Career Fields ─────────────────────────────────────────────────────────────

CAREER_FIELDS = {
    "Web Development": {
        "description": "Building websites and web applications",
        "careers": ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
    },
    "Mobile Development": {
        "description": "Building mobile applications",
        "careers": ["Android Developer", "iOS Developer", "React Native Developer", "Flutter Developer"],
    },
    "Data & Analytics": {
        "description": "Analyzing data for business insights",
        "careers": ["Data Analyst"],
    },
    "Data Science & AI": {
        "description": "Machine learning, AI, and data science",
        "careers": ["Data Scientist", "Machine Learning Engineer", "AI Engineer", "MLOps Engineer"],
    },
    "Data Engineering": {
        "description": "Building data pipelines and warehouses",
        "careers": ["Data Engineer"],
    },
    "DevOps & Cloud": {
        "description": "Cloud infrastructure and automation",
        "careers": ["DevOps Engineer", "Cloud Engineer"],
    },
    "Artificial Intelligence": {
        "description": "Building AI-powered products and agents",
        "careers": ["AI Engineer"],
    },
    "Cybersecurity": {
        "description": "Protecting systems from threats",
        "careers": ["Cybersecurity Analyst"],
    },
    "Design": {
        "description": "User experience and interface design",
        "careers": ["UX Designer"],
    },
    "Quality Assurance": {
        "description": "Software testing and quality",
        "careers": ["QA Engineer"],
    },
    "Engineering Management": {
        "description": "Leading engineering teams",
        "careers": ["Technical Lead"],
    },
    "Product Management": {
        "description": "Defining product strategy",
        "careers": ["Product Manager"],
    },
    "Blockchain & Web3": {
        "description": "Decentralized applications",
        "careers": ["Blockchain Developer"],
    },
    "Game Development": {
        "description": "Creating video games",
        "careers": ["Game Developer"],
    },
    "Database Management": {
        "description": "Managing database systems",
        "careers": ["Database Administrator"],
    },
    "Software Engineering": {
        "description": "System design and architecture",
        "careers": ["Software Architect"],
    },
    "Embedded & IoT": {
        "description": "Hardware and embedded software",
        "careers": ["Embedded Systems Engineer"],
    },
    "Design & Creative": {
        "description": "Visual design, web design, and UI/UX",
        "careers": ["Web Designer", "Graphic Designer", "UI Designer"],
    },
    "Content & Marketing": {
        "description": "Content creation and social media marketing",
        "careers": ["Content Writer", "Social Media Manager"],
    },
}
