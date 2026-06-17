"""
Job Description Validator - Sirf REAL job descriptions accept karega.
Random text, gibberish, ya non-JD content reject karega.
"""

import re
from collections import Counter
from dataclasses import dataclass, field


@dataclass
class JDValidationResult:
    """Validation ka result"""
    is_valid: bool = False
    confidence: float = 0.0
    issues: list = field(default_factory=list)
    suggestions: list = field(default_factory=list)
    details: dict = field(default_factory=dict)


class JDValidator:
    """Job Description Validator - strict checking"""

    # JD mein ye section headers hone chahiye
    JD_SECTION_HEADERS = [
        r'responsibilities', r'duties', r'what you\'?ll do',
        r'role overview', r'job duties', r'key responsibilities',
        r'about the role', r'job summary', r'position summary',
        r'the role', r'your role', r'day to day',
        r'requirements', r'qualifications', r'what we\'?re looking for',
        r'must have', r'who you are', r'ideal candidate',
        r'what you\'?ll need', r'minimum qualifications',
        r'preferred qualifications', r'basic qualifications',
        r'required skills', r'desired skills', r'prerequisites',
        r'experience required', r'skills required',
        r'what you\'?ll bring', r'you should have',
        r'about us', r'about the company', r'who we are',
        r'company overview', r'benefits', r'perks', r'what we offer',
        r'compensation', r'salary', r'why join',
        r'job description', r'position', r'overview',
        r'summary', r'introduction', r'location',
        r'job type', r'employment type', r'experience level',
    ]

    # Job titles jo JD mein hone chahiye
    JOB_TITLES = [
        r'software\s*(engineer|developer)', r'web\s*developer',
        r'full[\s-]?stack', r'front[\s-]?end', r'back[\s-]?end',
        r'data\s*(scientist|analyst|engineer)', r'ml\s*engineer',
        r'devops', r'cloud\s*engineer', r'qa\s*engineer',
        r'mobile\s*developer', r'ios\s*developer', r'android\s*developer',
        r'ui[\s/]?ux', r'product\s*designer', r'system\s*admin',
        r'database\s*admin', r'network\s*engineer', r'security\s*engineer',
        r'ai\s*engineer', r'machine\s*learning', r'blockchain',
        r'site\s*reliability', r'platform\s*engineer',
        r'technical\s*lead', r'tech\s*lead', r'cto', r'vp\s*engineering',
        r'architect', r'solutions?\s*architect',
        r'manager', r'director', r'analyst', r'coordinator',
        r'specialist', r'consultant', r'associate', r'executive',
        r'officer', r'administrator', r'supervisor', r'lead',
        r'head\s*of', r'vp\s*of', r'president', r'intern',
        r'trainee', r'accountant', r'marketing', r'sales',
        r'hr\s*(manager|specialist|coordinator)',
        r'project\s*manager', r'product\s*manager',
        r'business\s*analyst', r'financial\s*analyst',
        r'graphic\s*designer', r'content\s*writer',
        r'customer\s*support', r'operations',
    ]

    # Action words jo JD mein aate hain
    JD_ACTION_WORDS = [
        r'develop', r'design', r'implement', r'manage', r'lead',
        r'collaborate', r'build', r'create', r'maintain', r'analyze',
        r'optimize', r'deploy', r'test', r'write', r'review',
        r'mentor', r'coordinate', r'communicate', r'deliver',
        r'support', r'troubleshoot', r'ensure', r'drive',
        r'contribute', r'participate', r'research', r'evaluate',
        r'monitor', r'report', r'document', r'plan', r'execute',
        r'improve', r'scale', r'integrate', r'automate',
        r'architect', r'define', r'establish', r'guide',
        r'responsible\s*for', r'work\s*(with|closely)',
        r'partner\s*with', r'interface\s*with',
    ]

    # Requirement patterns
    REQUIREMENT_PATTERNS = [
        r'\d+\+?\s*years?\s*(of)?\s*experience',
        r'bachelor\'?s?\s*(degree)?', r'master\'?s?\s*(degree)?',
        r'b\.?s\.?', r'b\.?e\.?', r'm\.?s\.?', r'm\.?tech',
        r'ph\.?d', r'mba', r'degree\s*in',
        r'proficien(t|cy)\s*(in|with)',
        r'experience\s*(with|in|using)',
        r'knowledge\s*(of|in)',
        r'familiar(ity)?\s*(with|in)',
        r'strong\s*(understanding|background|skills)',
        r'hands[\s-]?on\s*experience',
        r'proven\s*(track\s*record|experience|ability)',
        r'ability\s*to', r'must\s*have', r'nice\s*to\s*have',
        r'required', r'preferred', r'mandatory',
        r'excellent\s*(communication|skills)',
        r'team\s*player', r'self[\s-]?motivated',
        r'attention\s*to\s*detail', r'problem[\s-]?solving',
    ]

    # Tech skills
    TECH_SKILLS = [
        r'python', r'java(?!script)', r'javascript', r'typescript',
        r'react', r'angular', r'vue', r'node\.?js', r'express',
        r'django', r'flask', r'fastapi', r'spring',
        r'aws', r'azure', r'gcp', r'google\s*cloud',
        r'docker', r'kubernetes', r'k8s', r'terraform',
        r'sql', r'nosql', r'mongodb', r'postgresql', r'mysql',
        r'redis', r'elasticsearch', r'kafka',
        r'git', r'ci[\s/]?cd', r'jenkins', r'github\s*actions',
        r'rest\s*api', r'graphql', r'microservices',
        r'html', r'css', r'sass', r'tailwind',
        r'machine\s*learning', r'deep\s*learning', r'nlp',
        r'tensorflow', r'pytorch', r'pandas', r'numpy',
        r'agile', r'scrum', r'jira', r'confluence',
        r'linux', r'unix', r'bash', r'shell',
        r'c\+\+', r'c#', r'\.net', r'go(?:lang)?', r'rust',
        r'swift', r'kotlin', r'flutter', r'react\s*native',
        r'power\s*bi', r'tableau', r'excel',
        r'figma', r'sketch', r'adobe',
    ]

    MIN_WORD_COUNT = 30
    MIN_CHAR_COUNT = 150

    def validate(self, text: str) -> JDValidationResult:
        """Job Description validate karo"""
        result = JDValidationResult()
        scores = {}

        if not text or not text.strip():
            result.issues.append("Job description khali hai")
            result.suggestions.append("Please ek real job posting paste karein")
            return result

        cleaned = text.strip()
        lower_text = cleaned.lower()
        words = cleaned.split()
        word_count = len(words)

        # Check 1: Minimum length
        if word_count < self.MIN_WORD_COUNT:
            result.issues.append(
                f"Bahut chhota hai — sirf {word_count} words. "
                f"Kam se kam {self.MIN_WORD_COUNT} words chahiye."
            )
            result.suggestions.append("Poori job posting paste karein")
            scores['length'] = 0
        elif word_count < 50:
            scores['length'] = 0.3
        elif word_count < 100:
            scores['length'] = 0.6
        else:
            scores['length'] = 1.0

        if len(cleaned) < self.MIN_CHAR_COUNT:
            result.issues.append(
                f"Content bahut kam hai — {len(cleaned)} characters. "
                f"Kam se kam {self.MIN_CHAR_COUNT} chahiye."
            )

        # Check 2: Gibberish detection
        if self._is_gibberish(cleaned):
            result.issues.append(
                "Random ya meaningless text detect hua — yeh real JD nahi lagta."
            )
            result.suggestions.append("Kisi real job posting ka link se text copy karein")
            scores['gibberish'] = 0
        else:
            scores['gibberish'] = 1.0

        # Check 3: JD Section Headers
        section_count = sum(
            1 for p in self.JD_SECTION_HEADERS if re.search(p, lower_text)
        )
        if section_count == 0:
            result.issues.append(
                "Koi standard JD section nahi mila "
                "(e.g. Requirements, Responsibilities, Qualifications)"
            )
            result.suggestions.append("LinkedIn/Indeed se actual job posting paste karein")
            scores['sections'] = 0
        elif section_count < 2:
            scores['sections'] = 0.3
        elif section_count < 4:
            scores['sections'] = 0.7
        else:
            scores['sections'] = 1.0

        # Check 4: Job Title
        title_found = any(re.search(p, lower_text) for p in self.JOB_TITLES)
        if not title_found:
            result.issues.append(
                "Koi job title detect nahi hua "
                "(e.g. Software Engineer, Data Analyst, Manager)"
            )
            scores['title'] = 0
        else:
            scores['title'] = 1.0

        # Check 5: Action Words
        action_count = sum(
            1 for p in self.JD_ACTION_WORDS if re.search(p, lower_text)
        )
        if action_count == 0:
            result.issues.append(
                "JD-style action words nahi mile "
                "(e.g. develop, manage, collaborate, implement)"
            )
            scores['actions'] = 0
        elif action_count < 3:
            scores['actions'] = 0.3
        elif action_count < 6:
            scores['actions'] = 0.7
        else:
            scores['actions'] = 1.0

        # Check 6: Requirement Patterns
        req_count = sum(
            1 for p in self.REQUIREMENT_PATTERNS if re.search(p, lower_text)
        )
        if req_count == 0:
            result.issues.append(
                "Koi requirement pattern nahi mila "
                "(e.g. '3+ years experience', 'Bachelor degree', 'proficient in')"
            )
            scores['requirements'] = 0
        elif req_count < 2:
            scores['requirements'] = 0.3
        elif req_count < 4:
            scores['requirements'] = 0.6
        else:
            scores['requirements'] = 1.0

        # Check 7: Tech Skills (optional for non-tech JDs)
        skill_count = sum(
            1 for p in self.TECH_SKILLS if re.search(p, lower_text)
        )
        scores['skills'] = min(1.0, skill_count / 5) if skill_count > 0 else 0.2

        # Check 8: Structure
        has_bullets = bool(re.search(r'[•\-\*]\s*\w', cleaned))
        has_numbered = bool(re.search(r'\d+[\.\)]\s*\w', cleaned))
        has_newlines = cleaned.count('\n') >= 3
        if has_bullets or has_numbered or has_newlines:
            scores['structure'] = 1.0
        elif word_count > 80:
            scores['structure'] = 0.5
        else:
            scores['structure'] = 0.2

        # Final confidence score
        weights = {
            'length': 0.10,
            'gibberish': 0.20,
            'sections': 0.15,
            'title': 0.15,
            'actions': 0.15,
            'requirements': 0.15,
            'skills': 0.05,
            'structure': 0.05,
        }
        confidence = round(
            min(1.0, max(0.0, sum(scores.get(k, 0) * w for k, w in weights.items()))),
            2
        )

        result.confidence = confidence
        result.details = {
            'scores': scores,
            'word_count': word_count,
            'sections_found': section_count,
            'action_words_found': action_count,
            'requirements_found': req_count,
            'skills_found': skill_count,
            'has_job_title': title_found,
        }

        THRESHOLD = 0.35
        if confidence >= THRESHOLD and len(result.issues) <= 3:
            result.is_valid = True
        else:
            result.is_valid = False
            if not result.issues:
                result.issues.append(
                    "Ye ek valid job description nahi lagta. "
                    "Please ek real job posting paste karein."
                )

        return result

    def _is_gibberish(self, text: str) -> bool:
        """Check if text is random/gibberish"""
        words = text.split()
        if not words:
            return True

        # Too many very short words
        short_words = [w for w in words if len(w) <= 2]
        if len(words) > 5 and len(short_words) / len(words) > 0.6:
            return True

        # Same word repeated too much
        if len(words) > 10:
            word_freq = Counter(w.lower() for w in words)
            most_common_count = word_freq.most_common(1)[0][1]
            if most_common_count / len(words) > 0.4:
                return True

        # No vowels
        vowel_ratio = sum(1 for c in text.lower() if c in 'aeiou') / max(len(text), 1)
        if len(text) > 50 and vowel_ratio < 0.05:
            return True

        # Too many special characters
        alpha_ratio = sum(1 for c in text if c.isalpha() or c.isspace()) / max(len(text), 1)
        if len(text) > 50 and alpha_ratio < 0.5:
            return True

        return False


# Singleton instance
jd_validator = JDValidator()
