"""
File: ml/career_analyzer.py
Purpose: Analyzes a resume against 100+ career paths to determine best fits, eligible fields, and future career suggestions based on skills and experience.
Missing Impact: The career analysis feature would be broken, preventing users from seeing which professional paths their current skills align with.
"""
import re
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, field

from app.ml.career_database import CAREER_DATABASE, CAREER_FIELDS
from app.ml.skills_database import find_skills_in_text, SKILL_VARIATIONS


@dataclass
class CareerMatch:
    """Single career match result"""
    career_title: str = ""
    match_percentage: float = 0.0
    career_field: str = ""
    alternate_titles: List = field(default_factory=list)
    matched_skills: List = field(default_factory=list)
    missing_skills: List = field(default_factory=list)
    experience_level: str = ""
    salary_range: str = ""
    market_demand: str = ""
    growth_rate: str = ""
    description: str = ""
    match_category: str = "low"
    recommendations: List = field(default_factory=list)


@dataclass
class CareerAnalysisResult:
    """Complete career analysis output"""
    best_fit: Optional[CareerMatch] = None
    eligible_careers: List = field(default_factory=list)
    eligible_fields: List = field(default_factory=list)
    future_careers: List = field(default_factory=list)
    skills_summary: Dict = field(default_factory=dict)
    market_insights: Dict = field(default_factory=dict)
    overall_profile: Dict = field(default_factory=dict)


