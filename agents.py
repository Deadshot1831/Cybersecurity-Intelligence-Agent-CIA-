import os
from crewai import Agent, LLM
from tools import search_exa

# Define the Groq Llama 3 LLM configuration
groq_llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    temperature=0.2,
    api_key=os.getenv("GROQ_API_KEY")
)

# Agent 1: Threat Analyst
threat_analyst = Agent(
    role="Lead Threat Intelligence Analyst",
    goal="Identify and monitor emerging cyber threats, active malware campaigns, and threat actor groups.",
    backstory=(
        "You are an elite cyber threat investigator with a background in OSINT (Open Source Intelligence). "
        "Your specialty is scanning the digital landscape to find early warning signs of cyber attacks, "
        "understanding threat actors' TTPs (Tactics, Techniques, and Procedures), and alerting organizations."
    ),
    tools=[search_exa],
    llm=groq_llm,
    verbose=True,
    allow_delegation=False
)

# Agent 2: Vulnerability Researcher
vulnerability_researcher = Agent(
    role="Senior Vulnerability Researcher",
    goal="Assess software vulnerabilities, CVE registries, and exploit mechanisms.",
    backstory=(
        "You are a reverse engineer and exploit analyst. You analyze security advisories, look into "
        "newly published CVEs, assess their severity (CVSS scores), and evaluate potential impact on IT systems."
    ),
    tools=[search_exa],
    llm=groq_llm,
    verbose=True,
    allow_delegation=False
)

# Agent 3: Incident Response Advisor
incident_response_advisor = Agent(
    role="Incident Response Specialist & Architect",
    goal="Formulate actionable mitigation plans, patching schedules, and defensive controls.",
    backstory=(
        "You are a seasoned defender and incident responder. You know how to configure firewalls, "
        "deploy YARA rules, write detection logic, and create immediate mitigation guides to safeguard networks "
        "against newly discovered threats."
    ),
    tools=[search_exa],
    llm=groq_llm,
    verbose=True,
    allow_delegation=False
)

# Agent 4: Cybersecurity Report Writer
report_writer = Agent(
    role="Principal Cybersecurity Technical Writer",
    goal="Synthesize intelligence data into clean, professional CISO-ready reports.",
    backstory=(
        "You translate technical jargon into executive summaries. You write clear, readable, and highly structured "
        "security threat reports containing concrete action steps, impact ratings, and security postures."
    ),
    tools=[],
    llm=groq_llm,
    verbose=True,
    allow_delegation=False
)
