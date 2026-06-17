"""
File: ml/scorer.py
Purpose: The core ATS scoring engine that calculates the compatibility score between a resume and a job description using weighted components (skills, experience, keywords, etc.).
Missing Impact: The system would be unable to provide an ATS score or identify matching/missing skills, making the application useless for its primary purpose.
"""
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from .skills_database import SKILL_VARIATIONS


class ATSScorer:
    """Calculate ATS compatibility scores between resumes and job descriptions."""
    
    def __init__(self):
        """Initialize the ATS scorer."""
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        
        # Score weights (must sum to 1.0)
        self.weights = {
            "skills": 0.40,      # 40% weight
            "experience": 0.25,  # 25% weight
            "keywords": 0.20,    # 20% weight
            "achievements": 0.10, # 10% weight
            "format": 0.05       # 5% weight
        }
    
    def calculate_score(
        self,
        resume_skills: List[str],
        resume_text: str,
        job_skills: List[str],
        job_keywords: List[str],
        job_text: str
    ) -> Dict[str, Any]:
        """
        Calculate comprehensive ATS score.
        
        Args:
            resume_skills: List of skills from resume
            resume_text: Full resume text
            job_skills: List of required skills from job description
            job_keywords: List of keywords from job description
            job_text: Full job description text
            
        Returns:
            Dictionary with score breakdown and analysis
        """
        # Calculate individual scores
        skills_result = self._calculate_skills_score(resume_skills, job_skills)
        keywords_result = self._calculate_keywords_score(resume_text, job_keywords)
        semantic_similarity = self._calculate_semantic_similarity(resume_text, job_text)
        achievements_score = self._calculate_achievements_score(resume_text)
        format_score = self._calculate_format_score(resume_text)
        
        # Use semantic similarity for experience score
        experience_score = semantic_similarity * 100
        
        # Calculate weighted total score
        total_score = (
            skills_result["score"] * self.weights["skills"] +
            experience_score * self.weights["experience"] +
            keywords_result["score"] * self.weights["keywords"] +
            achievements_score * self.weights["achievements"] +
            format_score * self.weights["format"]
        )
        
        # Ensure score is between 0 and 100
        total_score = max(0, min(100, total_score))
        
        return {
            "total_score": round(total_score, 2),
            "breakdown": {
                "skills_score": round(skills_result["score"], 2),
                "experience_score": round(experience_score, 2),
                "keywords_score": round(keywords_result["score"], 2),
                "achievements_score": round(achievements_score, 2),
                "format_score": round(format_score, 2)
            },
            "matched_skills": skills_result["matched"],
            "missing_skills": skills_result["missing"],
            "extra_skills": skills_result["extra"],
            "matched_keywords": keywords_result["matched"],
            "missing_keywords": keywords_result["missing"]
        }
    
    # Common abbreviation expansions for skill matching
    _ABBREV_MAP = {
        "js": "javascript", "ts": "typescript", "py": "python",
        "ml": "machine learning", "ai": "artificial intelligence",
        "dl": "deep learning", "nlp": "natural language processing",
        "cv": "computer vision", "oop": "object oriented programming",
        "db": "database", "sql": "structured query language",
        "api": "application programming interface", "ui": "user interface",
        "ux": "user experience", "ci": "continuous integration",
        "cd": "continuous deployment", "k8s": "kubernetes",
        "tf": "tensorflow", "pt": "pytorch", "np": "numpy",
        "pd": "pandas", "sk": "scikit-learn", "gcp": "google cloud",
        "aws": "amazon web services", "az": "microsoft azure",
        "vb": "visual basic", "cpp": "c++", "cs": "c#",
    }

    @classmethod
    def _normalize_skill(cls, skill: str) -> str:
        """Normalize a skill string for comparison: lowercase, strip punctuation, expand abbreviations."""
        s = skill.lower().strip()
        # Strip common punctuation variations (node.js → nodejs, c++ stays)
        s_stripped = re.sub(r'[.\-_]', '', s)
        # Expand known abbreviations
        expanded = cls._ABBREV_MAP.get(s, cls._ABBREV_MAP.get(s_stripped, s))
        return re.sub(r'\s+', ' ', expanded).strip()

    @classmethod
    def _skills_match(cls, a: str, b: str) -> bool:
        """Return True if two skills refer to the same thing."""
        na, nb = cls._normalize_skill(a), cls._normalize_skill(b)
        if na == nb:
            return True
        # Token-set overlap: all tokens of shorter skill appear in longer skill
        ta, tb = set(na.split()), set(nb.split())
        shorter, longer = (ta, tb) if len(ta) <= len(tb) else (tb, ta)
        if shorter and shorter.issubset(longer):
            return True
        # Alias lookup in SKILL_VARIATIONS
        va = SKILL_VARIATIONS.get(a.lower(), a.lower())
        vb = SKILL_VARIATIONS.get(b.lower(), b.lower())
        return va == vb

    def _calculate_skills_score(self, resume_skills: List[str], job_skills: List[str]) -> Dict:
        """
        Calculate skills match score with fuzzy/normalized matching.

        Returns:
            Dictionary with score, matched, missing, and extra skills
        """
        if not job_skills:
            return {
                "score": 100.0,
                "matched": [],
                "missing": [],
                "extra": resume_skills
            }

        matched = []
        missing = []

        for job_skill in job_skills:
            found = any(self._skills_match(job_skill, rs) for rs in resume_skills)
            if found:
                matched.append(job_skill.lower())
            else:
                missing.append(job_skill.lower())

        # Extra skills: resume skills not matched by any job skill
        extra = [
            rs.lower() for rs in resume_skills
            if not any(self._skills_match(rs, js) for js in job_skills)
        ]

        score = (len(matched) / len(job_skills)) * 100 if job_skills else 0

        return {
            "score": min(100, score),
            "matched": matched,
            "missing": missing,
            "extra": extra
        }
    
    def _calculate_keywords_score(self, resume_text: str, job_keywords: List[str]) -> Dict:
        """
        Calculate keywords match score.
        
        Returns:
            Dictionary with score, matched, and missing keywords
        """
        if not job_keywords:
            return {
                "score": 100.0,
                "matched": [],
                "missing": []
            }
        
        resume_text_lower = resume_text.lower()
        matched = []
        missing = []
        
        for keyword in job_keywords:
            keyword_lower = keyword.lower()
            # Check if keyword appears in resume (word boundary match)
            pattern = r'\b' + re.escape(keyword_lower) + r'\b'
            if re.search(pattern, resume_text_lower):
                matched.append(keyword)
            else:
                missing.append(keyword)
        
        # Calculate score: (matched / total keywords) * 100
        score = (len(matched) / len(job_keywords)) * 100 if job_keywords else 0
        
        return {
            "score": min(100, score),
            "matched": matched,
            "missing": missing
        }
    
    def _calculate_semantic_similarity(self, resume_text: str, job_text: str) -> float:
        """
        Calculate semantic similarity using TF-IDF + cosine similarity.
        
        Returns:
            Similarity value between 0 and 1
        """
        if not resume_text or not job_text:
            return 0.0
        
        try:
            # Fit vectorizer and transform texts
            tfidf_matrix = self.vectorizer.fit_transform([resume_text, job_text])
            
            # Calculate cosine similarity
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            return float(similarity)
        except Exception:
            return 0.0
    
    def _calculate_achievements_score(self, resume_text: str) -> float:
        """
        Calculate achievements score based on quantifiable achievements.
        
        Returns:
            Score between 0 and 100
        """
        if not resume_text:
            return 50.0
        
        base_score = 50.0
        achievements_count = 0
        
        # Look for percentages (X%)
        percentages = re.findall(r'\d+%', resume_text)
        achievements_count += len(percentages)
        
        # Look for dollar amounts ($X, $XK, $XM)
        dollar_amounts = re.findall(r'\$[\d,]+[KM]?', resume_text, re.IGNORECASE)
        achievements_count += len(dollar_amounts)
        
        # Look for numbers with achievement context
        achievement_patterns = [
            r'(?:increased|improved|reduced|saved|achieved|delivered)\s+(?:by\s+)?\d+',
            r'\d+\s*(?:times|fold|x)',
            r'(?:over|more than|up to)\s+\d+'
        ]
        
        for pattern in achievement_patterns:
            matches = re.findall(pattern, resume_text, re.IGNORECASE)
            achievements_count += len(matches)
        
        # Add points for each achievement (max 50 additional points)
        additional_points = min(50, achievements_count * 5)
        score = base_score + additional_points
        
        return min(100, score)
    
    def _calculate_format_score(self, resume_text: str) -> float:
        """
        Calculate format score based on structure and word count.
        
        Returns:
            Score between 0 and 100
        """
        if not resume_text:
            return 60.0
        
        base_score = 60.0
        word_count = len(resume_text.split())
        
        # Check for common sections
        section_keywords = {
            "experience": ["experience", "work history", "employment", "career"],
            "education": ["education", "academic", "qualifications", "degree"],
            "skills": ["skills", "technical skills", "competencies"],
            "summary": ["summary", "objective", "profile", "about"]
        }
        
        sections_found = 0
        text_lower = resume_text.lower()
        
        for section, keywords in section_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    sections_found += 1
                    break
        
        # Add points for sections found (max 20 points)
        section_points = min(20, sections_found * 5)
        
        # Check word count (optimal: 300-1500 words)
        word_count_score = 0
        if 300 <= word_count <= 1500:
            word_count_score = 10
        elif 150 <= word_count < 300 or 1500 < word_count <= 2000:
            word_count_score = 5
        
        score = base_score + section_points + word_count_score
        
        return min(100, score)

