import os
from crewai import Crew, Process
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

from agents import (
    threat_analyst,
    vulnerability_researcher,
    incident_response_advisor,
    report_writer
)
from tasks import (
    threat_detection_task,
    vulnerability_analysis_task,
    mitigation_planning_task,
    report_compilation_task
)


def run_cyber_intelligence_crew(topic: str):
    """
    Kicks off the Cybersecurity Threat Intelligence crew.
    """
    print(f"[*] Initializing Cybersecurity Intelligence Crew for topic: '{topic}'...")

    # Instantiate the Crew
    cyber_crew = Crew(
        agents=[
            threat_analyst,
            vulnerability_researcher,
            incident_response_advisor,
            report_writer
        ],
        tasks=[
            threat_detection_task,
            vulnerability_analysis_task,
            mitigation_planning_task,
            report_compilation_task
        ],
        process=Process.sequential,  # Execute sequentially as output of one is input for the next
        verbose=True
    )

    # Run the crew with inputs
    result = cyber_crew.kickoff(inputs={"topic": topic})

    print("\n[+] Crew execution completed successfully!")
    print("[+] Structured report written to: 'threat_intelligence_report.md'")
    return result


if __name__ == "__main__":
    # Example topic: "Ivanti VPN zero-day vulnerability exploits in 2024"
    # Change this to any trending threat topic of your choice.
    target_topic = "Ivanti VPN zero-day vulnerability exploits"
    run_cyber_intelligence_crew(target_topic)
