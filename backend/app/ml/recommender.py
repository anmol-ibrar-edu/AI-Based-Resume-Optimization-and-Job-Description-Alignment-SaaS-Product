"""
File: ml/recommender.py
Purpose: Generates actionable, prioritized recommendations for improving a resume based on its score against a job description, covering skills, experience, and formatting.
Missing Impact: Users would receive a score but no guidance on how to improve it, significantly reducing the practical value of the application.
"""
from typing import List, Dict


class ResumeRecommender:
    """
    Generate prioritized, actionable recommendations for resume improvement
    
    Recommendation Categories:
    - Skills (missing required/preferred skills)
    - Experience (gaps, relevance)
    - Keywords (ATS optimization)
    - Format/Structure
    - Achievements/Quantification
    """
    
    def __init__(self):
        self.priority_weights = {
            "high": 3,
            "medium": 2,
            "low": 1
        }
    
    def generate_recommendations(
        self,
        resume_data: Dict,
        job_data: Dict,
        score_data: Dict
    ) -> List[Dict]:
        """
        Generate comprehensive recommendations
        
        Args:
            resume_data: Parsed resume data
            job_data: Parsed job description data
            score_data: ATS scoring results
            
        Returns:
            List of recommendation dicts, sorted by priority
        """
        recommendations = []
        
        # 1. Missing Required Skills (HIGHEST PRIORITY)
        recommendations.extend(self._recommend_required_skills(score_data, job_data))
        
        # 2. Missing Preferred Skills (MEDIUM PRIORITY)
        recommendations.extend(self._recommend_preferred_skills(score_data, job_data))
        
        # 3. Experience Gaps (HIGH/MEDIUM)
        recommendations.extend(self._recommend_experience(resume_data, job_data, score_data))
        
        # 4. Missing Keywords (MEDIUM PRIORITY)
        recommendations.extend(self._recommend_keywords(score_data))
        
        # 5. Achievements & Quantification (MEDIUM PRIORITY)
        recommendations.extend(self._recommend_achievements(resume_data))
        
        # 6. Format/Structure (LOW PRIORITY)
        recommendations.extend(self._recommend_format(resume_data, score_data))
        
        # 7. General Improvements (LOW PRIORITY)
        recommendations.extend(self._recommend_general(score_data))
        
        # Sort by priority
        priority_order = {"high": 0, "medium": 1, "low": 2}
        recommendations.sort(key=lambda x: (priority_order[x["priority"]], -x.get("impact_score", 0)))
        
        # Limit to top 20 recommendations
        return recommendations[:20]
    
    def _recommend_required_skills(self, score_data: Dict, job_data: Dict) -> List[Dict]:
        """Recommend adding missing required skills"""
        recommendations = []
        
        missing_skills = score_data.get("missing_skills", [])
        required_skills = job_data.get("required_skills", [])
        
        for skill in missing_skills:
            if skill in required_skills:
                recommendations.append({
                    "id": f"skill_req_{len(recommendations)}",
                    "priority": "high",
                    "category": "skills",
                    "title": f"Add required skill: {skill}",
                    "description": f"'{skill}' is a required skill for this position. Not having it significantly reduces your chances.",
                    "action": f"If you have experience with {skill}, add it to your Skills section prominently.",
                    "impact": "Could improve your score by 5-8 points",
                    "impact_score": 8,
                    "examples": [
                        f"Example: 'Proficient in {skill} with 2+ years of hands-on experience'",
                        f"Example: 'Developed applications using {skill}'"
                    ],
                })
        
        return recommendations[:5]  # Top 5 required skills
    
    def _recommend_preferred_skills(self, score_data: Dict, job_data: Dict) -> List[Dict]:
        """Recommend adding missing preferred skills"""
        recommendations = []
        
        missing_skills = score_data.get("missing_skills", [])
        preferred_skills = job_data.get("preferred_skills", [])
        
        for skill in missing_skills:
            if skill in preferred_skills:
                recommendations.append({
                    "id": f"skill_pref_{len(recommendations)}",
                    "priority": "medium",
                    "category": "skills",
                    "title": f"Consider adding: {skill}",
                    "description": f"'{skill}' is a preferred skill for this position.",
                    "action": f"If you have any experience with {skill}, even from side projects or courses, mention it.",
                    "impact": "Could improve your score by 2-3 points",
                    "impact_score": 3,
                })
        
        return recommendations[:5]  # Top 5 preferred skills
    
    def _recommend_experience(self, resume_data: Dict, job_data: Dict, score_data: Dict) -> List[Dict]:
        """Recommend experience improvements"""
        recommendations = []
        
        # Check experience score
        breakdown = score_data.get("breakdown", {})
        exp_score = breakdown.get("experience_score", 0)
        
        if exp_score < 70:
            # Get required experience
            total_exp = resume_data.get("total_experience_years", 0)
            
            recommendations.append({
                "id": "exp_highlight",
                "priority": "high" if exp_score < 50 else "medium",
                "category": "experience",
                "title": "Highlight relevant experience",
                "description": f"Your experience score is {exp_score}/100. Emphasize relevant projects and achievements.",
                "action": "Focus on experience directly related to this role's requirements.",
                "impact": "Could improve your score by 10-15 points",
                "impact_score": 12,
                "examples": [
                    "Start bullet points with strong action verbs (Developed, Led, Implemented)",
                    "Quantify achievements (Improved performance by 40%, Managed team of 5)",
                    "Highlight technologies that match the job description"
                ],
            })
            
            # Suggest adding projects if low experience
            if total_exp < 2:
                recommendations.append({
                    "id": "exp_projects",
                    "priority": "medium",
                    "category": "experience",
                    "title": "Add relevant projects",
                    "description": "Include personal projects, freelance work, or academic projects to demonstrate skills.",
                    "action": "Create a 'Projects' section showcasing relevant work.",
                    "impact": "Could improve your score by 5-8 points",
                    "impact_score": 6,
                })
        
        return recommendations
    
    def _recommend_keywords(self, score_data: Dict) -> List[Dict]:
        """Recommend adding missing keywords"""
        recommendations = []
        
        missing_keywords = score_data.get("missing_keywords", [])
        
        if missing_keywords:
            # Take top 5 keywords
            top_keywords = missing_keywords[:5]
            
            recommendations.append({
                "id": "keywords_main",
                "priority": "medium",
                "category": "keywords",
                "title": f"Include important keywords",
                "description": f"Your resume is missing {len(missing_keywords)} important ATS keywords.",
                "action": f"Naturally incorporate these keywords: {', '.join(top_keywords)}",
                "impact": "Could improve ATS visibility by 10-20%",
                "impact_score": 5,
                "examples": [
                    "Integrate keywords into your experience descriptions",
                    "Add them to a 'Core Competencies' or 'Technical Skills' section",
                    "Ensure they appear naturally, not keyword-stuffed"
                ],
            })
        
        return recommendations
    
    def _recommend_achievements(self, resume_data: Dict) -> List[Dict]:
        """Recommend adding quantifiable achievements"""
        recommendations = []
        
        # Count achievements in experience
        experience = resume_data.get("experience", [])
        total_achievements = sum(len(exp.get("achievements", [])) for exp in experience)
        
        if total_achievements < 5:
            recommendations.append({
                "id": "achievements_quantify",
                "priority": "medium",
                "category": "achievements",
                "title": "Add quantifiable achievements",
                "description": "Your resume has few quantifiable achievements. Numbers and metrics make impact clearer.",
                "action": "Add 2-3 quantified achievements per role.",
                "impact": "Could improve your score by 5-10 points",
                "impact_score": 7,
                "examples": [
                    "Increased system performance by 40%",
                    "Reduced deployment time from 2 hours to 15 minutes",
                    "Led team of 5 developers to deliver project 2 weeks ahead of schedule",
                    "Improved user engagement by 25% through UX optimization",
                    "Reduced costs by $50K annually through process automation"
                ],
            })
        
        return recommendations
    
    def _recommend_format(self, resume_data: Dict, score_data: Dict) -> List[Dict]:
        """Recommend format improvements"""
        recommendations = []
        
        breakdown = score_data.get("breakdown", {})
        format_score = breakdown.get("format_score", 0)
        
        if format_score < 70:
            # Check what's missing
            if not resume_data.get("summary"):
                recommendations.append({
                    "id": "format_summary",
                    "priority": "low",
                    "category": "format",
                    "title": "Add professional summary",
                    "description": "A summary/objective at the top helps recruiters quickly understand your value.",
                    "action": "Add a 2-3 sentence summary highlighting your key qualifications.",
                    "impact": "Could improve your score by 2-3 points",
                    "impact_score": 2,
                    "examples": [
                        "Example: 'Senior Full-Stack Developer with 5+ years building scalable web applications using React and Node.js. Proven track record of delivering high-quality solutions that improve user experience and business metrics.'"
                    ],
                })
            
            # Check for contact info issues
            contact = resume_data.get("contact_info", {})
            if not contact.get("linkedin"):
                recommendations.append({
                    "id": "format_linkedin",
                    "priority": "low",
                    "category": "format",
                    "title": "Add LinkedIn profile",
                    "description": "Include your LinkedIn URL to provide additional professional context.",
                    "action": "Add LinkedIn URL in your contact information.",
                    "impact": "Could improve recruiter engagement",
                    "impact_score": 1,
                })
        
        return recommendations
    
    def _recommend_general(self, score_data: Dict) -> List[Dict]:
        """General recommendations based on overall score"""
        recommendations = []
        
        overall_score = score_data.get("total_score", 0)
        
        if overall_score < 50:
            recommendations.append({
                "id": "general_major_revision",
                "priority": "high",
                "category": "general",
                "title": "Major resume revision recommended",
                "description": f"Your resume scored {overall_score}/100. Significant improvements are needed.",
                "action": "Focus on the high-priority recommendations above, especially missing required skills.",
                "impact": f"Following all recommendations could improve your score by {100 - overall_score} points",
                "impact_score": 15,
            })
        elif overall_score < 70:
            recommendations.append({
                "id": "general_moderate_revision",
                "priority": "medium",
                "category": "general",
                "title": "Moderate improvements recommended",
                "description": f"Your resume scored {overall_score}/100. Several improvements would help.",
                "action": "Focus on adding missing skills and quantifying your achievements.",
                "impact": "Could improve your score to 80+",
                "impact_score": 10,
            })
        elif overall_score >= 85:
            recommendations.append({
                "id": "general_excellent",
                "priority": "low",
                "category": "general",
                "title": "Excellent match!",
                "description": f"Your resume scored {overall_score}/100 - great match for this position!",
                "action": "Minor tweaks to the recommendations above could push you to 90+.",
                "impact": "You're already well-positioned for this role",
                "impact_score": 0,
            })
        
        return recommendations


# Convenience function
def get_recommendations(resume_data: Dict, job_data: Dict, score_data: Dict) -> List[Dict]:
    """
    Quick recommendation generation
    
    Args:
        resume_data: Parsed resume
        job_data: Parsed job description
        score_data: ATS score results
        
    Returns:
        List of prioritized recommendations
    """
    recommender = ResumeRecommender()
    return recommender.generate_recommendations(resume_data, job_data, score_data)
