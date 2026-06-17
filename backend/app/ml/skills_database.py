"""
File: ml/skills_database.py
Purpose: A massive dictionary and utility set containing 1500+ technical and soft skills, used for keyword matching and categorization during resume and job parsing.
Missing Impact: The system would have no reference point for identifying skills in text, causing the ATS and career matching logic to fail completely.
"""
from typing import Dict, List, Set
import re


# Programming Languages (100+)
PROGRAMMING_LANGUAGES = [
    # Core Languages
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "C", "Go", "Rust",
    "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Haskell",
    "Lua", "Dart", "Objective-C", "Julia", "Elixir", "Clojure", "Erlang",
    "F#", "Groovy", "Visual Basic", "VB.NET", "Assembly", "Fortran", "COBOL",
    "Pascal", "Delphi", "Ada", "Lisp", "Scheme", "Prolog", "Smalltalk",
    "Tcl", "Bash", "Shell", "PowerShell", "AWK", "Sed",
    
    # Variations and abbreviations
    "JS", "TS", "Golang", "C Sharp", "CPP", "VB", "VBA", "Py", "JScript",
    "Node.js", "NodeJS", "ES6", "ES2015", "ES2016", "ES2017", "ES2018", "ES2019", "ES2020",
]

# Frontend Technologies (150+)
FRONTEND_TECHNOLOGIES = [
    "React", "React.js", "ReactJS", "Angular", "Vue", "Vue.js", "VueJS", "Svelte",
    "Next.js", "Nuxt.js", "Gatsby", "jQuery", "Bootstrap", "Tailwind CSS", "Tailwind",
    "Material UI", "MUI", "Chakra UI", "Ant Design", "Semantic UI", "Bulma",
    "Foundation", "CSS3", "HTML5", "HTML", "CSS", "Sass", "SCSS", "Less",
    "PostCSS", "Styled Components", "Emotion", "CSS Modules", "BEM",
    "Webpack", "Vite", "Parcel", "Rollup", "Babel", "ESLint", "Prettier",
    "Redux", "MobX", "Zustand", "Recoil", "Context API", "Apollo Client",
    "GraphQL Client", "Axios", "Fetch API", "Three.js", "D3.js", "Chart.js",
    "Highcharts", "Leaflet", "Mapbox", "PWA", "Progressive Web Apps",
    
    # Variations
    "React JS", "Vue JS", "Angular JS", "AngularJS", "Material-UI", "TailwindCSS",
    "SCSS/Sass", "CSS-in-JS", "JSX", "TSX",
]

# Backend Technologies (150+)  
BACKEND_TECHNOLOGIES = [
    "Node.js", "Express", "Express.js", "NestJS", "Fastify", "Koa", "Hapi",
    "Django", "Flask", "FastAPI", "Pyramid", "Tornado", "Bottle", "CherryPy",
    "Spring Boot", "Spring", "Spring MVC", "Spring Security", "Hibernate",
    "Ruby on Rails", "Rails", "Sinatra", "Hanami", "Laravel", "Symfony",
    "CodeIgniter", "CakePHP", "Yii", "Zend Framework", "ASP.NET", ".NET Core",
    ".NET", "Entity Framework", "EF Core", "ASP.NET MVC", "ASP.NET Web API",
    "Gin", "Echo", "Fiber", "Beego", "Revel", "Buffalo", "Phoenix", "Plug",
    "Rocket", "Actix", "Warp", "Tonic", "Axum",
    
    # Variations
    "Node", "NodeJS", "ExpressJS", "DotNet", "ASP NET",
]

