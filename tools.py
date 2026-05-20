import os
from crewai.tools import tool
from exa_py import Exa
from dotenv import load_dotenv

load_dotenv()


@tool("Search Internet using Exa")
def search_exa(query: str) -> str:
    """
    Search the internet for real-time cybersecurity threats, malware campaigns,
    vulnerabilities, CVE details, and active digital security campaigns using
    Exa's neural search engine.
    """
    exa_client = Exa(api_key=os.getenv("EXA_API_KEY"))

    # Perform neural search with auto-prompting for optimal results
    response = exa_client.search_and_contents(
        query=query,
        num_results=5,
        text=True,  # Retrieve clean text contents of search results
        highlights=True
    )

    # Format results nicely for the agent's context
    formatted_results = []
    for result in response.results:
        formatted_results.append(
            f"Title: {result.title}\n"
            f"URL: {result.url}\n"
            f"Highlight: {result.highlights[0] if result.highlights else 'N/A'}\n"
            f"Snippet: {result.text[:1000]}...\n"
            f"---"
        )

    return "\n\n".join(formatted_results)
