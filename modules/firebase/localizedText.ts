//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import {
  type Nil,
  isObject,
} from "@stanfordspezi/spezi-web-design-system/utils/misc";
import { getNavigatorLanguage } from "@stanfordspezi/spezi-web-design-system/utils/navigator";
import { isNil } from "es-toolkit";
import { type LocalizedText } from "@/modules/firebase/models";

export const createLocalizationHelpers = (locale: string) => {
  const possibleLocalesToCheck = [
    locale,
    locale.includes("-") ? locale.split("-").at(0) : null,
    "en",
    "en-US",
  ].filter(Boolean);

  const parseLocalizedText = (localizedText: LocalizedText) => {
    if (!isObject(localizedText)) return localizedText;
    for (const locale of possibleLocalesToCheck) {
      const text = localizedText[locale] as string | undefined;
      if (text !== undefined) {
        return text;
      }
    }
    const fallbackAnyText = Object.values(localizedText).at(0);
    if (fallbackAnyText === undefined) {
      console.error("localized text has no localisations provided");
      return "";
    }
    return fallbackAnyText;
  };

  const parseNilLocalizedText = (localizedText: Nil<LocalizedText>) =>
    isNil(localizedText) ? null : parseLocalizedText(localizedText);

  return { parseLocalizedText, parseNilLocalizedText };
};

const { parseLocalizedText, parseNilLocalizedText } = createLocalizationHelpers(
  getNavigatorLanguage(),
);

export { parseLocalizedText, parseNilLocalizedText };