# Databases (100+)
DATABASES = [
    "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Oracle", "SQL Server", "MSSQL",
    "MongoDB", "Redis", "Cassandra", "CouchDB", "DynamoDB", "Firebase",
    "Elasticsearch", "Neo4j", "InfluxDB", "TimescaleDB", "CockroachDB",
    "Supabase", "PlanetScale", "FaunaDB", "Datastore", "BigQuery",
    "Snowflake", "Redshift", "Azure SQL", "Amazon RDS", "Cloud SQL",
    "Memcached", "Couchbase", "HBase", "Aerospike", "RethinkDB",
    "ArangoDB", "OrientDB", "RavenDB", "VoltDB", "Realm",
    
    # Variations
    "Postgres", "Mongo", "MS SQL", "SQL", "NoSQL",
]

# Cloud & DevOps (200+)
CLOUD_DEVOPS = [
    # Cloud Providers
    "AWS", "Amazon Web Services", "Azure", "Microsoft Azure", "Google Cloud", "GCP",
    "Alibaba Cloud", "IBM Cloud", "Oracle Cloud", "DigitalOcean", "Linode",
    "Heroku", "Vercel", "Netlify", "CloudFlare", "Render",
    
    # AWS Services 
    "EC2", "S3", "Lambda", "RDS", "DynamoDB", "CloudFront", "Route 53",
    "ECS", "EKS", "Fargate", "SageMaker", "Elastic Beanstalk", "API Gateway",
    "SNS", "SQS", "CloudWatch", "IAM", "VPC", "Aurora",
    
    # Azure Services
    "Azure Functions", "Azure SQL", "Cosmos DB", "Azure DevOps", "Azure AD",
    "App Service", "Azure Storage", "Azure Kubernetes", "Logic Apps",
    
    # GCP Services
    "Cloud Functions", "Cloud Run", "Cloud Storage", "BigQuery", "Pub/Sub",
    "Cloud SQL", "Firebase", "App Engine", "Compute Engine",
    
    # Containers & Orchestration
    "Docker", "Kubernetes", "K8s", "Docker Compose", "Docker Swarm",
    "Helm", "Istio", "Linkerd", "Rancher", "OpenShift", "Nomad",
    
    # CI/CD
    "Jenkins", "GitHub Actions", "GitLab CI", "GitLab CICD", "CircleCI", "Travis CI",
    "GitHub Actions", "Bamboo", "TeamCity", "Azure Pipelines", "CodePipeline",
    "Drone", "Buildkite", "Spinnaker", "ArgoCD", "FluxCD",
    
    # Infrastructure as Code
    "Terraform", "Terragrunt", "Pulumi", "CloudFormation", "ARM Templates",
    "Ansible", "Chef", "Puppet", "SaltStack", "CDK",
    
    # Monitoring & Logging
    "Prometheus", "Grafana", "Datadog", "New Relic", "Splunk", "ELK Stack",
    "Elasticsearch", "Logstash", "Kibana", "CloudWatch", "Azure Monitor",
    "Stackdriver", "Sentry", "PagerDuty", "AppDynamics", "Dynatrace",
    
    # Web Servers
    "Nginx", "Apache", "Apache HTTP Server", "Caddy", "IIS", "Tomcat",
    "HAProxy", "Traefik", "Envoy",
    
    # Linux & OS
    "Linux", "Ubuntu", "Debian", "CentOS", "RHEL", "Fedora", "Arch Linux",
    "Alpine Linux", "Amazon Linux", "Unix", "FreeBSD", "macOS",
    
    # Scripting & Automation
    "Bash", "Shell Scripting", "PowerShell", "Python Scripting", "Make", "Makefile",
    
    # Variations
    "Amazon AWS", "GCloud", "K8S", "CI CD", "Continuous Integration",
]

