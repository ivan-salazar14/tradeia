You are senior product manager. your goal ist to create a comprehensive Product Requirements Document (PRD) based on the following instructions:

<prd_instructions>
Crypto Signals Product Discovery Summary
1. Core Problem
What specific user problem or pain point does this app idea address?

1.1. Traders, especially busy professionals and seniors, often lack time or expertise to interpret technical analysis (TA) indicators (EMA/RSI/MACD) consistently or correctly.
1.2. There's a lack of trust in crypto signal providers due to opaque performance histories.
1.3. The lifestyle of sitting at desks or screens for long hours leads to physical stiffness or discomfort, particularly among older adults.

2. Target Users
Who are the primary users or customer segments that will benefit from this solution?

2.1. Crypto traders and investors (novice to intermediate), with a focus on those aged 30+
2.2. Busy professionals seeking automation and clear entry/exit signals
2.3. Senior users who want to stay mentally and physically engaged with modern tech and finance

3. Current Alternatives
How do these users currently deal with this problem, and what limitations do those existing solutions have?

3.1. Use scattered Telegram groups or Discord channels with inconsistent quality
3.2. Manual use of tools like TradingView without guidance or integration with bots

3.4. Lack of unified platforms that combine trustworthy signals, automation, and wellness

4. User Journey
Can you walk me through how a typical user would use the app from start to finish to accomplish their goal?

4.1. User logs in and completes onboarding, indicating experience level and goals
4.2. User subscribes to specific signal bundles or providers (e.g., MACD for altcoins)
4.3. User receives real-time signal alerts with TP/SL, optionally connects to a bot for execution
4.4. User tracks performance via a transparent dashboard (e.g., 90-day accuracy metrics)

5. Key Features
What are the main features or functions you envision the app providing to solve the problem?

5.1. Curated signal marketplace (technical indicators, strategy bundles)
5.2. Transparent performance tracking for all providers
5.3. Push notifications for new signals with actionable guidance
5.4. Optional auto-execution via exchange or bot API integration
5.6. Cross-device syncing between web portal and mobile app
5.7. User profile and preferences engine

6. Minimum Viable Product (MVP)
Which of these features are absolutely essential for the first version, and which ones can be added later?

MVP Features:

6.1. Signal marketplace with EMA/RSI/MACD bundles
6.2. Signal alerts with TP/SL recommendations
6.3. Push notifications (Expo-based mobile app)
6.4. Manual signal tracking (not automated bot trading)

Post-MVP Features:

6.6. Auto-trade integration via exchange APIs
6.7. Provider reviews and reputation system
6.9. Premium subscriptions and signal paywalls

7. Integrations & Data
Does the app need to connect to or pull data from any external services?

7.1. Trading data APIs (e.g., Binance, CoinGecko, TradingView)
7.2. Bot automation services (via webhook/API)
7.4. Analytics (e.g., Mixpanel, PostHog) for engagement
7.5. Payment gateway (Stripe or similar) for subscription billing

8. Constraints
Are there any specific requirements or constraints we should keep in mind?

8.1. Regulatory concerns around financial signals and auto-trading must be addressed
8.2. Must be compliant with GDPR and other data privacy regulations
8.3. Must support low-friction onboarding for senior users (larger fonts, simple UX)
8.4. Mobile app must support both iOS and Android via a single codebase
8.5. Must be architected in a modular way (hexagonal architecture with Go backend)

9. Assumptions
What assumptions are we making about the users or context?

9.1. Users have basic understanding of trading concepts like RSI or MACD
9.2. Users have access to internet-connected smartphones or desktops

9.4. Target users value transparency and track record over hype

10. Edge Cases
Can you think of any unusual or extreme scenarios that might occur, and how should the app handle those situations?

10.1. A signal provider posts faulty or malicious signals — implement vetting and emergency suspension
10.2. Users opt-in to auto-trading and suffer losses — disclaimers, education, and stop-loss enforcement
10.3. App outage during volatile market periods — fallback to SMS or email alerts

Product Roadmap
Q3 2025
Finalize UI/UX wireframes for mobile and web

Set up backend infrastructure (Go, hexagonal architecture)

Integrate market data APIs

Build signal marketplace MVP

Q4 2025
Launch mobile app (Expo) with signal alerts and wellness routines

Launch web portal with dashboard and provider profiles

Integrate push notifications (iOS/Android)

Conduct closed beta with early users

Q1 2026
Release v1 with premium subscriptions

Add exchange auto-trading integration

Add performance analytics dashboard

Begin user growth and marketing campaigns

Q2 2026
Implement community reviews and signal provider scoring

Launch expanded wellness library with tagging

Explore B2B signal provider tools

Optimize retention via gamification features


</prd_instructions>

Follow these steps to create your PRD

1. Begin with a brief introduction stating the purpose of the document.

2. Organize your PRD into the following sections:

<prd_outline>
	# Title
	## 1. Title and Overview
	### 1.1 Document Title & Version
	### 1.2 Product Summary
	## 2. User Personas
	### 2.1 Key User Types
	### 2.2 Basic Persona Details
	### 2.3 Role-based Access	
		   - Briefly describe each user role (e.g., Admin, Registered User, Guest) and the main features/permissions available to that role.
	## 3. User Stories
</prd_outline>

3. For each section, provide detailed and relevant information based on the PRD instructions. Ensure that you:
   - Use clear and concise language
   - Provide specific details and metrics where required
   - Maintain consistency throughout the document
   - Address all points mentioned in each section

4. When creating user stories and acceptance criteria:
	- List ALL necessary user stories including primary, alternative, and edge-case scenarios. 
	- Assign a unique requirement ID (e.g., US-001) to each user story for direct traceability
	- Include at least one user story specifically for secure access or authentication if the application requires user identification or access restrictions
	- Ensure no potential user interaction is omitted
	- Make sure each user story is testable

<user_story>
- ID
- Title
- Description
- Acceptance Criteria
</user_story>

5. After completing the PRD, review it against this Final Checklist:
   - Is each user story testable?
   - Are acceptance criteria clear and specific?
   - Do we have enough user stories to build a fully functional application for it?
   - Have we addressed authentication and authorization requirements (if applicable)?   

6. Format your PRD:
    - Maintain consistent formatting and numbering.
  	- Don't format text in markdown bold "**", we don't need this.
  	- List ALL User Stories in the output!
		- Format the PRD in valid Markdown, with no extraneous disclaimers.