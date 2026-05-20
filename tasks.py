from crewai import Task
from agents import (
    threat_analyst,
    vulnerability_researcher,
    incident_response_advisor,
    report_writer
)

# Task 1: Threat Identification
threat_detection_task = Task(
    description=(
        "Research recent reports and web articles on the following threat topic: '{topic}'. "
        "Identify key threat actors, active campaigns, systems being targeted, and infection vectors. "
        "Use the Exa Search tool to get the most up-to-date and accurate threat intelligence."
    ),
    expected_output=(
        "A detailed intelligence log containing identified threat actors, affected technologies, "
        "tactics/techniques used, and recent attack instances."
    ),
    agent=threat_analyst
)

# Task 2: Vulnerability Analysis
vulnerability_analysis_task = Task(
    description=(
        "Based on the threat intelligence gathered, search for corresponding CVEs, zero-days, or configuration flaws "
        "being exploited. Determine CVSS severity levels, affected software versions, and exploit availability."
    ),
    expected_output=(
        "A vulnerability registry sheet listing relevant CVE IDs, impact levels, technical descriptions of the exploits, "
        "and target system profiles."
    ),
    agent=vulnerability_researcher
)

# Task 3: Incident Mitigation Advice
mitigation_planning_task = Task(
    description=(
        "Develop an actionable Incident Response and Defense Strategy. Suggest specific firewalls, endpoint controls, "
        "YARA rules or detection signatures (if available), patch versions, and backup precautions to mitigate the "
        "exploited vulnerabilities and threat campaigns."
    ),
    expected_output=(
        "A defensive mitigation guide detailing immediate hotfixes, long-term patches, configuration updates, "
        "and monitoring criteria."
    ),
    agent=incident_response_advisor
)

# Task 4: Report Synthesis
report_compilation_task = Task(
    description=(
        "Synthesize the findings from threat detection, vulnerability analysis, and mitigation plans. "
        "Format the output into a premium, professional Markdown threat intelligence report. Include an Executive Summary, "
        "Threat Details, Technical Vulnerabilities, Defense Recommendations, and References."
    ),
    expected_output=(
        "A beautifully formatted markdown report ready for leadership, outlining the security threat, technical "
        "exposures, and mitigation steps."
    ),
    agent=report_writer,
    output_file="threat_intelligence_report.md"
)