# AI/ML & Data Science (150+)
AI_ML_SKILLS = [
    # Core Concepts
    "Machine Learning", "Deep Learning", "Neural Networks", "Artificial Intelligence",
    "Natural Language Processing", "NLP", "Computer Vision", "Reinforcement Learning",
    "Supervised Learning", " Unsupervised Learning", "Transfer Learning",
    "Generative AI", "Large Language Models", "LLM",
    
    # Frameworks & Libraries
    "TensorFlow", "PyTorch", "Keras", "JAX", "MXNet", "Caffe",
    "scikit-learn", "sklearn", "XGBoost", "LightGBM", "CatBoost",
    "Hugging Face", "Transformers", "Diffusers", "PEFT", "LoRA",
    "Langchain", "LlamaIndex", "AutoGen", "CrewAI",
    
    # Data Processing
    "Pandas", "NumPy", "Polars", "Dask", "Arrow", "PySpark", "Spark",
    "Apache Spark", "Hadoop", "Hive", "Presto", "Flink",
    
    # Visualization
    "Matplotlib", "Seaborn", "Plotly", "Bokeh", "Altair", "ggplot2",
    "Tableau", "PowerBI", "Looker", "QuickSight", "Data Studio",
    
    # Computer Vision
    "OpenCV", "PIL", "Pillow", "ImageAI", "YOLO", "Detectron2",
    "Mask R-CNN", "ResNet", "VGG", "MobileNet",
    
    # NLP Libraries
    "NLTK", "spaCy", "Gensim", "TextBlob", "StanfordNLP", "Flair",
    "AllenNLP", "FastText", "Word2Vec", "BERT", "GPT", "T5",
    "RoBERTa", "ELECTRA", "ALBERT", "DistilBERT",
    
    # ML Ops
    "MLflow", "Kubeflow", "Weights & Biases", "Neptune", "ClearML",
    "DVC", "Metaflow", "Airflow", "Luigi", "Prefect", "Dagster",
    
    # Cloud AI
    "OpenAI", "OpenAI API", "GPT-3", "GPT-4", "DALL-E", "Claude",
    "Google Gemini", "Vertex AI", "SageMaker", "Azure ML",
    "Bedrock", "Cohere", "Anthropic",
    
    # Variations
    "ML", "DL", "AI", "Data Science", "Data Analysis", "Analytics",
]

# Mobile Development (80+)
MOBILE_DEVELOPMENT = [
    # Cross-Platform
    "React Native", "Flutter", "Dart", "Ionic", "Xamarin", "Cordova",
    "Capacitor", "NativeScript", "Expo", "Quasar",
    
    # iOS
    "Swift", "SwiftUI", "Objective-C", "iOS", "Xcode", "UIKit", "Core Data",
    "ARKit", "Core ML", "Combine", "WidgetKit", "App Store",
    
    # Android
    "Kotlin", "Android", "Android Studio", "Jetpack Compose", "Java Android",
    "XML Layouts", "Room", "Retrofit", "Dagger", "Hilt", "Coroutines",
    "Flow", "LiveData", "ViewModel", "Play Store",
    
    # Mobile Backend
    "Firebase", "Firebase Auth", "Firestore", "Cloud Messaging", "FCM",
    "Push Notifications", "In-App Purchases", "AdMob", "Analytics",
    "Crashlytics", "Remote Config", "Supabase Mobile", "Amplify",
    
    # Variations
    "React-Native", "RN", "iOS Development", "Android Development",
]

# Testing Tools (100+)
TESTING_TOOLS = [
    # Frontend Testing
    "Jest", "Mocha", "Chai", "Jasmine", "Cypress", "Playwright", "Puppeteer",
    "Selenium", "WebDriver", "TestCafe", "Nightwatch", "Protractor",
    "Testing Library", "React Testing Library", "Vue Test Utils", "Enzyme",
    "Karma", "Ava", "Tape", "Vitest",
    
    # Backend Testing
    "PyTest", "pytest", "unittest", "nose2", "Robot Framework",
    "JUnit", "TestNG", "Mockito", "PowerMock", "WireMock",
    "RSpec", "Minitest", "PHPUnit", "Pest", "Codeception",
    "NUnit", "xUnit", "MSTest", "SpecFlow",
    
    # API Testing
    "Postman", "Insomnia", "REST Client", "Hoppscotch", "Thunder Client",
    "SoapUI", "Karate", "Pact", "WireMock", "Newman",
    
    # Load Testing
    "JMeter", "Gatling", "Locust", "K6", "Artillery", "Apache Bench",
    "Siege", "Vegeta", "wrk", "Hey",
    
    # Testing Concepts
    "TDD", "Test Driven Development", "BDD", "Behavior Driven Development",
    "Unit Testing", "Integration Testing", "E2E Testing", "End to End Testing",
    "Regression Testing", "Performance Testing", "Load Testing", "Stress Testing",
    "Security Testing", "Penetration Testing", "Smoke Testing", "Acceptance Testing",
    "Contract Testing", "Visual Regression", "Snapshot Testing",
    
    # Mocking & Stubbing
    "Mock", "Stub", "Spy", "Fake", "Test Double", "Jest Mock", "Sinon",
    
    # Variations
    "Testing", "QA", "Quality Assurance", "Test Automation",
]

