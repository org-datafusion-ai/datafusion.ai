export function buildPrompt(fileContent: string): string {
        return `Please extract the following information from the text below and return it in JSON format, Do NOT include any markdown syntax, explanations, commentary, or formatting like "\`\`\`json".:
  == Required Fields and Constraints ==
    1. Engagement Name: Please follow the 3 rules listed below:  
      - Free text, 71 characters max, Engagement Name MUST include "RPExxxxx" number. Format example: "RPExxxxx - Engagement Name". 
      - it could refer to Opportunity, Application, Project. 
      - Leave it blank if do not see from the input text, Do not infer or guess.
    2. Engagement Summary: Free text, max 500 characters. (Initial summary/description of the proposed project.)
    3. OIE Manager: Name of the OIE Manager, if mentioned. Usualy is the Manager from Industry Engagement department of QUT.
    4. Opportunity Name: Max 120 characters. Should include "Application number" + "Opportunity/Application/project title", can return ONLY the title if no Application number been found. The name is usually the same as the Engagement Name but not always.
    5. Opportunity Type: Only choose from these five options listed below, any other response will be replaced by "None of the above". This is non-negotiable. 
     - Grant 
     - Commercial Research
     - Consultancy
     - Multifaceted Partnership
     - None of the above 

    6. Amount: If a dollar amount is mentioned, return only the digits (no symbols or commas). For example, 45000. If multiple Amounts exist, return the highest amount.

    == Industry Partner Company Information ==
    7. Partner Name: (Account name)
    8. Partner ABN
    9. Partner Company Website
    10. Partner Company Main Address
    11. Partner Company Category: **Must** select only ONE from the following categories (exact spelling):
      - Corporate 
      - University
      - Not For Profit 
      - Trust or Foundation 
      - Professional Association
      - Government Body-Commonwealth 
      - Government Body- International
      - Government Body- Local
      If the Category does not match exactly, please infer or guess base on the categories above.

    12. Partner/project Industry Classification: **Must** select only ONE from the following categories (exact spelling):
      - A - Agriculture, Forestry and Fishing
      - B - Mining
      - C - Manufacturing
      - D - Electricity, Gas, Water and Waste Services
      - E - Construction
      - F - Wholesale Trade
      - G - Retail Trade
      - H - Accommodation and Food Services
      - I - Transport, Postal and Warehousing
      - J - Information Media and Telecommunications
      - K - Financial and Insurance Services
      - L - Rental, Hiring and Real Estate Services
      - M - Professional, Scientific and Technical Services
      - N - Administrative and Support Services
      - O - Public Administration and Safety
      - P - Education and Training
      - Q - Health Care and Social Assistance
      - R - Arts and Recreation Services
      - S - Other Services
    If Partner Company Category is 'University', then Partner Industry Classification should be 'P - Education and Training'.If the classification does not match exactly, please infer or guess base on the categories above.

    13. Partner/project Industry Sub-Classification: **Must** select only ONE from the following sub-categories based on the classification above:
      - A01 Agriculture
      - A02 Aquaculture
      - A03 Forestry and Logging
      - A04 Fishing, Hunting and Trapping
      - A05 Agriculture, Forestry and Fishing Support Services
      - B06 Coal Mining
      - B07 Oil and Gas Extraction
      - B08 Metal Ore Mining
      - B09 Non-Metallic Mineral Mining and Quarrying
      - B10 Exploration and Other Mining Support Services
      - C11 Food Product Manufacturing
      - C12 Beverage and Tobacco Product Manufacturing
      - C13 Textile, Leather, Clothing and Footwear Manufacturing
      - C14 Wood Product Manufacturing
      - C15 Pulp, Paper and Converted Paper Product Manufacturing
      - C16 Printing (including the Reproduction of Recorded Media)
      - C17 Petroleum and Coal Product Manufacturing
      - C18 Basic Chemical and Chemical Product Manufacturing
      - C19 Polymer Product and Rubber Product Manufacturing
      - C20 Non-Metallic Mineral Product Manufacturing
      - C21 Primary Metal and Metal Product Manufacturing
      - C22 Fabricated Metal Product Manufacturing
      - C23 Transport Equipment Manufacturing
      - C24 Machinery and Equipment Manufacturing
      - C25 Furniture and Other Manufacturing
      - D26 Electricity Supply
      - D27 Gas Supply
      - D28 Water Supply, Sewerage and Drainage Services
      - D29 Waste Collection, Treatment and Disposal Services
      - E30 Building Construction
      - E31 Heavy and Civil Engineering Construction
      - E32 Construction Services
      - F33 Basic Material Wholesaling
      - F34 Machinery and Equipment Wholesaling
      - F35 Motor Vehicle and Motor Vehicle Parts Wholesaling
      - F36 Grocery, Liquor and Tobacco Product Wholesaling
      - F37 Other Goods Wholesaling
      - F38 Commission-Based Wholesaling
      - G39 Motor Vehicle and Motor Vehicle Parts Retailing
      - G40 Fuel Retailing
      - G41 Food Retailing
      - G42 Other Store-Based Retailing
      - G43 Non-Store Retailing and Retail Commission-Based Buying and/or Selling
      - H44 Accommodation
      - H45 Food and Beverage Services
      - I46 Road Transport
      - I47 Rail Transport
      - I48 Water Transport
      - I49 Air and Space Transport
      - I50 Other Transport
      - I51 Postal and Courier Pick-up and Delivery Services
      - I52 Transport Support Services
      - J54 Publishing (except Internet and Music Publishing)
      - J55 Motion Picture and Sound Recording Activities
      - J56 Broadcasting (except Internet)
      - J57 Internet Publishing and Broadcasting
      - J58 Telecommunications Services
      - J59 Internet Service Providers, Web Search Portals and Data Processing Services
      - J60 Library and Other Information Services
      - K62 Finance
      - K63 Insurance and Superannuation Funds
      - K64 Auxiliary Finance and Insurance Services
      - L66 Rental and Hiring Services (except Real Estate)
      - L67 Property Operators and Real Estate Services
      - M69 Professional, Scientific and Technical Services (except Computer System Design and Related Services)
      - M70 Computer System Design and Related Services
      - N72 Administrative Services
      - N73 Building Cleaning, Pest Control and Other Support Services
      - O75 Public Administration
      - O76 Defence
      - O77 Public Order, Safety and Regulatory Services
      - P80 Preschool and School Education
      - P81 Tertiary Education
      - P82 Adult, Community and Other Education
      - P83 Educational Support Services
      - Q84 Hospitals
      - Q85 Medical and Other Health Care Services
      - Q86 Residential Care Services
      - Q87 Social Assistance Services
      - R89 Heritage Activities
      - R90 Creative and Performing Arts Activities
      - R91 Sports and Recreation Activities
      - R92 Gambling Activities
      - S94 Repair and Maintenance
      - S95 Personal and Other Services
      - S96 Private Households Employing Staff and Undifferentiated Goods- and Service-Producing Activities of Households for Own Use
    If the sub-classification does not match exactly, please infer or guess base on the sub-categories above.

    == Industry Partner Contact Person(Can be either a private researcher or organization, should not include the OIE team) ==
    14. Partner Contact organisation: If multiple organisation exist, return them as a list/array.
    15. Partner Contact First Name: If multiple names exist, return them as a list/array.
    16. Partner Contact Last Name: If multiple names exist, return them as a list/array.
    17. Partner Contact Work Email: If multiple email exist, return them as a list/array. 
    18. Partner Contact Mobile Number: Return only phone numbers that belong to the **partner contact**, not to the OIE manager or other unrelated individuals. If multiple phone number exist, return them as a list/array.
    19. Partner Contact LinkedIn Profile URL
    20. Partner Contact Contextual Role: Must select only ONE from the following, Default to Primary Partner Contact if there is only one contact: 
      - Primary Partner Contact 
      - Partner Contact

    == Academic Contributors ==
    21. Academic Staff/Contributors Name: List **only academic staff aand the QUT staff who are mentioned as contributors to the project, includes the OIE team such as the OIE manager**. If multiple names exist, return them as a list/array.
    22. Academic Staff/Contributors Work Email: If multiple email exist, return them as a list/array. 
    23. Academic Staff/Contributors Mobile Number: If multiple phone number exist, return them as a list/array.
    24. Academic Staff/Contributors Contextual Role: Must select only ONE from the following, Default to Primary Partner Contact if there is only one contact: 
      - Chief Investigator
      - Co-Investigator
      - Finance Manager
      - Lead Researcher
      - Relationship Manager
      - Researcher
      - Secondary Investigator
      - Support
      - Other

    == Documents ==
    25. Document to Add to OIE Library: Only include documents (PDF, Word, Excel, or TXT files) that were **provided by the partner or partner contact**. Exclude internal templates, guidelines, or forms unless explicitly shared by the partner.
    // Provide the titles of documents provided from the partner or partner's Contact. Only PDF, Excel, Word, or TXT file formats are allowed.If multiple files exist, return them as a list/array.

    == Output Format ==
    Please return the extracted result in the following **strict JSON structure**:
    All fields must be returned exactly in this structure. If data is missing, use an empty string ("") or "null" depending on field type. Do NOT guess missing values.
    {
    "Engagement Name": "",
    "Engagement Summary": "",
    "OIE Manager": "",
    "Opportunity Name": "",
    "Opportunity Type": "",
    "Amount": "",
    "Industry Partners": [
      {
        "Partner Name": "",
        "Partner ABN": "",
        "Partner Company Website": "",
        "Partner Company Main Address": "",
        "Partner Company Category": "",
        "Partner Industry Classification": "",
        "Partner Industry Sub-Classification": ""
      },
            {
        "Partner Name": "",
        "Partner ABN": "",
        "Partner Company Website": "",
        "Partner Company Main Address": "",
        "Partner Company Category": "",
        "Partner Industry Classification": "",
        "Partner Industry Sub-Classification": ""
      }
    ],
    please return each Partner Contacts as individle object like below
    "Partner Contacts": [
        {
        "Partner Contact organisation": "Nike",
        "Contextual Role": "Primary Partner Contact",
        "First Name": "Alice",
        "Last Name": "Chen",
        "Work Email": "abd@qut.edu.au",
        "Mobile Number": "0000000000",
        "LinkedIn Profile URL": ""
        },
        {
        "Partner Contact organisation": "Apple",
        "Contextual Role": "Partner Contact",
        "First Name": "John",
        "Last Name": "Smith",
        "Work Email": "uio@qut.edu.au",
        "Mobile Number": "1111111111",
        "LinkedIn Profile URL": ""
        }
    ],
    "Academic Staff/Contributors Name": : [
        {
        "Contextual Role": "Chief Investigator",
        "Full Name": "John Smith",
        "Work Email": "7bd@qut.edu.au",
        "Mobile Number": "2222222222",
        },
        {
        "Contextual Role": "Lead Researcher",
        "Full Name": "Dr. Alice Chen",
        "Work Email": "89d@qut.edu.au",
        "Mobile Number": "1111111111",
        },
    ],
    "Document to Add to OIE Library": ["Profile", "OIE form"]
    }
    
    == Formatting Rules ==
    - Output must be valid JSON with double quotes around all string values.
    - Do not include any markdown syntax or formatting like "\`\`\`json".
    - Do not include commentary or extra text.
    - Each contact (partner or academic) must be a separate object in the array.
    - Do not merge multiple names/emails/phones into a single string or array.
    - Only include documents shared by the partner (not internal forms).
    - For any missing value (except "Engagement Summary", "Industry Classification", or "Sub-Classification"), return "" or "null".

    == Text Content ==

${fileContent}
    `;
}