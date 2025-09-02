

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Field } from "@/app/dashboard/smart-fields/page";
import { z } from "zod";
import { translations } from "@/lib/translations";

export const supportedLanguages = z.enum([
    "English", "Hindi", "Marathi", "Tamil", "Telugu", "Kannada", "Punjabi", "Gujarati", "Odia"
]);
export type SupportedLanguage = z.infer<typeof supportedLanguages>;

export type LoanApplicationData = {
  name: string;
  state: string;
  cropType: string;
  loanAmount: number;
  landSize: number;
  bankName: string;
  approvedAmount: number;
  interestRate: number;
}

export type LoanApplication = LoanApplicationData & {
    id: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    submittedAt: string;
}

export type SchemeApplication = {
    id: string;
    schemeName: string;
    status: 'In Progress' | 'Approved' | 'Rejected';
    submittedAt: string;
}

type UserDataContextType = {
  farmerName: string | null;
  fields: Field[];
  loanApplications: LoanApplication[];
  schemeApplications: SchemeApplication[];
  isLoading: boolean;
  notificationsEnabled: boolean;
  language: SupportedLanguage;
  login: (name: string) => Promise<void>;
  setLanguage: (language: SupportedLanguage) => void;
  toggleNotifications: () => void;
  addField: (newField: Omit<Field, 'id'>) => void;
  deleteField: (id: string) => void;
  saveLoanApplication: (appData: LoanApplicationData) => string;
  updateLoanApplicationStatus: (id: string, status: LoanApplication['status']) => void;
  getApplication: (id: string) => LoanApplication | undefined;
  addSchemeApplication: (schemeName: string) => void;
  updateSchemeApplicationStatus: (id: string, status: SchemeApplication['status']) => void;
  logout: () => Promise<void>;
  translate: (text: string) => string;
};

const UserDataContext = React.createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [farmerName, setFarmerName] = React.useState<string | null>(null);
  const [fields, setFields] = React.useState<Field[]>([]);
  const [loanApplications, setLoanApplications] = React.useState<LoanApplication[]>([]);
  const [schemeApplications, setSchemeApplications] = React.useState<SchemeApplication[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [language, setLanguageState] = React.useState<SupportedLanguage>("English");
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    try {
        const storedName = localStorage.getItem("farmerName");
        const storedFields = localStorage.getItem("fields");
        const storedLoanApps = localStorage.getItem("loanApplications");
        const storedSchemeApps = localStorage.getItem("schemeApplications");
        const storedNotifications = localStorage.getItem("notificationsEnabled");
        const storedLanguage = localStorage.getItem("language");

        if (storedName) {
            setFarmerName(storedName);
        }
        if (storedFields) {
            const parsedFields = JSON.parse(storedFields).map((f: any) => ({...f, plantingDate: new Date(f.plantingDate)}));
            setFields(parsedFields);
        }
        if (storedLoanApps) {
            setLoanApplications(JSON.parse(storedLoanApps));
        }
        if (storedSchemeApps) {
            setSchemeApplications(JSON.parse(storedSchemeApps));
        }
        if (storedNotifications) {
            setNotificationsEnabled(JSON.parse(storedNotifications));
        }
        if (storedLanguage && supportedLanguages.options.includes(storedLanguage as SupportedLanguage)) {
            setLanguageState(storedLanguage as SupportedLanguage);
        }
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = async (name: string) => {
    setIsLoading(true);
    localStorage.setItem("farmerName", name);
    setFarmerName(name);
    // Initialize empty data for new user
    localStorage.setItem("fields", "[]");
    setFields([]);
    localStorage.setItem("loanApplications", "[]");
    setLoanApplications([]);
     localStorage.setItem("schemeApplications", "[]");
    setSchemeApplications([]);
    localStorage.setItem("language", "English");
    setLanguageState("English");
    router.push('/dashboard');
    setIsLoading(false);
  }
  
  const logout = async () => {
    localStorage.removeItem("farmerName");
    localStorage.removeItem("fields");
    localStorage.removeItem("loanApplications");
    localStorage.removeItem("schemeApplications");
    localStorage.removeItem("notificationsEnabled");
    localStorage.removeItem("language");
    setFarmerName(null);
    setFields([]);
    setLoanApplications([]);
    setSchemeApplications([]);
    setNotificationsEnabled(false);
    setLanguageState("English");
    router.push("/");
  };
  
  const setLanguage = (lang: SupportedLanguage) => {
      localStorage.setItem("language", lang);
      setLanguageState(lang);
  }

  const translate = React.useCallback((text: string) => {
      if (language === 'English' || !text) {
          return text;
      }
      return translations[text]?.[language] || text;
  }, [language]);


  const toggleNotifications = () => {
    setNotificationsEnabled(prev => {
        const newState = !prev;
        localStorage.setItem("notificationsEnabled", JSON.stringify(newState));
        if (newState && "Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
        return newState;
    });
  }

  const addField = (newFieldData: Omit<Field, 'id'>) => {
    const newField: Field = {
        ...newFieldData,
        id: new Date().toISOString(), // Simple unique ID
    };
    setFields(prevFields => {
        const updatedFields = [...prevFields, newField];
        localStorage.setItem("fields", JSON.stringify(updatedFields));
        return updatedFields;
    });
  };

  const deleteField = (id: string) => {
     setFields(prevFields => {
        const updatedFields = prevFields.filter(field => field.id !== id);
        localStorage.setItem("fields", JSON.stringify(updatedFields));
        return updatedFields;
     });
  };

  const saveLoanApplication = (appData: LoanApplicationData): string => {
    const appId = `APP-${Date.now()}`;
    const newApp: LoanApplication = {
        ...appData,
        id: appId,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
    };
    setLoanApplications(prev => {
        const updatedApps = [newApp, ...prev];
        localStorage.setItem("loanApplications", JSON.stringify(updatedApps));
        return updatedApps;
    });
    return appId;
  };
  
  const updateLoanApplicationStatus = (id: string, status: LoanApplication['status']) => {
    setLoanApplications(prev => {
        const updatedApps = prev.map(app => app.id === id ? {...app, status} : app);
        localStorage.setItem("loanApplications", JSON.stringify(updatedApps));
        return updatedApps;
    });
  };

  const getApplication = (id: string) => {
    return loanApplications.find(app => app.id === id);
  };
  
  const addSchemeApplication = (schemeName: string) => {
    const newApp: SchemeApplication = {
        id: `SCH-${Date.now()}`,
        schemeName,
        status: 'In Progress',
        submittedAt: new Date().toISOString(),
    };
    setSchemeApplications(prev => {
        const updatedApps = [newApp, ...prev];
        localStorage.setItem("schemeApplications", JSON.stringify(updatedApps));
        return updatedApps;
    });
  };

  const updateSchemeApplicationStatus = (id: string, status: SchemeApplication['status']) => {
    setSchemeApplications(prev => {
        const updatedApps = prev.map(app => app.id === id ? {...app, status} : app);
        localStorage.setItem("schemeApplications", JSON.stringify(updatedApps));
        return updatedApps;
    });
  }

  const value = {
    farmerName,
    fields,
    loanApplications,
    schemeApplications,
    isLoading,
    notificationsEnabled,
    language,
    login,
    setLanguage,
    toggleNotifications,
    addField,
    deleteField,
    saveLoanApplication,
    updateLoanApplicationStatus,
    getApplication,
    addSchemeApplication,
    updateSchemeApplicationStatus,
    logout,
    translate,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = React.useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