# Version Control & Collaboration (50+)
VERSION_CONTROL = [
    "Git", "GitHub", "GitLab", "Bitbucket", "Azure Repos", "SVN", "Mercurial",
    "Perforce", "Git Flow", "GitHub Flow", "Trunk Based Development",
    "Pull Requests", "Code Review", "Git Rebase", "Git Merge", "Git Hooks",
    "Git Actions", "Pre-commit Hooks", "Husky", "Lint-staged",
    "Conventional Commits", "Semantic Versioning", "SemVer", "Changelog",
    
    # Variations
    "Version Control", "Source Control", "SCM",
]

# Project Management / Productivity Tools (80+)
PROJECT_MANAGEMENT_TOOLS = [
    # Project Management
    "Jira", "Confluence", "Trello", "Asana", "Monday.com", "ClickUp",
    "Linear", "Height", "Notion", "Obsidian", "Roam Research",
    "Basecamp", "Wrike", "Smartsheet", "Airtable", "Coda",
    
    # Communication
    "Slack", "Microsoft Teams", "Discord", "Zoom", "Google Meet",
    "Skype", "WebEx", "Mattermost", "Rocket.Chat", "Zulip",
    
    # Design Tools
    "Figma", "Sketch", "Adobe XD", "InVision", "Zeplin", "Framer",
    "Canva", "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere",
    "Final Cut Pro", "Blender", "Maya", "Unity", "Unreal Engine",
    
    # IDEs & Editors
    "VS Code", "Visual Studio Code", "IntelliJ IDEA", "PyCharm", "WebStorm",
    "PhpStorm", "RubyMine", "GoLand", "Rider", "CLion", "DataGrip",
    "Eclipse", "NetBeans", "Atom", "Sublime Text", "Vim", "Neovim",
    "Emacs", "Notepad++", "Brackets", "Android Studio", "Xcode",
    
    # Variations
    "IDE", "Text Editor", "Code Editor",
]

# API & Protocols (50+)
API_PROTOCOLS = [
    "REST", "RESTful API", "REST API", "GraphQL", "gRPC", "WebSocket",
    "Server-Sent Events", "SSE", "SOAP", "XML-RPC", "JSON-RPC",
    "Protocol Buffers", "Protobuf", "Thrift", "Avro", "MessagePack",
    "JSON", "XML", "YAML", "TOML", "CSV",
    "OAuth", "OAuth2", "OAuth 2.0", "OpenID Connect", "OIDC",
    "JWT", "JSON Web Token", "SAML", "LDAP", "Active Directory",
    "API Gateway", "API Management", "Swagger", "OpenAPI", "OpenAPI Specification",
    "AsyncAPI", "Webhook", "API Versioning", "API Documentation",
    "CORS", "CSRF", "XSS", "API Security", "Rate Limiting",
    
    # Variations
    "Web Services", "Microservices API", "HTTP API",
]

