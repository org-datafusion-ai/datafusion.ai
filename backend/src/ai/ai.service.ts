import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // to access .env
import { ConfigService } from '@nestjs/config';

import axios from 'axios';



@Injectable()
export class AIService {
//   private endpoint = process.env.AZURE_GPT4_ENDPOINT; 
//   private apiKey = process.env.AZURE_GPT4_API_KEY; 
private endpoint: string;
private apiKey: string;

constructor(private readonly configService: ConfigService) {
  this.endpoint = this.configService.get<string>('AZURE_GPT4_ENDPOINT') || '';
  this.apiKey = this.configService.get<string>('AZURE_GPT4_API_KEY') || '';

  // 驗證變數是否正確加載
  if (!this.endpoint) {
    throw new Error('AZURE_GPT4_ENDPOINT is not defined in environment variables.');
  }
  if (!this.apiKey) {
    throw new Error('AZURE_GPT4_API_KEY is not defined in environment variables.');
  }

}


  async testAPIConnection(): Promise<void> {
    console.log("the Endpointis inside of testAI:"+ process.env.AZURE_GPT4_ENDPOINT);

    
  const requestBody = {
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Test connection' }
    ],
    max_tokens: 5,
    temperature: 0.1
  };

  const headers = {
    'Content-Type': 'application/json',
    'api-key': this.apiKey
  };

