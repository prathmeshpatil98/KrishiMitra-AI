"""
KrishiMitra AI — Response Formatter Node
=========================================
Purpose     : Implement the Response Formatter.
Respons.    : Translate decision details into Simple English, Hindi, or Marathi markdown.
Dependencies: app.graph.state
"""

from __future__ import annotations

from typing import Any, Dict
from app.core.logging import get_logger
from app.graph.state import AgentState

logger = get_logger(__name__)


async def formatter_node(state: AgentState) -> Dict[str, Any]:
    """
    Response Formatter node maps structured output payload fields to localized bullet markdown.
    """
    logger.info("formatter_node_started")

    decision = state.get("decision") or {}
    lang = state.get("language") or "en"
    crop = state.get("crop") or "Crop"
    quantity = state.get("quantity") or 0.0
    schemes = state.get("government_schemes") or []

    if not decision.get("success", False):
        return {"final_response": "Sorry, I could not generate a recommendation. Please verify your query details."}

    best_market = decision["best_market"]
    net_profit = decision["expected_net_profit"]
    selling_day = decision["recommended_selling_day"]
    reasoning = decision["reasoning"]
    weather_advice = decision["weather_advice"]

    # Simple dictionary mapping for localized response stubs (Do not generate prompts yet)
    # Renders clean markdown matching Linear/Stripe premium layouts
    if lang == "hi":
        response = f"""
## 🌾 फ़सल बिक्री सिफ़ारिश: **{crop}** ({quantity} क्विंटल)

* **सर्वोत्तम मंडी**: {best_market}
* **अनुमानित शुद्ध लाभ**: ₹{net_profit:,.2f}
* **बिक्री के लिए सर्वश्रेष्ठ दिन**: {selling_day}
* **मौसम जोखिम सलाह**: {weather_advice}

### 💡 विश्लेषण और तर्क:
{reasoning}

### 📋 अनुशंसित योजनाएँ:
"""
        for s in schemes[:2]:
            response += f"- **{s['scheme_name']}**: {s['benefits']} (वेबसाइट: [यहाँ क्लिक करें]({s['website']}))\n"
    elif lang == "mr":
        response = f"""
## 🌾 पीक विक्री शिफारस: **{crop}** ({quantity} क्विंटल)

* **सर्वोत्तम मार्केट (मंडी)**: {best_market}
* **अंदाजे निव्वळ नफा**: ₹{net_profit:,.2f}
* **विक्रीसाठी सर्वोत्तम दिवस**: {selling_day}
* **हवामान जोखीम सल्ला**: {weather_advice}

### 💡 विश्लेषण आणि तर्क:
{reasoning}

### 📋 शिफारस केलेल्या योजना:
"""
        for s in schemes[:2]:
            response += f"- **{s['scheme_name']}**: {s['benefits']} (वेबसाइट: [येथे क्लिक करा]({s['website']}))\n"
    else:  # default English
        response = f"""
## 🌾 Crop Sale Recommendation: **{crop}** ({quantity} Quintals)

* **Best Market**: {best_market}
* **Expected Net Profit**: ₹{net_profit:,.2f}
* **Best Selling Day**: {selling_day}
* **Weather Risk Advice**: {weather_advice}

### 💡 Analysis & Reasoning:
{reasoning}

### 📋 Recommended Schemes:
"""
        for s in schemes[:2]:
            response += f"- **{s['scheme_name']}**: {s['benefits']} (Website: [Click Here]({s['website']}))\n"

    logger.info("formatter_node_completed", lang=lang)

    return {
        "final_response": response.strip(),
        "messages": [AIMessage(content=response.strip())]
    }


# Import stubs to resolve circular dependencies in annotations
from langchain_core.messages import AIMessage