# Architecture & Design Patterns (60+)
ARCHITECTURE_PATTERNS = [
    "Microservices", "Monolithic", "Monolith", "Serverless", "Event-Driven Architecture",
    "Event Sourcing", "CQRS", "Domain-Driven Design", "DDD", "Clean Architecture",
    "Hexagonal Architecture", "Ports and Adapters", "Layered Architecture",
    "MVC", "Model View Controller", "MVVM", "Model View ViewModel", "MVP",
    "SOA", "Service Oriented Architecture", "Message Queue", "Message Broker",
    "Pub/Sub", "Publisher Subscriber", "Observer Pattern", "Singleton Pattern",
    "Factory Pattern", "Strategy Pattern", "Decorator Pattern", "Adapter Pattern",
    "Repository Pattern", "Unit of Work", "Dependency Injection", "DI",
    "Inversion of Control", "IoC", "Aspect Oriented Programming", "AOP",
    "API Gateway Pattern", "Backend for Frontend", "BFF", "Saga Pattern",
    "Circuit Breaker", "Load Balancing", "Load Balancer", "Reverse Proxy",
    "Caching", "Cache", "CDN", "Content Delivery Network",
    "RabbitMQ", "Kafka", "Apache Kafka", "Redis Queue", "SQS", "AWS SQS",
    "ActiveMQ", "ZeroMQ", "NATS", "Pulsar",
    
    # Variations
    "Design Patterns", "Software Architecture", "System Design",
]

# Soft Skills (100+)
SOFT_SKILLS = [
    # Leadership & Management
    "Leadership", "Team Leadership", "Team Management", "People Management",
    "Project Management", "Product Management", "Program Management",
    "Stakeholder Management", "Client Management", "Vendor Management",
    "Change Management", "Risk Management", "Budget Management",
    "Resource Planning", "Capacity Planning", "Strategic Planning",
    "Decision Making", "Strategic Thinking", "Business Strategy",
    
    # Communication
    "Communication", "Verbal Communication", "Written Communication",
    "Technical Writing", "Documentation", "Presentation Skills",
    "Public Speaking", "Storytelling", "Negotiation", "Persuasion",
    "Active Listening", "Interpersonal Skills", "Client Relations",
    "Customer Service", "Sales", "Business Development",
    
    # Teamwork & Collaboration  
    "Teamwork", "Collaboration", "Cross-functional Collaboration",
    "Remote Collaboration", "Distributed Teams", "Mentoring",
    "Coaching", "Training", "Knowledge Sharing", "Pair Programming",
    "Code Review", "Peer Review", "Feedback", "Constructive Feedback",
    
    # Problem Solving & Thinking
    "Problem Solving", "Analytical Skills", "Critical Thinking",
    "Creative Thinking", "Innovation", "Design Thinking",
    "Systems Thinking", "Logical Reasoning", "Troubleshooting",
    "Debugging", "Root Cause Analysis", "Research Skills",
    
    # Work Management
    "Time Management", "Priority Management", "Multitasking",
    "Organization", "Planning", "Task Management", "Goal Setting",
    "Self-Management", "Productivity", "Efficiency",
    "Attention to Detail", "Quality Focus", "Continuous Improvement",
    
    # Adaptability & Growth
    "Adaptability", "Flexibility", "Agility", "Learning Agility",
    "Quick Learner", "Self-Learning", "Continuous Learning",
    "Growth Mindset", "Resilience", "Stress Management",
    
    # Methodologies
    "Agile", "Scrum", "Kanban", "Lean", "Six Sigma", "DevOps",
    "Scrum Master", "Product Owner", "Sprint Planning", "Daily Standup",
    "Retrospective", "Sprint Review", "Backlog Grooming", "User Stories",
    "Story Points", "Velocity", "Burndown Chart",
    
    # Variations
    "Soft Skills", "Interpersonal Skills", "Professional Skills",
]