class CareerAnalyzer:
    """
    Analyzes resume text and recommends matching careers.
    Input: resume.raw_text (real extracted text stored in DB)
    """

    def analyze(
        self,
        resume_text: str,
        resume_skills: Optional[List[str]] = None,
        resume_data: Optional[Dict[str, Any]] = None,
    ) -> CareerAnalysisResult:
        """
        Main analysis function.

        Args:
            resume_text: Full extracted text from resume.raw_text
            resume_skills: Pre-extracted skills list (from resume.skills JSON)
            resume_data: Parsed structured data (from resume.parsed_data JSON)

        Returns:
            CareerAnalysisResult with recommendations
        """
        result = CareerAnalysisResult()

        # Extract skills from raw_text if not already done
        if not resume_skills:
            resume_skills = find_skills_in_text(resume_text)

        resume_skills_lower = {s.lower().strip() for s in resume_skills}

        # Extract years of experience from raw_text
        experience_years = self._extract_years(resume_text, resume_data)

        # Score each career
        all_matches = []
        for career_name, career_data in CAREER_DATABASE.items():
            match = self._calculate_career_match(
                career_name=career_name,
                career_data=career_data,
                resume_skills=resume_skills_lower,
                resume_text=resume_text.lower(),
                experience_years=experience_years,
            )
            all_matches.append(match)

        all_matches.sort(key=lambda x: x.match_percentage, reverse=True)

        # Best fit = top match
        if all_matches:
            result.best_fit = all_matches[0]

        # Eligible (40%+)
        result.eligible_careers = [m for m in all_matches if m.match_percentage >= 40]

        # Future (20-39%)
        result.future_careers = [m for m in all_matches if 20 <= m.match_percentage < 40]
        for career in result.future_careers:
            career.recommendations = [
                f"Learn: {', '.join(career.missing_skills[:5])}",
                f"You already know {len(career.matched_skills)} relevant skills",
                f"Market demand: {career.market_demand} | Growth: {career.growth_rate}",
            ]

        # Eligible fields
        eligible_field_names = {c.career_field for c in result.eligible_careers}
        result.eligible_fields = []
        for field_name in eligible_field_names:
            field_data = CAREER_FIELDS.get(field_name, {})
            result.eligible_fields.append({
                "field": field_name,
                "description": field_data.get("description", ""),
                "matching_careers": [
                    c.career_title for c in result.eligible_careers if c.career_field == field_name
                ],
                "total_careers_in_field": len(field_data.get("careers", [])),
            })

        # Skills summary
        all_matched = set()
        all_missing = set()
        for career in result.eligible_careers[:5]:
            all_matched.update(career.matched_skills)
            all_missing.update(career.missing_skills)
        all_missing -= all_matched

        result.skills_summary = {
            "total_skills_found": len(resume_skills),
            "skills_found": sorted(list(resume_skills_lower)),
            "strengths": sorted(list(all_matched))[:15],
            "skills_to_learn": sorted(list(all_missing))[:15],
        }

        # Market insights
        if result.eligible_careers:
            high_demand = [
                c for c in result.eligible_careers
                if c.market_demand in ["Very High", "Extremely High"]
            ]
            result.market_insights = {
                "high_demand_careers": [
                    {"title": c.career_title, "demand": c.market_demand, "growth": c.growth_rate}
                    for c in high_demand[:5]
                ],
                "best_salary": result.eligible_careers[0].salary_range if result.eligible_careers else "N/A",
                "trending_fields": list(eligible_field_names)[:5],
            }

        # Overall profile
        result.overall_profile = {
            "experience_years": experience_years,
            "primary_field": result.best_fit.career_field if result.best_fit else "Unknown",
            "career_level": self._determine_level(experience_years),
            "total_eligible_careers": len(result.eligible_careers),
            "total_eligible_fields": len(result.eligible_fields),
            "total_future_careers": len(result.future_careers),
        }

        return result

    def _calculate_career_match(
        self,
        career_name: str,
        career_data: Dict,
        resume_skills: set,
        resume_text: str,
        experience_years: Optional[int],
    ) -> CareerMatch:
        """Score a single career against resume skills."""
        match = CareerMatch()
        match.career_title = career_name
        match.career_field = career_data.get("field", "")
        match.alternate_titles = career_data.get("alternate_titles", [])
        match.market_demand = career_data.get("market_demand", "")
        match.growth_rate = career_data.get("growth_rate", "")
        match.description = career_data.get("description", "")

        required = {s.lower() for s in career_data.get("required_skills", [])}
        important = {s.lower() for s in career_data.get("important_skills", [])}
        bonus = {s.lower() for s in career_data.get("bonus_skills", [])}
        all_career_skills = required | important | bonus

        # Skill matching with synonyms
        matched = set()
        for skill in all_career_skills:
            if self._skill_matches(skill, resume_skills):
                matched.add(skill)

        # Bonus if job title appears in resume text
        title_bonus = 0
        for alt_title in career_data.get("alternate_titles", []):
            if alt_title.lower() in resume_text:
                title_bonus = 10
                break

        missing = all_career_skills - matched
        match.matched_skills = sorted(list(matched))
        match.missing_skills = sorted(list(missing))

        # Weighted scoring — weights sum to 100 so max score = 100
        req_matched = sum(1 for s in required if self._skill_matches(s, resume_skills, resume_text))
        req_score   = (req_matched / max(len(required), 1)) * 50   # required = 50%

        imp_matched = sum(1 for s in important if self._skill_matches(s, resume_skills, resume_text))
        imp_score   = (imp_matched / max(len(important), 1)) * 35  # important = 35%

        bonus_matched = sum(1 for s in bonus if self._skill_matches(s, resume_skills, resume_text))
        bonus_score   = (bonus_matched / max(len(bonus), 1)) * 15  # bonus = 15%

        # Soft penalty only if fewer than min required skills and no title match
        min_needed   = career_data.get("min_skills_needed", 3)
        total_matched = len(matched)
        penalty = max(0, (min_needed - total_matched) * 3) if title_bonus == 0 else 0

        raw_score = req_score + imp_score + bonus_score + title_bonus - penalty
        
        # Cap at 30% if no required skills match to prevent false positives
        if req_matched == 0:
            raw_score = min(raw_score, 30.0)

        match.match_percentage = round(min(100.0, max(0.0, raw_score)), 1)

        exp_levels = career_data.get("experience_levels", {})
        match.experience_level, match.salary_range = self._determine_career_level(
            experience_years, exp_levels
        )

        if match.match_percentage >= 75:
            match.match_category = "excellent"
        elif match.match_percentage >= 55:
            match.match_category = "good"
        elif match.match_percentage >= 40:
            match.match_category = "moderate"
        else:
            match.match_category = "low"

        return match

    def _skill_matches(self, skill: str, resume_skills: set, resume_text: str = "") -> bool:
        """Flexible skill matching: exact, synonym, and strict raw-text fallback."""
        skill_lower = skill.lower().strip()

        # 1. Exact match in skills list
        if skill_lower in resume_skills:
            return True

        # 2. Synonym match
        normalized = SKILL_VARIATIONS.get(skill_lower, "").lower()
        if normalized and normalized in resume_skills:
            return True
        for rs in resume_skills:
            rs_norm = SKILL_VARIATIONS.get(rs, "").lower()
            if rs_norm == skill_lower:
                return True

        # 3. Fallback: look for skill word directly in raw resume text with word boundaries
        if resume_text and len(skill_lower) > 2:
            import re
            pattern = r'\b' + re.escape(skill_lower) + r'\b'
            if re.search(pattern, resume_text):
                return True

        return False

    def _extract_years(self, text: str, data: Optional[Dict]) -> Optional[int]:
        """Extract years of experience from resume text."""
        if data and data.get("total_experience_years"):
            try:
                return int(data["total_experience_years"])
            except (ValueError, TypeError):
                pass

        patterns = [
            r'(\d+)\+?\s*years?\s*(of)?\s*experience',
            r'experience\s*:?\s*(\d+)\+?\s*years?',
            r'(\d+)\+?\s*years?\s*(of)?\s*(professional|industry)',
            r'over\s*(\d+)\s*years?',
        ]
        for pattern in patterns:
            m = re.search(pattern, text, re.IGNORECASE)
            if m:
                return int(m.group(1))
        return None

    def _determine_level(self, years: Optional[int]) -> str:
        if years is None:
            return "Unknown"
        if years < 2:
            return "Entry Level / Junior"
        elif years < 5:
            return "Mid Level"
        elif years < 8:
            return "Senior"
        elif years < 12:
            return "Lead / Staff"
        else:
            return "Principal / Director"

    def _determine_career_level(
        self, years: Optional[int], exp_levels: Dict
    ) -> Tuple[str, str]:
        if not exp_levels:
            return "Unknown", "N/A"

        first_key = list(exp_levels.keys())[0]
        best_level = first_key
        best_salary = exp_levels[first_key].get("salary", "N/A")

        if years is None:
            return best_level, best_salary

        for level_name, level_data in exp_levels.items():
            year_range = level_data.get("years", "0-100")
            parts = year_range.replace("+", "-100").split("-")
            try:
                min_y = int(parts[0])
                max_y = int(parts[1]) if len(parts) > 1 else 100
            except (ValueError, IndexError):
                continue
            if min_y <= years <= max_y:
                best_level = level_name
                best_salary = level_data.get("salary", "N/A")
                break

        return best_level, best_salary


# Singleton instance
career_analyzer = CareerAnalyzer()
