export interface SymptomData {
  bodyArea: string;
  duration: string;
  itchBurn: boolean;
  spreading: boolean;
  allergies: string;
  skinTone?: string;
}

export interface DiagnosisResult {
  conditions: {
    name: string;
    hindiName: string;
    confidence: 'High' | 'Possible' | 'Unlikely';
    description: string;
  }[];
  urgency: 'NOW' | 'WEEK' | 'HOME';
  advice: string;
}

export interface ScanRecord {
  id: string;
  timestamp: number;
  image: string;
  symptoms: SymptomData;
  result: DiagnosisResult;
}

export type AppStep = 'home' | 'capture' | 'quiz' | 'result' | 'history';