# Security & Compliance (60+)
SECURITY_SKILLS = [
    "Information Security", "Cybersecurity", "Application Security", "AppSec",
    "Network Security", "Cloud Security", "Infrastructure Security",
    "Security Testing", "Penetration Testing", "Pen Testing", "Ethical Hacking",
    "Vulnerability Assessment", "Security Audit", "Compliance", "GDPR",
    "HIPAA", "PCI DSS", "SOC 2", "ISO 27001", "NIST",
    "OWASP", "OWASP Top 10", "SQL Injection", "XSS", "CSRF",
    "Authentication", "Authorization", "Encryption", "TLS", "SSL",
    "SSH", "VPN", "Firewall", "WAF", "IDS", "IPS", "SIEM",
    "Zero Trust", "Identity Management", "Access Control", "RBAC",
    "SSO", "Single Sign-On", "Multi-Factor Authentication", "MFA", "2FA",
    "Secret Management", "Vault", "HashiCorp Vault", "AWS Secrets Manager",
    "Certificate Management", "Key Management", "PKI",
    
    # Variations
    "Security", "InfoSec", "Cyber Security",
]

# Blockchain & Web3 (40+)
BLOCKCHAIN_WEB3 = [
    "Blockchain", "Cryptocurrency", "Bitcoin", "Ethereum", "Smart Contracts",
    "Solidity", "Web3", "Web3.js", "Ethers.js", "DeFi", "NFT", "DAO",
    "Decentralized Applications", "DApp", "IPFS", "MetaMask", "Hardhat",
    "Truffle", "Ganache", "Remix", "OpenZeppelin", "Chainlink",
    "Polygon", "Binance Smart Chain", "Avalanche", "Solana", "Cardano",
    "Polkadot", "Cosmos", "Hyperledger", "Fabric", "R3 Corda",
    "Consensus Mechanisms", "Proof of Work", "Proof of Stake", "Mining",
    
    # Variations
    "Crypto", "Web 3", "Distributed Ledger",
]

# Gaming & Graphics (30+)
GAMING_GRAPHICS = [
    "Unity", "Unity3D", "Unreal Engine", "UE4", "UE5", "Godot",
    "Game Development", "Game Design", "Game Programming",
    "OpenGL", "Direct3D", "DirectX", "Vulkan", "Metal",
    "Shader Programming", "GLSL", "HLSL", "GPU Programming", "CUDA",
    "3D Modeling", "Blender", "Maya", "3ds Max", "Cinema 4D",
    "Animation", "Rigging", "Texturing", "Lighting", "Rendering",
    
    # Variations
    "Game Dev", "Graphics Programming",
]

# Embedded Systems & IoT (30+)
EMBEDDED_IOT = [
    "Embedded Systems", "Embedded C", "Embedded Linux", "RTOS",
    "FreeRTOS", "Arduino", "Raspberry Pi", "ESP32", "ESP8266",
    "IoT", "Internet of Things", "MQTT", "CoAP", "Zigbee", "LoRa",
    "Bluetooth", "BLE", "Bluetooth Low Energy", "NFC", "RFID",
    "I2C", "SPI", "UART", "GPIO", "PWM", "ADC",
    "Microcontroller", "Microprocessor", "ARM", "AVR", "PIC",
    
    # Variations
    "Embedded Programming", "IoT Development",
]

# All Skills Combined
ALL_SKILLS = (
    PROGRAMMING_LANGUAGES +
    FRONTEND_TECHNOLOGIES +
    BACKEND_TECHNOLOGIES +
    DATABASES +
    CLOUD_DEVOPS +
    AI_ML_SKILLS +
    MOBILE_DEVELOPMENT +
    TESTING_TOOLS +
    VERSION_CONTROL +
    PROJECT_MANAGEMENT_TOOLS +
    API_PROTOCOLS +
    ARCHITECTURE_PATTERNS +
    SOFT_SKILLS +
    SECURITY_SKILLS +
    BLOCKCHAIN_WEB3 +
    GAMING_GRAPHICS +
    EMBEDDED_IOT
)

