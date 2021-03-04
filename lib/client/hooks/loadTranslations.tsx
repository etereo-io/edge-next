import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useEffect } from 'react'
import { useRouter } from "next/router";

export default function() {

  i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          "example": "Hello"
        }
      },
      es: {
        translation: {
          "example": "Hola"
        }
      }
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });

  const { locale } = useRouter()
  
  useEffect(() => {
    if (locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale])
} 