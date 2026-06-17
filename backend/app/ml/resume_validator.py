"""
File: ml/resume_validator.py
Purpose: Implements strict validation logic to ensure uploaded documents are actual resumes by checking for contact info, section headers, job titles, and action verbs while rejecting job descriptions and non-resume documents.
Missing Impact: The system could be easily bypassed with invalid documents, leading to errors in parsing and incorrect analysis results.
"""
import re
from typing import Dict, List, Tuple


class ResumeValidator:
    """Strictly validate if document is a REAL resume"""
    
    # MUST have these for a resume
    REQUIRED_RESUME_INDICATORS = [
        # Contact patterns
        r'[\w.-]+@[\w.-]+\.\w{2,}',  # Email
        r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,}',  # Phone
    ]
    
    # Resume section keywords (at least 2 required)
    RESUME_SECTIONS = [
        "experience", "education", "skills", "work history",
        "employment", "professional experience", "work experience",
        "objective", "summary", "profile", "qualifications",
        "certifications", "projects", "achievements",
        # Additional CV/resume formats
        "curriculum vitae", "career objective", "career summary",
        "professional profile", "personal information", "personal details",
        "languages", "training", "academic background",
        "technical skills", "key skills", "core competencies",
        "internship", "volunteer", "extracurricular",
    ]

    # Job title keywords (indicates it's a person's resume)
    JOB_TITLES = [
        "developer", "engineer", "manager", "analyst", "designer",
        "consultant", "specialist", "coordinator", "administrator",
        "director", "lead", "senior", "junior", "intern", "associate",
        "architect", "scientist", "researcher", "executive", "officer",
        "assistant", "supervisor", "technician", "programmer",
        # Modern / specialized roles
        "automation", "devops", "cloud", "data", "software", "ai",
        "fullstack", "full-stack", "frontend", "backend", "mobile",
        "security", "platform", "infrastructure", "marketing", "sales",
        # Student / entry-level
        "student", "graduate", "fresher", "trainee",
    ]

    # Action verbs (resumes have these)
    ACTION_VERBS = [
        "developed", "managed", "led", "created", "implemented",
        "designed", "built", "achieved", "improved", "increased",
        "reduced", "launched", "established", "coordinated", "organized",
        "supervised", "trained", "mentored", "delivered", "executed",
        # Additional tech / automation verbs
        "automated", "deployed", "integrated", "optimized", "streamlined",
        "migrated", "configured", "maintained", "resolved", "analyzed",
        "architected", "engineered", "programmed", "tested", "reviewed",
        "collaborated", "operated", "monitored", "eliminated", "scaled",
    ]
    
    # NOT a resume if these dominate
    JOB_DESCRIPTION_INDICATORS = [
        "we are looking", "we're looking", "we are seeking",
        "job description", "job posting", "position overview",
        "apply now", "submit your application", "send your resume",
        "what we offer", "benefits include", "salary range",
        "equal opportunity employer", "eoe", "about the company",
        "the ideal candidate", "you will be responsible for",
        "who we are", "join our team", "we offer competitive",
    ]

    # Definitely NOT a resume (use specific phrases, not single common words)
    NON_RESUME_INDICATORS = [
        "invoice number", "invoice #", "total amount due", "amount payable",
        "payment receipt", "receipt number", "paid in full",
        "terms and conditions", "terms & conditions",
        "chapter 1", "chapter 2", "table of contents",
        "dear sir", "dear madam", "to whom it may concern",
        "sincerely,", "best wishes,",
        "meeting minutes", "memorandum",
        "lorem ipsum", "sample text", "placeholder text",
    ]
    
    def validate(self, text: str) -> Dict:
        """
        STRICT resume validation
        Returns detailed validation result
        """
        if not text:
            return self._rejection("Empty document - no text found")
        
        text_lower = text.lower()
        word_count = len(text.split())
        
        issues = []
        
        # ===== CHECK 1: Minimum Length =====
        if word_count < 50:
            return self._rejection(
                "Document too short",
                ["Document has only {} words. Resumes typically have 150+ words.".format(word_count)],
                ["Upload a complete resume with all sections"]
            )
        
        # ===== CHECK 2: Must have contact info =====
        has_email = bool(re.search(r'[\w.-]+@[\w.-]+\.\w{2,}', text))
        has_phone = bool(re.search(r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,}', text))
        
        if not has_email and not has_phone:
            return self._rejection(
                "No contact information found",
                ["Resume must have email or phone number"],
                ["Add your email address and phone number at the top"]
            )
        
        # ===== CHECK 3: Is this a Job Description? =====
        jd_score = self._count_matches(text_lower, self.JOB_DESCRIPTION_INDICATORS)
        if jd_score >= 3:
            return self._rejection(
                "This appears to be a JOB DESCRIPTION, not a resume",
                [
                    "Found {} job description phrases".format(jd_score),
                    "Phrases like 'we are looking', 'apply now' indicate this is a job posting"
                ],
                ["Please upload YOUR resume, not a job description"]
            )
        
        # ===== CHECK 4: Is this some other document? =====
        non_resume_score = self._count_matches(text_lower, self.NON_RESUME_INDICATORS)
        if non_resume_score >= 2:
            return self._rejection(
                "This is NOT a resume",
                [
                    "Document appears to be: invoice, contract, letter, or article",
                    "Found {} non-resume indicators".format(non_resume_score)
                ],
                ["Please upload a proper resume/CV document"]
            )
        
        # ===== CHECK 5: Has resume sections? =====
        section_count = self._count_matches(text_lower, self.RESUME_SECTIONS)
        if section_count < 2:
            return self._rejection(
                "Missing standard resume sections",
                [
                    "Could not find sections like: Experience, Education, Skills",
                    "Only found {} resume section keywords".format(section_count)
                ],
                [
                    "Add clear section headers: EXPERIENCE, EDUCATION, SKILLS",
                    "Make sure your resume has proper formatting"
                ]
            )
        
        # ===== CHECK 6: Has job titles or action verbs? =====
        title_count = self._count_matches(text_lower, self.JOB_TITLES)
        verb_count = self._count_matches(text_lower, self.ACTION_VERBS)
        
        if title_count == 0 and verb_count < 2:
            return self._rejection(
                "Document doesn't look like a resume",
                [
                    "No job titles found (developer, engineer, manager, etc.)",
                    "No action verbs found (developed, managed, created, etc.)"
                ],
                [
                    "Include your job titles in experience section",
                    "Use action verbs to describe your achievements"
                ]
            )
        
        # ===== CHECK 7: Has dates? =====
        has_years = bool(re.search(r'\b(19|20)\d{2}\b', text))
        has_date_words = bool(re.search(r'\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec|present|current)\b', text_lower))
        
        if not has_years and not has_date_words:
            issues.append("No dates found - resumes should have employment/education dates")
        
        # ===== PASSED ALL CHECKS =====
        confidence = self._calculate_confidence(
            has_email, has_phone, section_count, title_count, verb_count, len(issues)
        )
        
        return {
            "is_valid": True,
            "confidence": confidence,
            "reason": "Valid resume detected",
            "issues": issues,
            "suggestions": [],
            "stats": {
                "word_count": word_count,
                "has_email": has_email,
                "has_phone": has_phone,
                "section_count": section_count,
                "job_titles_found": title_count,
                "action_verbs_found": verb_count,
            }
        }
    
    def _rejection(self, reason: str, issues: List[str] = None, suggestions: List[str] = None) -> Dict:
        """Return rejection result"""
        return {
            "is_valid": False,
            "confidence": 0.0,
            "reason": reason,
            "issues": issues or [reason],
            "suggestions": suggestions or ["Please upload a valid resume"]
        }
    
    def _count_matches(self, text: str, patterns: List[str]) -> int:
        """Count how many patterns match in text"""
        count = 0
        for pattern in patterns:
            if pattern.lower() in text:
                count += 1
        return count
    
    def _calculate_confidence(self, has_email, has_phone, sections, titles, verbs, issues) -> float:
        """Calculate confidence score"""
        score = 0.5
        
        if has_email:
            score += 0.1
        if has_phone:
            score += 0.1
        if sections >= 3:
            score += 0.15
        if titles >= 2:
            score += 0.1
        if verbs >= 3:
            score += 0.1
        
        score -= issues * 0.05
        
        return round(max(0.1, min(1.0, score)), 2)