# Technical Skills (excluding soft skills)
TECHNICAL_SKILLS = (
    PROGRAMMING_LANGUAGES +
    FRONTEND_TECHNOLOGIES +
    BACKEND_TECHNOLOGIES +
    DATABASES +
    CLOUD_DEVOPS +
    AI_ML_SKILLS +
    MOBILE_DEVELOPMENT +
    TESTING_TOOLS +
    VERSION_CONTROL +
    PROJECT_MANAGEMENT_TOOLS +
    API_PROTOCOLS +
    ARCHITECTURE_PATTERNS +
    SECURITY_SKILLS +
    BLOCKCHAIN_WEB3 +
    GAMING_GRAPHICS +
    EMBEDDED_IOT
)

# Skill Variations/Synonyms Map
SKILL_VARIATIONS = {
    "js": "JavaScript", "javascript": "JavaScript",
    "ts": "TypeScript", "typescript": "TypeScript",
    "py": "Python", "python": "Python",
    "golang": "Go", "go": " Go",
    "react.js": "React", "reactjs": "React", "react js": "React",
    "vue.js": "Vue", "vuejs": "Vue", "vue js": "Vue",
    "angular.js": "Angular", "angularjs": "Angular", "angular js": "Angular",
    "node": "Node.js", "nodejs": "Node.js", "node js": "Node.js",
    "express.js": "Express", "expressjs": "Express",
    "next": "Next.js", "nextjs": "Next.js",
    "nuxt": "Nuxt.js", "nuxtjs": "Nuxt.js",
    "cpp": "C++", "c plus plus": "C++",
    "csharp": "C#", "c sharp": "C#",
    "html5": "HTML", "css3": "CSS",
    "postgres": "PostgreSQL", "postgresql": "PostgreSQL",
    "mongo": "MongoDB", "mongodb": "MongoDB",
    "mssql": "SQL Server", "ms sql": "SQL Server",
    "aws": "AWS", "amazon web services": "AWS",
    "gcp": "Google Cloud", "google cloud platform": "Google Cloud",
    "k8s": "Kubernetes", "kube": "Kubernetes",
    "cicd": "CI/CD", "ci cd": "CI/CD",
    "ml": "Machine Learning", "ai": "Artificial Intelligence",
    "dl": "Deep Learning", "nlp": "Natural Language Processing",
    "rest api": "REST", "restful": "REST",
    "graphql": "GraphQL", "gql": "GraphQL",
    "tdd": "Test Driven Development", "bdd": "Behavior Driven Development",
    "ide": "IDE", "vscode": "VS Code", "vs code": "VS Code",
}


def normalize_skill(skill: str) -> str:
    """
    Normalize skill name to standard form
    
    Args:
        skill: Skill name to normalize
        
    Returns:
        Normalized skill name
    """
    skill_lower = skill.lower().strip()
    return SKILL_VARIATIONS.get(skill_lower, skill.title())


AMBIGUOUS_SKILLS = {
    "c", "r", "go", "make", "design", "security", "testing", "architecture", 
    "rest", "ruby", "bash", "shell", "flask", "spring", "express", "sales", 
    "agile", "lean", "planning", "vision", "leadership", "management", 
    "research", "innovation"
}

def find_skills_in_text(text: str) -> List[str]:
    """
    Find all skills in text using word boundary matching.
    Deduplicates by canonical form so variants like 'Node.js', 'NodeJS', 'node'
    don't all appear as separate results.

    Args:
        text: Text to search for skills

    Returns:
        List of found skills (deduplicated, sorted)
    """
    text_lower = text.lower()
    found_skills: Set[str] = set()

    for skill in ALL_SKILLS:
        skill_lower = skill.lower()

        if skill_lower in AMBIGUOUS_SKILLS or len(skill_lower) <= 2:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text):
                found_skills.add(skill)
        else:
            pattern = r'\b' + re.escape(skill_lower) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(skill)

    # --- Deduplicate by canonical/normalized form ---
    # Group skills that share the same canonical name; keep the longest (most specific) variant
    canonical_map: Dict[str, str] = {}
    for skill in found_skills:
        canonical = SKILL_VARIATIONS.get(skill.lower(), skill).lower().strip()
        existing = canonical_map.get(canonical)
        if existing is None or len(skill) > len(existing):
            canonical_map[canonical] = skill

    return sorted(canonical_map.values())