  try {
    console.log('Request Body:', requestBody);
    console.log('Request Headers:', headers);

    const response = await axios.post(this.endpoint, requestBody, { headers });

    console.log('API Connection Successful:', response.status, response.statusText);
    console.log('Response Data:', response.data);
  } catch (error) {
    console.error('Failed to connect to API:', error.response?.data || error.message);
  }
    
  }


  async extractInformation(fileContent: string): Promise<any> {
    // Logging for debugging
    // console.log("This is inside of extractInformation function:", fileContent);
    // console.log("---------------");
    // console.log("This is the endpoint:", this.endpoint);
  
    // Define the chat-completion request payload
    const requestBody = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Please extract the following information from the text below and return it in JSON format, Do NOT include any markdown syntax, explanations, commentary, or formatting like "\`\`\`json".:
  == Required Fields and Constraints ==
    1. Engagement Name: Free text, 71 characters max, Engagement Name MUST include "RPExxxxx" number. Format example: "RPExxxxx - Engagement Name".
    2. Engagement Summary: Free text, max 500 characters. (Initial summary/description of the proposed project.)
    3. OIE Manager: Name of the OIE Manager, if mentioned.
    4. Opportunity Name: Max 120 characters. Should include "RPExxxxx" number + project title. Remainder of the name is usually the same as the Engagement Name.
    5. Opportunity Type: Only choose from these five options: "Grant", "Commercial Research", "Consultancy", "Multifaceted Partnership", "None of the above". Any other response will be replaced by "None of the above". This is non-negotiable.
    6. Amount: If a dollar amount is mentioned, return only the digits (no symbols or commas). Example: 45000

    == Partner Company Information ==
    7. Partner Name: (Account name)
    8. Partner ABN
    9. Partner Company Website
    10. Partner Company Main Address
    11. Partner Company Category
    12. Partner/project Industry Classification
    13. Partner/project Industry Sub-Classification

    == Partner Contact Person(Can be either a private researcher or organization, should not include the OIE team) ==
    14. Partner Contact First Name: If multiple names exist, return them as a list/array.
    15. Partner Contact Last Name: If multiple names exist, return them as a list/array.
    16. Partner Contact Work Email: If multiple email exist, return them as a list/array. 
    17. Partner Contact Mobile Number: Return only phone numbers that belong to the **partner contact**, not to the OIE manager or other unrelated individuals. If multiple phone number exist, return them as a list/array.
    18. Partner Contact LinkedIn Profile URL

    == Academic Contributors ==
    19. Academic Staff/Contributors Name: List **only academic staff who are explicitly mentioned as contributors to the project**. Do not include collaborators, prospective partners, or unrelated academics.If multiple names exist, return them as a list/array.
    // List of academic staff are directly contributs in the project (existing DEP contacts).One or more names of academic staff involved in the project. If multiple names exist, return them as a list/array.

    == Documents ==
    20. Document to Add to OIE Library: Only include documents (PDF, Word, Excel, or TXT files) that were **provided by the partner or partner contact**. Exclude internal templates, guidelines, or forms unless explicitly shared by the partner.
    // Provide the titles of documents provided from the partner or partner's Contact. Only PDF, Excel, Word, or TXT file formats are allowed.If multiple files exist, return them as a list/array.

    == Output Format ==
    Please return the extracted result in the following JSON structure:
    {
    "Engagement Name": "",
    "Engagement Summary": "",
    "OIE Manager": "",
    "Opportunity Name": "",
    "Opportunity Type": "",
    "Amount": "",
    "Partner Name": "",
    "Partner ABN": "",
    "Partner Company Website": "",
    "Partner Company Main Address": "",
    "Partner Company Category": "",
    "Partner Industry Classification": "",
    "Partner Industry Sub-Classification": "",
     "Partner Contacts": [
        {
        "First Name": "Alice",
        "Last Name": "Chen",
        "Work Email": "abd@qut.edu.au",
        "Mobile Number": "0000000000",
        "LinkedIn Profile URL": ""
        },
        {
        "First Name": "John",
        "Last Name": "Smith",
        "Work Email": "uio@qut.edu.au",
        "Mobile Number": "1111111111",
        "LinkedIn Profile URL": ""
        }
    ],
    "Academic Staff/Contributors Name": ["Dr. Alice Chen", "Prof. John Smith"],
    "Document to Add to OIE Library": ["Profile", "OIE form"]
    }

    == Notes ==
    - If any item is not found in the text, return the value as "null" or an empty string.
    - IMPORTANT: Return ONLY the raw JSON. Do NOT include any markdown syntax, explanations, commentary, or formatting like "\`\`\`json".
    - You should infer or guess values **only** for the fields, even if they are not explicitly mentioned. Use the overall context, project description, and domain-specific terms to infer appropriate values for these fields.:1. Partner Industry Classification.2. Partner Industry Sub-Classification
    - For all other fields, extract only what is explicitly stated in the text. Do not infer or guess.
    - Ensure all outputs comply with the character limits where applicable. 

    == Text Content ==
    ${fileContent}`
        }
    ],
    max_tokens: 1000,
    temperature: 0.7
    };
  
    const headers = {
      'Content-Type': 'application/json',
      'api-key': this.apiKey
    };
  
    try {
      const response = await axios.post(this.endpoint, requestBody, { headers });
  
      console.log('Response Data:', response.data);
  
      // Extract the response content
    //   const gptResponse = response.data.choices[0].message.content.trim();
    const gptResponse = response.data.choices[0].message.content;
    console.log('Raw GPT Response:', gptResponse);
      // Validate and Parse the JSON returned by GPT
  let extractedData;
  try {
    extractedData = JSON.parse(gptResponse.trim()); // Clean up and parse the response
    // console.log('Extracted Data:', extractedData);
  } catch (parseError) {
    console.error('Failed to parse GPT response into JSON:', parseError.message);
    throw new HttpException(
      'GPT response is not a valid JSON format. Please adjust your prompt or try again.',
      HttpStatus.BAD_REQUEST
    );
  }

  // Return the extracted data
  return extractedData;

  
      // Parse the JSON returned by GPT
    //   return JSON.parse(gptResponse);
    } catch (error) {
      console.error('Failed to process GPT request:', error.response?.data || error.message);
  
      // Throw an HTTP exception with more details
      throw new HttpException(
        'Failed to process GPT request. Please check the API connection or request format.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}