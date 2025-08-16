
import { GoogleGenAI, Type } from "@google/genai";
import type { Scenario } from '../types';

// Use the API key directly for now
const API_KEY = "AIzaSyCQvGJqlEnAjXsxh9bLlFnLhVQQ2bkaXS8";

if (!API_KEY) {
  throw new Error("API_KEY not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const modelConfig = {
  model: "gemini-2.5-flash",
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        storyText: {
          type: Type.STRING,
          description: "الجزء التالي من القصة باللغة العربية. يجب أن يكون رومانسيًا ومضحكًا ومُطريًا.",
        },
        choices: {
          type: Type.ARRAY,
          description: "خياران أو ثلاثة للاعب باللغة العربية. إذا كانت هذه هي النهاية، يجب أن يحتوي الخيار الأول على نص مثل 'إلى الرسالة النهائية!'",
          items: {
            type: Type.STRING,
          },
        },
      },
      required: ["storyText", "choices"],
    },
    temperature: 0.8,
    topP: 0.95,
    systemInstruction: "أنت راوي قصص رومانسي وذكي، تصنع مغامرة لرجل ليُظهر لحبيبته كم يحبها. يجب أن تكون القصة مُطرية ومضحكة وتجعلها تشعر بأنها الشخص الأكثر تميزًا في العالم، كملكة أو إلهة. القصة يجب أن تكون باللغة العربية. اجعل القصة قصيرة وموجزة ومؤثرة. بعد 3-4 أدوار، قم بإنهاء القصة من خلال تقديم خيار واحد فقط يقول 'إلى الرسالة النهائية!'.",
  },
};

export const getNextScenario = async (history: string[]): Promise<Scenario> => {
  let prompt: string;

  if (history.length === 0) {
    prompt = "ابدأ القصة. أنت تخاطب الملكة الأسطورية التي أسرت قلبي. صف جمالها الذي لا يضاهى وقوتها الهادئة التي تضيء عالمي. ثم قدم لها خيارين لمغامرة اليوم.";
  } else {
    prompt = `هذه هي القصة حتى الآن:\n${history.join('\n')}\n\nاستمر في القصة بناءً على الاختيار الأخير، مع الحفاظ على الأسلوب الرومانسي والمضحك والمُطري. قدم لها خيارين جديدين.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelConfig.model,
      config: modelConfig.config,
      contents: prompt,
    });
    
    const jsonText = response.text.trim();
    // Basic validation in case the response is not valid JSON
    if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
        throw new Error("Invalid JSON response from API");
    }

    const scenario: Scenario = JSON.parse(jsonText);

    if (!scenario.storyText || !scenario.choices) {
      throw new Error("Parsed JSON is missing required fields.");
    }
    
    return scenario;
  } catch (error) {
    console.error("Error fetching next scenario from Gemini API:", error);
    // Provide a fallback scenario in case of an API error
    return {
      storyText: "يبدو أن نجوم القدر قد اضطربت للحظة. لكن لا تقلقي، يا ملكتي، فإن سحرك أقوى من أي عطل فني.",
      choices: ["لنحاول مرة أخرى!", "ربما نأخذ استراحة لتناول الشوكولاتة؟"]
    };
  }
};