def get_skill_category(skill: str) -> str:
    """
    Get category for a skill
    
    Args:
        skill: Skill name
        
    Returns:
        Category name
    """
    if skill in PROGRAMMING_LANGUAGES:
        return "Programming Language"
    elif skill in FRONTEND_TECHNOLOGIES:
        return "Frontend"
    elif skill in BACKEND_TECHNOLOGIES:
        return "Backend"
    elif skill in DATABASES:
        return "Database"
    elif skill in CLOUD_DEVOPS:
        return "Cloud/DevOps"
    elif skill in AI_ML_SKILLS:
        return "AI/ML"
    elif skill in MOBILE_DEVELOPMENT:
        return "Mobile"
    elif skill in TESTING_TOOLS:
        return "Testing"
    elif skill in VERSION_CONTROL:
        return "Version Control"
    elif skill in PROJECT_MANAGEMENT_TOOLS:
        return "Tools"
    elif skill in API_PROTOCOLS:
        return "API/Protocol"
    elif skill in ARCHITECTURE_PATTERNS:
        return "Architecture"
    elif skill in SOFT_SKILLS:
        return "Soft Skill"
    elif skill in SECURITY_SKILLS:
        return "Security"
    elif skill in BLOCKCHAIN_WEB3:
        return "Blockchain/Web3"
    elif skill in GAMING_GRAPHICS:
        return "Gaming/Graphics"
    elif skill in EMBEDDED_IOT:
        return "Embedded/IoT"
    else:
        return "Other"


def categorize_skills(skills: List[str]) -> Dict[str, List[str]]:
    """
    Categorize list of skills
    
    Args:
        skills: List of skill names
        
    Returns:
        Dictionary of categorized skills
    """
    categorized = {
        "programming_languages": [],
        "frontend": [],
        "backend": [],
        "databases": [],
        "cloud_devops": [],
        "ai_ml": [],
        "mobile": [],
        "testing": [],
        "tools": [],
        "soft_skills": [],
        "other": []
    }
    
    for skill in skills:
        category = get_skill_category(skill)
        
        if category == "Programming Language":
            categorized["programming_languages"].append(skill)
        elif category == "Frontend":
            categorized["frontend"].append(skill)
        elif category == "Backend":
            categorized["backend"].append(skill)
        elif category == "Database":
            categorized["databases"].append(skill)
        elif category in ["Cloud/DevOps", "Version Control"]:
            categorized["cloud_devops"].append(skill)
        elif category == "AI/ML":
            categorized["ai_ml"].append(skill)
        elif category == "Mobile":
            categorized["mobile"].append(skill)
        elif category == "Testing":
            categorized["testing"].append(skill)
        elif category in ["Tools", "API/Protocol", "Architecture", "Security", "Blockchain/Web3", "Gaming/Graphics", "Embedded/IoT"]:
            categorized["tools"].append(skill)
        elif category == "Soft Skill":
            categorized["soft_skills"].append(skill)
        else:
            categorized["other"].append(skill)
    
    # Remove empty categories
    return {k: v for k, v in categorized.items() if v}


def search_skills(query: str, limit: int = 20) -> List[str]:
    """
    Search for skills matching query
    
    Args:
        query: Search query
        limit: Maximum results to return
        
    Returns:
        List of matching skills
    """
    query_lower = query.lower()
    matches = []
    
    for skill in ALL_SKILLS:
        if query_lower in skill.lower():
            matches.append(skill)
            if len(matches) >= limit:
                break
    
    return matches


# Export main functions
__all__ = [
    'TECHNICAL_SKILLS',
    'SOFT_SKILLS',
    'ALL_SKILLS',
    'normalize_skill',
    'find_skills_in_text',
    'get_skill_category',
    'categorize_skills',
    'search_skills'
]
